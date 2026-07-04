from typing import Optional

from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from app.services.auth_service import AuthService
from app.services.user_service import UserService

from datetime import datetime

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticação"],
)


# ==========================================================
# Models
# ==========================================================

class RegisterRequest(BaseModel):
    """
    Dados necessários para criação de um usuário.
    """

    name: str = Field(..., min_length=3, max_length=50)

    email: EmailStr

    password: str = Field(..., min_length=6)

    avatar: int = Field(..., ge=1, le=21)


class LoginRequest(BaseModel):
    """
    Dados de autenticação.
    """

    email: EmailStr

    password: str


class RefreshRequest(BaseModel):
    """
    Requisição para renovação do Access Token.
    """

    refresh_token: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    avatar: int
    role: str
    active: bool
    created_at: datetime
    last_login: datetime | None
    model_config = {
        "from_attributes": True
    }

class AuthResponse(BaseModel):
    """
    Resposta padrão de autenticação.
    """

    access_token: str

    refresh_token: str

    token_type: str

    user: UserResponse


# ==========================================================
# POST /register
# ==========================================================

@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    """
    Cria um novo usuário e realiza login automaticamente.
    """

    try:

        UserService.create_user(
            db=db,
            name=request.name,
            email=request.email,
            password=request.password,
            avatar=request.avatar,
        )

        return AuthService.authenticate(
            db,
            request.email,
            request.password,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


# ==========================================================
# POST /login
# ==========================================================

@router.post(
    "/login",
    response_model=AuthResponse,
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    """
    Autentica um usuário.
    """

    try:

        return AuthService.authenticate(
            db,
            request.email,
            request.password,
        )
    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
        )


# ==========================================================
# POST /refresh
# ==========================================================

@router.post(
    "/refresh",
)
def refresh(
    request: RefreshRequest,
    db: Session = Depends(get_db),
):
    """
    Gera um novo Access Token utilizando um Refresh Token válido.
    """

    try:

        return AuthService.refresh_access_token(
            db,
            request.refresh_token,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
        )
    
@router.get("/verify")
def verify(
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
):
    """
    Verifica se o Access Token é válido.
    """

    try:
        token = AuthService.extract_token(authorization)

        return {
            "authenticated": AuthService.is_authenticated(
                db,
                token,
            )
        }

    except ValueError:  

        return {
            "authenticated": False
        }

@router.post("/logout")
def logout():
    """
    Realiza o logout.

    Atualmente o JWT é stateless, então basta o
    frontend apagar os tokens.
    """

    return {
        "message": "Logout realizado com sucesso."
    }
# ==========================================================
# GET /me
# ==========================================================

@router.get("/me")
def me(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    user = AuthService.get_current_user(
        db,
        token,
    )

    permissions = []

    if user["role"] == "admin":
        permissions = [
            "users",
            "matches",
            "ranking",
        ]

    return {
        **user,
        "permissions": permissions,
    }

