from pydantic import BaseModel, ConfigDict


class PredictionCreate(BaseModel):

    user_id: int

    match_id: int

    home_score: int

    away_score: int


class PredictionUpdate(BaseModel):

    home_score: int

    away_score: int


class PredictionRead(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int

    user_id: int

    match_id: int

    home_score: int

    away_score: int

    points: int