from sqlalchemy.orm import Session

from app.models_db.prediction import Prediction


class PredictionRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(Prediction).all()

    @staticmethod
    def get_by_id(
        db: Session,
        prediction_id: int,
    ):
        return (
            db.query(Prediction)
            .filter(Prediction.id == prediction_id)
            .first()
        )

    @staticmethod
    def get_by_user(
        db: Session,
        user_id: int,
    ):
        return (
            db.query(Prediction)
            .filter(Prediction.user_id == user_id)
            .all()
        )

    @staticmethod
    def get_by_match(
        db: Session,
        match_id: int,
    ):
        return (
            db.query(Prediction)
            .filter(Prediction.match_id == match_id)
            .all()
        )

    @staticmethod
    def get_user_prediction(
        db: Session,
        user_id: int,
        match_id: int,
    ):
        return (
            db.query(Prediction)
            .filter(
                Prediction.user_id == user_id,
                Prediction.match_id == match_id,
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        prediction: Prediction,
    ):
        db.add(prediction)
        db.commit()
        db.refresh(prediction)
        return prediction

    @staticmethod
    def update(
        db: Session,
        prediction: Prediction,
    ):
        db.commit()
        db.refresh(prediction)
        return prediction

    @staticmethod
    def delete(
        db: Session,
        prediction: Prediction,
    ):
        db.delete(prediction)
        db.commit()