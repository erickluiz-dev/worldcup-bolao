from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class User(BaseModel):
    """
    Representa um usuário do sistema de Bolão da Copa do Mundo.
    """

    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = Field(
        default=None,
        description="Identificador único do usuário.",
        examples=[1],
    )

    name: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="Nome completo do usuário.",
        examples=["Erick Luiz"],
    )

    email: EmailStr = Field(
        ...,
        description="Endereço de e-mail do usuário.",
        examples=["erick@email.com"],
    )

    password_hash: str = Field(
        ...,
        description="Hash da senha gerado com bcrypt.",
    )

    avatar: int = Field(
        default=1,
        ge=1,
        le=21,
        description="Avatar escolhido pelo usuário (1 a 21).",
        examples=[7],
    )

    role: str = Field(
        default="user",
        description="Perfil de acesso do usuário (user ou admin).",
        examples=["user"],
    )

    active: bool = Field(
        default=True,
        description="Indica se o usuário está ativo no sistema.",
        examples=[True],
    )

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Data e hora de criação da conta.",
    )

    last_login: Optional[datetime] = Field(
        default=None,
        description="Data e hora do último login do usuário.",
    )