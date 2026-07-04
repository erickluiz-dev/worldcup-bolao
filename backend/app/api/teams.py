from typing import List

from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.team import Team
from app.services.team_service import TeamService

router = APIRouter(
    prefix="/api/teams",
    tags=["Teams"]
)


@router.get("/", response_model=List[Team])
def get_teams(
    db: Session = Depends(get_db),
):
    return TeamService.get_teams(db)
