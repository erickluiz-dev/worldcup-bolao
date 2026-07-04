from sqlalchemy.orm import Session

from app.models_db.match import Match


class MatchRepository:

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[Match]:

        return (
            db.query(Match)
            .order_by(
                Match.date,
                Match.time,
            )
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        match_id: int,
    ) -> Match | None:

        return (
            db.query(Match)
            .filter(
                Match.id == match_id
            )
            .first()
        )

    @staticmethod
    def get_by_group(
        db: Session,
        group: str,
    ) -> list[Match]:

        return (
            db.query(Match)
            .filter(
                Match.group == group
            )
            .order_by(
                Match.date,
                Match.time,
            )
            .all()
        )

    @staticmethod
    def get_by_stage(
        db: Session,
        stage: str,
    ) -> list[Match]:

        return (
            db.query(Match)
            .filter(
                Match.stage == stage
            )
            .order_by(
                Match.date,
                Match.time,
            )
            .all()
        )

    @staticmethod
    def get_by_round(
        db: Session,
        round_number: int,
    ) -> list[Match]:

        return (
            db.query(Match)
            .filter(
                Match.round == round_number
            )
            .order_by(
                Match.date,
                Match.time,
            )
            .all()
        )

    @staticmethod
    def create(
        db: Session,
        match: Match,
    ):

        db.add(match)

        db.commit()

        db.refresh(match)

        return match

    @staticmethod
    def update(
        db: Session,
        match: Match,
    ):

        db.commit()

        db.refresh(match)

        return match

    @staticmethod
    def delete(
        db: Session,
        match: Match,
    ):

        db.delete(match)

        db.commit()