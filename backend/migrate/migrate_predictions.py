from app.models_db.prediction import Prediction
from app.models_db.user import User
from app.models_db.match import Match

from migrate.utils import (
    get_session,
    load_json,
)


def migrate_predictions():

    predictions = load_json("predictions.json")

    db = get_session()

    inserted = 0
    skipped = 0

    try:

        for data in predictions:

            existing = (
                db.query(Prediction)
                .filter(
                    Prediction.id == data["id"]
                )
                .first()
            )

            if existing:

                skipped += 1

                continue

            user = (
                db.query(User)
                .filter(
                    User.id == data["user_id"]
                )
                .first()
            )

            match = (
                db.query(Match)
                .filter(
                    Match.id == data["match_id"]
                )
                .first()
            )

            if user is None:

                raise ValueError(
                    f"Usuário inexistente: "
                    f"{data['user_id']}"
                )

            if match is None:

                raise ValueError(
                    f"Partida inexistente: "
                    f"{data['match_id']}"
                )

            prediction = Prediction(

                id=data["id"],

                user_id=data["user_id"],

                match_id=data["match_id"],

                home_score=data["home_score"],

                away_score=data["away_score"],

                points=data.get(
                    "points",
                    0,
                ),

            )

            db.add(prediction)

            inserted += 1
            
        db.commit()

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()


if __name__ == "__main__":

    migrate_predictions()