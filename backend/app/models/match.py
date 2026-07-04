from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class Match(BaseModel):
    """
    Representa uma partida da Copa do Mundo.
    """

    model_config = ConfigDict(from_attributes=True)

    # ==========================================================
    # Identificação
    # ==========================================================

    id: Optional[int] = Field(
        default=None,
        description="Identificador único da partida."
    )

    # ==========================================================
    # Seleções
    # ==========================================================

    home_team: str = Field(
        ...,
        description="Nome da seleção mandante."
    )

    away_team: str = Field(
        ...,
        description="Nome da seleção visitante."
    )

    # ==========================================================
    # Estádio
    # ==========================================================

    stadium: str = Field(
        ...,
        description="Nome do estádio."
    )

    city: str = Field(
        ...,
        description="Cidade."
    )

    country: str = Field(
        ...,
        description="País."
    )

    # ==========================================================
    # Data
    # ==========================================================

    date: str = Field(
        ...,
        description="Data e horário da partida."
    )

    time: str = Field(
        ...,
        description="Horário da partida."
    )

    # ==========================================================
    # Competição
    # ==========================================================

    stage: str = Field(
        default="GROUP",
        description="Fase da competição."
    )

    group: Optional[str] = Field(
        default=None,
        max_length=1,
        description="Grupo da partida (A-H)."
    )

    round: int = Field(
        default=1,
        ge=1,
        description="Rodada da competição."
    )

    # ==========================================================
    # Resultado
    # ==========================================================

    home_score: Optional[int] = Field(
        default=None,
        ge=0,
        description="Gols da seleção mandante."
    )

    away_score: Optional[int] = Field(
        default=None,
        ge=0,
        description="Gols da seleção visitante."
    )

    finished: bool = Field(
        default=False,
        description="Indica se a partida foi finalizada."
    )

    # ==========================================================
    # Auditoria
    # ==========================================================

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Data de criação do registro."
    )

    updated_at: Optional[datetime] = Field(
        default=None,
        description="Data da última atualização."
    )

    # ==========================================================
    # Utilidades
    # ==========================================================

    @property
    def has_result(self) -> bool:
        """
        Verifica se a partida possui um resultado registrado.
        """

        return (
            self.home_score is not None
            and self.away_score is not None
        )

    @property
    def is_group_stage(self) -> bool:
        """
        Indica se a partida pertence à fase de grupos.
        """     

        return self.stage == "GROUP"

    @property
    def winner(self) -> Optional[str]:
        """
        Retorna o ID da seleção vencedora.

        None = empate ou partida sem resultado.
        """

        if not self.has_result:
            return None

        if self.home_score > self.away_score:
            return self.home_team

        if self.away_score > self.home_score:
            return self.away_team

        return None

    @property
    def is_draw(self) -> bool:
        """
        Verifica se a partida terminou empatada.
        """

        if not self.has_result:
            return False

        return self.home_score == self.away_score