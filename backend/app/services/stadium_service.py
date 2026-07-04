from sqlalchemy.orm import Session

from app.repositories.stadium_repository import StadiumRepository


def get_all_stadiums(
    db: Session,
):
    return StadiumRepository.get_all(db)


def get_stadium_by_id(
    db: Session,
    stadium_id: int,
):
    return StadiumRepository.get_by_id(
        db,
        stadium_id,
    )


def get_stadiums_by_country(
    db: Session,
    country: str,
):
    return StadiumRepository.get_by_country(
        db,
        country,
    )