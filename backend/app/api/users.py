from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from app.services.user_service import UserService

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)

# ==========================================================
# Models
# ==========================================================

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


class CreateUserRequest(BaseModel):

    name: str = Field(
        ...,
        min_length=3,
        max_length=50,
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6,
    )

    avatar: int = Field(
        ...,
        ge=1,
        le=21,
    )

    role: str = "user"


class UpdateUserRequest(BaseModel):

    name: Optional[str] = None

    email: Optional[EmailStr] = None

    avatar: Optional[int] = Field(
        default=None,
        ge=1,
        le=21,
    )

    role: Optional[str] = None

    active: Optional[bool] = None

    password: Optional[str] = None

# ==========================================================
# GET /users
# ==========================================================

@router.get(
    "/",
    response_model=list[UserResponse],
)
def get_users(
    db: Session = Depends(get_db),
):
    """
    Retorna todos os usuários cadastrados.
    """

    return UserService.list_users(db)


# ==========================================================
# GET /users/{id}
# ==========================================================

@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    """
    Retorna um usuário pelo ID.
    """

    user = UserService.get_user_by_id(
        db,
        user_id,
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado.",
        )

    return user

# ==========================================================
# POST /users
# ==========================================================

@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    request: CreateUserRequest,
    db: Session = Depends(get_db),
):
    """
    Cria um novo usuário.
    """

    try:

        return UserService.create_user(
            db=db,

            name=request.name,

            email=request.email,

            password=request.password,

            avatar=request.avatar,

            role=request.role,

        )

    except ValueError as error:

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail=str(error),

        )


# ==========================================================
# PUT /users/{id}
# ==========================================================

@router.put(
    "/{user_id}",
    response_model=UserResponse,
)
def update_user(
    user_id: int,
    request: UpdateUserRequest,
    db: Session = Depends(get_db),
):
    """
    Atualiza um usuário.
    """

    user = UserService.get_user_by_id(
        db,
        user_id,
    )
    if user is None:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Usuário não encontrado.",

        )

    try:

        if request.name is not None or request.email is not None:

            user = UserService.update_user(
                db,
                user_id,

                **request.model_dump(
                    exclude_unset=True,
                    exclude={
                        "avatar",
                        "role",
                        "active",
                        "password",
                    },
                ),

            )

        if request.avatar is not None:

            UserService.update_avatar(
                db,
                user_id,

                request.avatar,

            )

        if request.role is not None:

            user = UserService.set_role(

                user_id,

                request.role,

            )

        if request.active is not None:

            user = UserService.set_active(
                db,
                user_id,

                request.active,

            )

        if (

            request.password is not None

            and request.password.strip()

        ):

            user = UserService.change_password(
                db,
                user_id,

                request.password,

            )

        return UserService.get_user_by_id(
            db,
            user_id
        )

    except ValueError as error:

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail=str(error),

        )


# ==========================================================
# DELETE /users/{id}
# ==========================================================

@router.delete(
    "/{user_id}",
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    """
    Remove um usuário.
    """

    deleted = UserService.delete_user(
        db,
        user_id
    )

    if not deleted:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Usuário não encontrado.",

        )

    return {

        "message": "Usuário removido com sucesso."

    }