from __future__ import annotations

from datetime import datetime, timezone

import bcrypt
from sqlalchemy.orm import Session

from app.models_db.user import User
from app.repositories.user_repository import UserRepository


class UserService:
    """
    Serviço responsável pelo gerenciamento dos usuários.

    Toda a persistência é realizada através do
    UserRepository utilizando PostgreSQL.
    """

    # ==========================================================
    # SENHAS
    # ==========================================================

    @staticmethod
    def _hash_password(
        password: str,
    ) -> str:

        return bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt(),
        ).decode("utf-8")

    @staticmethod
    def verify_password(
        password: str,
        password_hash: str,
    ) -> bool:

        return bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8"),
        )

    # ==========================================================
    # CONSULTAS
    # ==========================================================

    @staticmethod
    def get_user_by_id(
        db: Session,
        user_id: int,
    ) -> User | None:

        return UserRepository.get_by_id(
            db,
            user_id,
        )

    @staticmethod
    def get_user_by_email(
        db: Session,
        email: str,
    ) -> User | None:

        return UserRepository.get_by_email(
            db,
            email.strip().lower(),
        )

    @staticmethod
    def get_user_by_name(
        db: Session,
        name: str,
    ) -> User | None:

        return UserRepository.get_by_name(
            db,
            name.strip(),
        )

    @staticmethod
    def list_users(
        db: Session,
    ) -> list[User]:

        return UserRepository.get_all(
            db,
        )
            # ==========================================================
    # CADASTRO
    # ==========================================================

    @staticmethod
    def create_user(
        db: Session,
        *,
        name: str,
        email: str,
        password: str,
        avatar: int,
        role: str = "user",
    ) -> User:
        """
        Cria um novo usuário.
        """

        if UserRepository.get_by_email(
            db,
            email.strip().lower(),
        ):
            raise ValueError(
                "E-mail já cadastrado."
            )

        if UserRepository.get_by_name(
            db,
            name.strip(),
        ):
            raise ValueError(
                "Nome de usuário já cadastrado."
            )

        user = User(

            name=name.strip(),

            email=email.strip().lower(),

            password_hash=UserService._hash_password(
                password
            ),

            avatar=avatar,

            role=role,

            active=True,

            created_at=datetime.now(
                timezone.utc
            ),

            last_login=None,

        )

        return UserRepository.create(
            db,
            user,
        )

    @staticmethod
    def create_admin(
        db: Session,
        *,
        name: str,
        email: str,
        password: str,
        avatar: int = 1,
    ) -> User:
        """
        Cria um administrador.
        """

        return UserService.create_user(

            db=db,

            name=name,

            email=email,

            password=password,

            avatar=avatar,

            role="admin",

        )

    # ==========================================================
    # VALIDAÇÕES
    # ==========================================================

    @staticmethod
    def user_exists(
        db: Session,
        *,
        email: str | None = None,
        name: str | None = None,
    ) -> bool:
        """
        Verifica se já existe um usuário.
        """

        if email is not None:

            if UserRepository.get_by_email(

                db,

                email.strip().lower(),

            ):

                return True

        if name is not None:

            if UserRepository.get_by_name(

                db,

                name.strip(),

            ):

                return True

        return False
            # ==========================================================
    # ATUALIZAÇÕES
    # ==========================================================

    @staticmethod
    def update_user(
        db: Session,
        user_id: int,
        **data,
    ) -> User | None:
        """
        Atualiza nome e/ou e-mail do usuário.
        """

        user = UserRepository.get_by_id(
            db,
            user_id,
        )

        if user is None:
            return None

        # ----------------------------
        # Nome
        # ----------------------------

        if "name" in data:

            existing = UserRepository.get_by_name(
                db,
                data["name"].strip(),
            )

            if (
                existing is not None
                and existing.id != user_id
            ):
                raise ValueError(
                    "Nome já utilizado."
                )

            user.name = data["name"].strip()

        # ----------------------------
        # Email
        # ----------------------------

        if "email" in data:

            email = data["email"].strip().lower()

            existing = UserRepository.get_by_email(
                db,
                email,
            )

            if (
                existing is not None
                and existing.id != user_id
            ):
                raise ValueError(
                    "E-mail já utilizado."
                )

            user.email = email

        return UserRepository.update(
            db,
            user,
        )

    # ==========================================================
    # AVATAR
    # ==========================================================

    @staticmethod
    def update_avatar(
        db: Session,
        user_id: int,
        avatar: int,
    ) -> User | None:

        user = UserRepository.get_by_id(
            db,
            user_id,
        )

        if user is None:
            return None

        user.avatar = avatar

        return UserRepository.update(
            db,
            user,
        )

    # ==========================================================
    # SENHA
    # ==========================================================

    @staticmethod
    def change_password(
        db: Session,
        user_id: int,
        new_password: str,
    ) -> User | None:

        user = UserRepository.get_by_id(
            db,
            user_id,
        )

        if user is None:
            return None

        user.password_hash = UserService._hash_password(
            new_password
        )

        return UserRepository.update(
            db,
            user,
        )

    # ==========================================================
    # LOGIN
    # ==========================================================

    @staticmethod
    def update_last_login(
        db: Session,
        user_id: int,
    ) -> None:

        user = UserRepository.get_by_id(
            db,
            user_id,
        )

        if user is None:
            return

        user.last_login = datetime.now(
            timezone.utc
        )

        UserRepository.update(
            db,
            user,
        )

    # ==========================================================
    # STATUS
    # ==========================================================

    @staticmethod
    def set_active(
        db: Session,
        user_id: int,
        active: bool,
    ) -> User | None:

        user = UserRepository.get_by_id(
            db,
            user_id,
        )

        if user is None:
            return None

        user.active = active

        return UserRepository.update(
            db,
            user,
        )

    # ==========================================================
    # PERFIL
    # ==========================================================

    @staticmethod
    def set_role(
        db: Session,
        user_id: int,
        role: str,
    ) -> User | None:

        user = UserRepository.get_by_id(
            db,
            user_id,
        )

        if user is None:
            return None

        user.role = role

        return UserRepository.update(
            db,
            user,
        )
            # ==========================================================
    # EXCLUSÃO
    # ==========================================================

    @staticmethod
    def delete_user(
        db: Session,
        user_id: int,
    ) -> bool:
        """
        Remove um usuário.
        """

        user = UserRepository.get_by_id(
            db,
            user_id,
        )

        if user is None:
            return False

        UserRepository.delete(
            db,
            user,
        )

        return True

    # ==========================================================
    # ESTATÍSTICAS
    # ==========================================================

    @staticmethod
    def count_users(
        db: Session,
    ) -> int:
        """
        Retorna a quantidade total de usuários.
        """

        return len(
            UserRepository.get_all(
                db,
            )
        )

    @staticmethod
    def list_admins(
        db: Session,
    ) -> list[User]:
        """
        Lista todos os administradores.
        """

        return [

            user

            for user in UserRepository.get_all(
                db,
            )

            if user.role == "admin"

        ]

    @staticmethod
    def count_admins(
        db: Session,
    ) -> int:
        """
        Retorna a quantidade de administradores.
        """

        return len(

            UserService.list_admins(
                db,
            )

        )

    @staticmethod
    def count_active_users(
        db: Session,
    ) -> int:
        """
        Retorna a quantidade de usuários ativos.
        """

        return sum(

            1

            for user in UserRepository.get_all(
                db,
            )

            if user.active

        )

    # ==========================================================
    # AUTENTICAÇÃO
    # ==========================================================

    @staticmethod
    def authenticate(
        db: Session,
        email: str,
        password: str,
    ) -> User | None:
        """
        Autentica um usuário pelo e-mail e senha.
        """

        user = UserRepository.get_by_email(

            db,

            email.strip().lower(),

        )

        if user is None:
            return None

        if not UserService.verify_password(

            password,

            user.password_hash,

        ):
            return None

        user.last_login = datetime.now(
            timezone.utc,
        )

        UserRepository.update(
            db,
            user,
        )

        return user