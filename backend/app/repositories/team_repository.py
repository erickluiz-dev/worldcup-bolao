from sqlalchemy.orm import Session

from app.models_db.team import Team


class TeamRepository:

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[Team]:

        return (
            db.query(Team)
            .order_by(Team.group, Team.name)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        team_id: int,
    ) -> Team | None:

        return (
            db.query(Team)
            .filter(
                Team.id == team_id
            )
            .first()
        )

    @staticmethod
    def get_by_name(
        db: Session,
        name: str,
    ) -> Team | None:

        return (
            db.query(Team)
            .filter(
                Team.name == name
            )
            .first()
        )

    @staticmethod
    def get_by_group(
        db: Session,
        group: str,
    ) -> list[Team]:

        return (
            db.query(Team)
            .filter(
                Team.group == group
            )
            .order_by(Team.name)
            .all()
        )

    @staticmethod
    def create(
        db: Session,
        team: Team,
    ) -> Team:

        db.add(team)

        db.commit()

        db.refresh(team)

        return team

    @staticmethod
    def update(
        db: Session,
        team: Team,
    ) -> Team:

        db.commit()

        db.refresh(team)

        return team

    @staticmethod
    def delete(
        db: Session,
        team: Team,
    ) -> None:

        db.delete(team)

        db.commit()