from typing import Optional

from pydantic import BaseModel, ConfigDict


class MatchCreate(BaseModel):

    home_team_id: int
    away_team_id: int
    stadium_id: int

    date: str
    time: str

    stage: str
    group: Optional[str]

    round: int

    home_score: Optional[int] = None
    away_score: Optional[int] = None

    finished: bool = False


class MatchUpdate(MatchCreate):
    pass


class MatchResult(BaseModel):

    home_score: int
    away_score: int


class MatchRead(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int

    home_team_id: int
    away_team_id: int
    stadium_id: int

    date: str
    time: str

    stage: str
    group: Optional[str]

    round: int

    home_score: Optional[int]
    away_score: Optional[int]

    finished: bool