from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    func,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.core.database import Base

from typing import Optional

class Notification(Base):

    __tablename__ = "notifications"

    # ==========================================================
    # Identificação
    # ==========================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    # ==========================================================
    # Usuário
    # ==========================================================

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # ==========================================================
    # Conteúdo
    # ==========================================================

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    message: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    # ==========================================================
    # Partida relacionada
    # ==========================================================

    match_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("matches.id"),
        nullable=True,
        index=True,
    )

    # success | warning | error | info
    type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    # ==========================================================
    # Controle
    # ==========================================================

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # ==========================================================
    # Relacionamentos
    # ==========================================================

    user = relationship(
        "User",
        back_populates="notifications",
    )

    match = relationship(
        "Match",
    )
