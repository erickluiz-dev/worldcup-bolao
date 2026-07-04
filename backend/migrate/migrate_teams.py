from app.models_db.team import Team

from migrate.utils import (
    get_session,
    load_json,
)


def migrate_teams():

    teams = load_json("teams.json")

    db = get_session()

    inserted = 0
    skipped = 0

    try:

        for data in teams:

            existing = (
                db.query(Team)
                .filter(Team.id == data["id"])
                .first()
            )

            if existing:

                skipped += 1

                continue

            team = Team(

                id=data["id"],

                name=data["name"],

                code=data["code"],

                group=data["group"],

                flag=data["flag"],

            )

            db.add(team)

            inserted += 1

        db.commit()

    except Exception:

        db.rollback()
        raise

    finally:

        db.close()


if __name__ == "__main__":
    migrate_teams()