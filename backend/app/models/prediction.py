from pydantic import BaseModel, Field


class Prediction(BaseModel):
    """
    Representa um palpite realizado por um usuário.
    """

    id: int | None = None

    user_id: int = Field(..., description="Identificador do usuário")
    match_id: int = Field(..., description="Identificador da partida")

    home_score: int = Field(
        ...,
        ge=0,
        description="Placar previsto do mandante",
    )

    away_score: int = Field(
        ...,
        ge=0,
        description="Placar previsto do visitante",
    )

    points: int = Field(
        default=0,
        ge=0,
        description="Pontuação obtida neste palpite",
    )

    class Config:
        from_attributes = True