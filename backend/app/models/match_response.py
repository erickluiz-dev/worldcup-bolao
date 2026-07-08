from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.team import Team
from app.models.stadium import Stadium


class MatchResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int

    home_team: Team

    away_team: Team

    stadium: Stadium

    date: str

    time: str

    stage: str

    group: Optional[str]

    round: int

    home_score: Optional[int]

    away_score: Optional[int]

    qualified_team_id: Optional[int]

    finished: bool