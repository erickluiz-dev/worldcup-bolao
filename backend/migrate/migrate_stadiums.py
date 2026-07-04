from app.models_db.stadium import Stadium

from migrate.utils import (
    get_session,
    load_json,
)


def migrate_stadiums():

    stadiums = load_json("stadiums.json")

    db = get_session()

    inserted = 0
    skipped = 0

    try:

        for data in stadiums:

            existing = (
                db.query(Stadium)
                .filter(Stadium.id == data["id"])
                .first()
            )

            if existing:

                skipped += 1

                continue

            stadium = Stadium(

                id=data["id"],

                name=data["name"],

                city=data["city"],

                country=data["country"],

            )

            db.add(stadium)

            inserted += 1

        db.commit()

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()


if __name__ == "__main__":
    migrate_stadiums()