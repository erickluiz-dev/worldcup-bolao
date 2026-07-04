from datetime import datetime

from app.models_db.user import User

from migrate.utils import (
    get_session,
    load_json,
)

import app.models_db

def migrate_users():

    users = load_json("users.json")

    db = get_session()

    inserted = 0
    skipped = 0

    try:

        for data in users:

            existing = (
                db.query(User)
                .filter(User.id == data["id"])
                .first()
            )

            if existing:

                skipped += 1

                continue

            created_at = None
            last_login = None

            if data.get("created_at"):

                created_at = datetime.fromisoformat(
                    data["created_at"].replace("Z", "+00:00")
                )

            if data.get("last_login"):

                last_login = datetime.fromisoformat(
                    data["created_at"].replace("Z", "+00:00")
                )

            user = User(

                id=data["id"],

                name=data["name"],

                email=data["email"],

                password_hash=data["password_hash"],

                avatar=data.get("avatar", 1),

                role=data.get("role", "user"),

                active=data.get("active", True),

                created_at=created_at,

                last_login=last_login,

            )

            db.add(user)

            inserted += 1

        db.commit()

    except Exception as error:

        db.rollback()

        raise error

    finally:

        db.close()


if __name__ == "__main__":

    migrate_users()