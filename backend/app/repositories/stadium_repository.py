from sqlalchemy.orm import Session

from app.models_db.stadium import Stadium


class StadiumRepository:

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[Stadium]:

        return (
            db.query(Stadium)
            .order_by(Stadium.country, Stadium.city)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        stadium_id: int,
    ) -> Stadium | None:

        return (
            db.query(Stadium)
            .filter(
                Stadium.id == stadium_id
            )
            .first()
        )

    @staticmethod
    def get_by_country(
        db: Session,
        country: str,
    ) -> list[Stadium]:

        return (
            db.query(Stadium)
            .filter(
                Stadium.country == country
            )
            .order_by(Stadium.city)
            .all()
        )