from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.stadium_service import (
    get_all_stadiums,
    get_stadium_by_id,
    get_stadiums_by_country,
)

router = APIRouter(
    prefix="/api/stadiums",
    tags=["Stadiums"],
)


@router.get("/")
def list_stadiums(
    db: Session = Depends(get_db),
):
    return get_all_stadiums(db)


@router.get("/{stadium_id}")
def find_stadium(
    stadium_id: int,
    db: Session = Depends(get_db),
):
    stadium = get_stadium_by_id(
        db,
        stadium_id,
    )

    if stadium is None:
        raise HTTPException(
            status_code=404,
            detail="Estádio não encontrado",
        )

    return stadium


@router.get("/country/{country}")
def list_country_stadiums(
    country: str,
    db: Session = Depends(get_db),
):
    return get_stadiums_by_country(
        db,
        country,
    )