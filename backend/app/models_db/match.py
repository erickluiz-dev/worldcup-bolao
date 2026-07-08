from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from sqlalchemy.sql import func

from app.core.database import Base


class Match(Base):
    """
    Modelo SQLAlchemy de partidas.
    """

    __tablename__ = "matches"

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

    home_team_id: Mapped[int] = mapped_column(
        ForeignKey("teams.id"),
        nullable=False,
        index=True,
    )

    away_team_id: Mapped[int] = mapped_column(
        ForeignKey("teams.id"),
        nullable=False,
        index=True,
    )

    stadium_id: Mapped[int] = mapped_column(
        ForeignKey("stadiums.id"),
        nullable=False,
        index=True,
    )

    # ==========================================================
    # Dados da partida
    # ==========================================================

    date: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    time: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
    )

    stage: Mapped[str] = mapped_column(
        String(30),
        default="GROUP",
        nullable=False,
    )

    group: Mapped[str | None] = mapped_column(
        String(2),
        nullable=True,
    )

    round: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )

    # ==========================================================
    # Resultado
    # ==========================================================

    home_score: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    away_score: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    qualified_team_id: Mapped[int | None] = mapped_column(
        ForeignKey("teams.id"),
        nullable=True,
    )

    finished: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
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
    # Relacionamentos
    # ==========================================================

    home_team = relationship(
        "Team",
        foreign_keys=[home_team_id],
        back_populates="home_matches",
    )

    away_team = relationship(
        "Team",
        foreign_keys=[away_team_id],
        back_populates="away_matches",
    )

    qualified_team = relationship(
        "Team",
        foreign_keys=[qualified_team_id],
    )

    stadium = relationship(
        "Stadium",
        back_populates="matches",
    )

    predictions = relationship(
        "Prediction",
        back_populates="match",
        cascade="all, delete-orphan",
    )

    # ==========================================================
    # Utilidades
    # ==========================================================

    @property
    def has_result(self) -> bool:
        return (
            self.home_score is not None
            and self.away_score is not None
        )

    @property
    def is_group_stage(self) -> bool:
        return self.stage == "GROUP"

    @property
    def winner_id(self) -> int | None:

        if not self.has_result:
            return None 

        if self.home_score > self.away_score:
            return self.home_team_id

        if self.away_score > self.home_score:
            return self.away_team_id

        return self.qualified_team_id

    @property
    def is_draw(self) -> bool:

        if not self.has_result:
            return False

        return self.home_score == self.away_score

    def __repr__(self) -> str:
        return (
            f"<Match("
            f"id={self.id}, "
            f"home_team_id={self.home_team_id}, "
            f"away_team_id={self.away_team_id}, "
            f"stage='{self.stage}', "
            f"qualified_team_id={self.qualified_team_id}"
            f")>"
        )