from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    UniqueConstraint,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from sqlalchemy.sql import func

from app.core.database import Base


class Prediction(Base):
    """
    Modelo SQLAlchemy de palpites.
    """

    __tablename__ = "predictions"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "match_id",
            name="uq_prediction_user_match",
        ),
    )

    # ==========================================================
    # Identificação
    # ==========================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    # ==========================================================
    # Relacionamentos
    # ==========================================================

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    match_id: Mapped[int] = mapped_column(
        ForeignKey(
            "matches.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # ==========================================================
    # Palpite
    # ==========================================================

    home_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    away_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    # ==========================================================
    # Pontuação
    # ==========================================================

    points: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    # ==========================================================
    # Auditoria
    # ==========================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        onupdate=func.now(),
        nullable=True,
    )

    # ==========================================================
    # Relacionamentos ORM
    # ==========================================================

    user = relationship(
        "User",
        back_populates="predictions",
    )

    match = relationship(
        "Match",
        back_populates="predictions",
    )

    # ==========================================================
    # Utilidades
    # ==========================================================

    @property
    def prediction(self) -> str:
        return f"{self.home_score} x {self.away_score}"

    def __repr__(self) -> str:
        return (
            f"<Prediction("
            f"id={self.id}, "
            f"user_id={self.user_id}, "
            f"match_id={self.match_id}, "
            f"prediction='{self.home_score}x{self.away_score}', "
            f"points={self.points}"
            f")>"
        )