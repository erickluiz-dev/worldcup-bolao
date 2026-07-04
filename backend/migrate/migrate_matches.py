from app.models_db.match import Match
from app.models_db.team import Team
from app.models_db.stadium import Stadium

from migrate.utils import (
    get_session,
    load_json,
)


def migrate_matches():

    matches = load_json("matches.json")

    db = get_session()

    inserted = 0
    skipped = 0

    try:

        for data in matches:

            existing = (
                db.query(Match)
                .filter(Match.id == data["id"])
                .first()
            )

            if existing:

                skipped += 1

                continue

            home_team = (
                db.query(Team)
                .filter(
                    Team.name == data["home_team"]
                )
                .first()
            )

            away_team = (
                db.query(Team)
                .filter(
                    Team.name == data["away_team"]
                )
                .first()
            )

            stadium = (
                db.query(Stadium)
                .filter(
                    Stadium.name == data["stadium"]
                )
                .first()
            )

            if home_team is None:

                raise ValueError(
                    f"Time mandante inexistente: "
                    f"{data['home_team_id']}"
                )

            if away_team is None:

                raise ValueError(
                    f"Time visitante inexistente: "
                    f"{data['away_team_id']}"
                )

            if stadium is None:

                raise ValueError(
                    f"Estádio inexistente: "
                    f"{data['stadium_id']}"
                )

            match = Match(

                id=data["id"],

                home_team_id=home_team.id,

                away_team_id=away_team.id,

                stadium_id=stadium.id,

                date=data["date"],

                time=data["time"],

                stage=data["stage"],

                group=data["group"],

                round=data["round"],

                home_score=data.get("home_score"),

                away_score=data.get("away_score"),

                finished=data["finished"],

            )

            db.add(match)

            inserted += 1

        db.commit()

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()


if __name__ == "__main__":

    migrate_matches()