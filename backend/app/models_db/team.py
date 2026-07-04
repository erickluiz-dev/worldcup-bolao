from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.core.database import Base


class Team(Base):
    """
    Modelo SQLAlchemy de seleções.
    """

    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    group: Mapped[str] = mapped_column(
        String(2),
        nullable=False,
        index=True,
    )

    code: Mapped[str] = mapped_column(
        String(5),
        nullable=False,
        unique=True,
    )

    flag: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # ==========================
    # Relacionamentos
    # ==========================

    home_matches = relationship(
        "Match",
        foreign_keys="Match.home_team_id",
        back_populates="home_team",
    )

    away_matches = relationship(
        "Match",
        foreign_keys="Match.away_team_id",
        back_populates="away_team",
    )

    def __repr__(self) -> str:
        return (
            f"<Team("
            f"id={self.id}, "
            f"name='{self.name}', "
            f"group='{self.group}'"
            f")>"
        )