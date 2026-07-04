from sqlalchemy.orm import Session

from app.repositories.team_repository import TeamRepository


class TeamService:

    @staticmethod
    def get_teams(
        db: Session,
    ):
        return TeamRepository.get_all(db)

    @staticmethod
    def get_team_by_id(
        db: Session,
        team_id: int,
    ):
        return TeamRepository.get_by_id(
            db,
            team_id,
        )

    @staticmethod
    def get_team_by_name(
        db: Session,
        name: str,
    ):
        return TeamRepository.get_by_name(
            db,
            name,
        )

    @staticmethod
    def get_group(
        db: Session,
        group: str,
    ):
        return TeamRepository.get_by_group(
            db,
            group,
        )