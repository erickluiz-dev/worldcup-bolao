from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.match_response import MatchResponse

from app.models_db.match import Match

from app.schemas.match import (
    MatchCreate,
    MatchUpdate,
    MatchResult,
)

from app.services.match_service import MatchService

router = APIRouter(
    prefix="/api/matches",
    tags=["Matches"],
)


# ==========================================================
# Conversão SQLAlchemy -> Response
# ==========================================================

def to_match_response(
    match: Match,
) -> MatchResponse:

    return MatchResponse(

        id=match.id,

        home_team=match.home_team,

        away_team=match.away_team,

        stadium=match.stadium,

        date=match.date,

        time=match.time,

        stage=match.stage,

        group=match.group,

        round=match.round,

        home_score=match.home_score,

        away_score=match.away_score,

        qualified_team_id=match.qualified_team_id,

        finished=match.finished,

    )


# ==========================================================
# GET /
# ==========================================================

@router.get(
    "/",
    response_model=List[MatchResponse],
)
def list_matches(
    db: Session = Depends(get_db),
):

    matches = MatchService.get_all_matches(db)

    return [

        to_match_response(match)

        for match in matches

    ]


# ==========================================================
# GET /{id}
# ==========================================================

@router.get(
    "/{match_id}",
    response_model=MatchResponse,
)
def get_match(
    match_id: int,
    db: Session = Depends(get_db),
):

    match = MatchService.get_match_by_id(
        db,
        match_id,
    )

    if match is None:

        raise HTTPException(

            status_code=404,

            detail="Partida não encontrada.",

        )

    return to_match_response(match)


# ==========================================================
# GET /group/{group}
# ==========================================================

@router.get(
    "/group/{group}",
    response_model=List[MatchResponse],
)
def get_group_matches(
    group: str,
    db: Session = Depends(get_db),
):

    return [

        to_match_response(match)

        for match in MatchService.get_matches_by_group(
            db,
            group,
        )

    ]


# ==========================================================
# GET /stage/{stage}
# ==========================================================

@router.get(
    "/stage/{stage}",
    response_model=List[MatchResponse],
)
def get_stage_matches(
    stage: str,
    db: Session = Depends(get_db),
):

    return [

        to_match_response(match)

        for match in MatchService.get_matches_by_stage(
            db,
            stage,
        )

    ]


# ==========================================================
# GET /date/{date}
# ==========================================================

@router.get(
    "/date/{date}",
    response_model=List[MatchResponse],
)
def get_date_matches(
    date: str,
    db: Session = Depends(get_db),
):

    return [

        to_match_response(match)

        for match in MatchService.get_matches_by_date(
            db,
            date,
        )

    ]


# ==========================================================
# POST
# ==========================================================

@router.post(
    "/",
    response_model=MatchResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_match(
    data: MatchCreate,
    db: Session = Depends(get_db),
):

    match = Match(

        home_team_id=data.home_team_id,

        away_team_id=data.away_team_id,

        stadium_id=data.stadium_id,

        date=data.date,

        time=data.time,

        stage=data.stage,

        group=data.group,

        round=data.round,

        home_score=data.home_score,

        away_score=data.away_score,

        qualified_team_id=data.qualified_team_id,

        finished=data.finished,

    )

    try:

        match = MatchService.create_match(
            db,
            match,
        )

        return to_match_response(match)

    except ValueError as error:

        raise HTTPException(

            status_code=400,

            detail=str(error),

        )


# ==========================================================
# PUT
# ==========================================================

@router.put(
    "/{match_id}",
    response_model=MatchResponse,
)
def update_match(
    match_id: int,
    data: MatchUpdate,
    db: Session = Depends(get_db),
):

    updated = Match(

        home_team_id=data.home_team_id,

        away_team_id=data.away_team_id,

        stadium_id=data.stadium_id,

        date=data.date,

        time=data.time,

        stage=data.stage,

        group=data.group,

        round=data.round,

        home_score=data.home_score,

        away_score=data.away_score,

        qualified_team_id=data.qualified_team_id,

        finished=data.finished,

    )

    try:

        match = MatchService.update_match(

            db,

            match_id,

            updated,

        )

        return to_match_response(match)

    except ValueError as error:

        raise HTTPException(

            status_code=404,

            detail=str(error),

        )


# ==========================================================
# DELETE
# ==========================================================

@router.delete(
    "/{match_id}",
)
def delete_match(
    match_id: int,
    db: Session = Depends(get_db),
):

    try:

        MatchService.delete_match(

            db,

            match_id,

        )

        return {

            "message": "Partida removida com sucesso."

        }

    except ValueError as error:

        raise HTTPException(

            status_code=404,

            detail=str(error),

        )


# ==========================================================
# PATCH RESULT
# ==========================================================

@router.patch(
    "/{match_id}/result",
    response_model=MatchResponse,
)
def publish_result(
    match_id: int,
    result: MatchResult,
    db: Session = Depends(get_db),
):

    try:

        match = MatchService.update_match_result(

            db,

            match_id,

            result.home_score,

            result.away_score,

            result.qualified_team_id,

        )

        return to_match_response(match)

    except ValueError as error:

        raise HTTPException(

            status_code=404,

            detail=str(error),

        )