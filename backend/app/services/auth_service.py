from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from jwt import ExpiredSignatureError, InvalidTokenError

from app.models.user import User
from app.services.user_service import UserService
from sqlalchemy.orm import Session

class AuthService:
    """
    Serviço responsável por autenticação e autorização.

    Responsabilidades:
        • autenticar usuários;
        • gerar Access Token;
        • gerar Refresh Token;
        • validar tokens;
        • recuperar usuário autenticado.
    """

    # ==========================================================
    # Configurações JWT
    # ==========================================================

    import os

    from dotenv import load_dotenv

    load_dotenv()
    
    SECRET_KEY = os.getenv("JWT_SECRET")

    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv(
            "JWT_EXPIRE_MINUTES",
            60,
        )
    )

    REFRESH_TOKEN_EXPIRE_DAYS = int(
        os.getenv(
            "REFRESH_TOKEN_EXPIRE_DAYS",
            30,
        )
    )

    ALGORITHM = "HS256"

    # ==========================================================
    # Geração de Tokens
    # ==========================================================

    @classmethod
    def create_access_token(
        cls,
        user: User,
    ) -> str:
        """
        Gera um Access Token.
        """

        expire = datetime.now(timezone.utc) + timedelta(
            minutes=cls.ACCESS_TOKEN_EXPIRE_MINUTES
        )

        payload = {
            "sub": str(user.id),
            "name": user.name,
            "role": user.role,
            "avatar": user.avatar,
            "type": "access",
            "exp": expire,
            "iat": datetime.now(timezone.utc),
        }

        return jwt.encode(
            payload,
            cls.SECRET_KEY,
            algorithm=cls.ALGORITHM,
        )

    @classmethod
    def create_refresh_token(
        cls,
        user: User,
    ) -> str:
        """
        Gera um Refresh Token.
        """

        expire = datetime.now(timezone.utc) + timedelta(
            days=cls.REFRESH_TOKEN_EXPIRE_DAYS
        )

        payload = {
            "sub": str(user.id),
            "type": "refresh",
            "exp": expire,
            "iat": datetime.now(timezone.utc),
        }

        return jwt.encode(
            payload,
            cls.SECRET_KEY,
            algorithm=cls.ALGORITHM,
        )

    # ==========================================================
    # Validação de Tokens
    # ==========================================================

    @classmethod
    def decode_token(
        cls,
        token: str,
    ) -> dict[str, Any]:
        """
        Decodifica um JWT.
        """

        try:

            payload = jwt.decode(
                token,
                cls.SECRET_KEY,
                algorithms=[cls.ALGORITHM],
            )

            return payload

        except ExpiredSignatureError:
            raise ValueError("Token expirado.")

        except InvalidTokenError:
            raise ValueError("Token inválido.")

    @classmethod
    def get_user_from_token(
        cls,
        db: Session,
        token: str,
    ) -> User:
        """
        Recupera o usuário a partir do Access Token.
        """

        payload = cls.decode_token(token)

        if payload.get("type") != "access":
            raise ValueError("Token inválido.")

        user_id = int(payload["sub"])

        user = UserService.get_user_by_id(
            db,
            user_id,
        )

        if user is None:
            raise ValueError("Usuário não encontrado.")

        if not user.active:
            raise ValueError("Usuário inativo.")

        return user

    # ==========================================================
    # Autenticação
    # ==========================================================

    @classmethod
    def authenticate(
        cls,
        db: Session,
        email: str,
        password: str,
    ) -> dict[str, Any]:
        """
        Autentica um usuário utilizando e-mail e senha.
        """

        user = UserService.get_user_by_email(
            db,
            email,
        )

        if user is None:
            raise ValueError("E-mail ou senha inválidos.")

        if not user.active:
            raise ValueError("Usuário desativado.")

        password_ok = UserService.verify_password(
            password,
            user.password_hash,
        )

        if not password_ok:
            raise ValueError("E-mail ou senha inválidos.")

        # Atualiza a data do último login
        UserService.update_last_login(
            db,
            user.id,
        )

        user = UserService.get_user_by_id(
            db,
            user.id,
        )

        access_token = cls.create_access_token(user)
        refresh_token = cls.create_refresh_token(user)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "avatar": user.avatar,
                "role": user.role,
                "active": user.active,
                "created_at": user.created_at,
                "last_login": datetime.now(timezone.utc),
            },
        }

    # ==========================================================
    # Refresh Token
    # ==========================================================

    @classmethod
    def refresh_access_token(
            cls,
            db: Session,
            refresh_token: str,
        )-> dict[str, Any]:
        """
        Gera um novo Access Token a partir de um Refresh Token.
        """

        payload = cls.decode_token(refresh_token)

        if payload.get("type") != "refresh":
            raise ValueError("Refresh Token inválido.")

        user_id = int(payload["sub"])

        user = UserService.get_user_by_id(
            db,
            user_id,
        )

        if user is None:
            raise ValueError("Usuário não encontrado.")

        if not user.active:
            raise ValueError("Usuário desativado.")

        new_access_token = cls.create_access_token(user)

        return {
            "access_token": new_access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    # ==========================================================
    # Dados do Usuário
    # ==========================================================

    @classmethod
    def get_current_user(
        cls,
        db: Session,
        token: str,
    ) -> dict[str, Any]:
        """
        Retorna os dados do usuário autenticado.
        """

        user = cls.get_user_from_token(
            db,
            token,
        )

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "avatar": user.avatar,
            "role": user.role,
            "active": user.active,
            "created_at": user.created_at,
            "last_login": user.last_login,
        }

    # ==========================================================
    # Permissões
    # ==========================================================

    @classmethod
    def is_admin(
        cls,
        db: Session,
        token: str,
    ) -> bool:
        """
        Verifica se o usuário autenticado é administrador.
        """

        user = cls.get_user_from_token(
            db,
            token,
        )

        return user.role == "admin"

    @classmethod
    def require_admin(
        cls,
        db: Session,
        token: str,
    ) -> User:
        """
        Garante que o usuário autenticado seja administrador.
        """

        user = cls.get_user_from_token(
            db,
            token,
        )

        if user.role != "admin":
            raise PermissionError(
                "Acesso permitido apenas para administradores."
            )

        return user

    # ==========================================================
    # Utilidades
    # ==========================================================

    @classmethod
    def verify_access_token(
        cls,
        token: str,
    ) -> bool:
        """
        Verifica se um Access Token é válido.
        """

        try:

            payload = cls.decode_token(token)

            return payload.get("type") == "access"

        except Exception:
            return False

    @classmethod
    def verify_refresh_token(
        cls,
        token: str,
    ) -> bool:
        """
        Verifica se um Refresh Token é válido.
        """

        try:

            payload = cls.decode_token(token)

            return payload.get("type") == "refresh"

        except Exception:
            return False
        
    
    @classmethod
    def is_authenticated(
        cls,
        db: Session,
        token: str,
    ) -> bool:
        """
        Verifica se o token pertence a um usuário válido.
        """

        try:
            cls.get_user_from_token(
                db,
                token,
            )
            return True

        except Exception:
            return False
    @staticmethod
    def extract_token(authorization: str | None) -> str:
        """
        Extrai o JWT do header Authorization.
        """

        if authorization is None:
            raise ValueError("Token não informado.")

        if not authorization.startswith("Bearer "):
            raise ValueError("Formato do token inválido.")

        return authorization.replace("Bearer ", "").strip()