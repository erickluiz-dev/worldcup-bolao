from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.core.database import Base


class Stadium(Base):
    """
    Modelo SQLAlchemy de estádios.
    """

    __tablename__ = "stadiums"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        unique=True,
        index=True,
    )

    city: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    country: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    # ==========================================================
    # Relacionamentos
    # ==========================================================

    matches = relationship(
        "Match",
        back_populates="stadium",
        cascade="all, save-update",
    )

    def __repr__(self) -> str:
        return (
            f"<Stadium("
            f"id={self.id}, "
            f"name='{self.name}', "
            f"city='{self.city}'"
            f")>"
        )
    
    def __repr__(self) -> str:
        return (
            f"<Stadium("
            f"id={self.id}, "
            f"name='{self.name}', "
            f"city='{self.city}'"
            f")>"
        )