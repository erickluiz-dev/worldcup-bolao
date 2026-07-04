from pydantic import BaseModel


class Result(BaseModel):
    id: int
    match_id: int

    home_team: str
    away_team: str

    home_score: int
    away_score: int

    finished: bool = True