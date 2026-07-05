from sqlalchemy.orm import Session

from app.models_db.prediction import Prediction
from app.repositories.prediction_repository import PredictionRepository


class PredictionService:

    # ==========================================================
    # CONSULTAS
    # ==========================================================

    @staticmethod
    def get_predictions(
        db: Session,
    ) -> list[Prediction]:

        return PredictionRepository.get_all(db)

    @staticmethod
    def get_prediction_by_id(
        db: Session,
        prediction_id: int,
    ) -> Prediction | None:

        return PredictionRepository.get_by_id(
            db,
            prediction_id,
        )

    @staticmethod
    def get_predictions_by_user(
        db: Session,
        user_id: int,
    ) -> list[Prediction]:

        return PredictionRepository.get_by_user(
            db,
            user_id,
        )

    @staticmethod
    def get_predictions_by_match(
        db: Session,
        match_id: int,
    ) -> list[Prediction]:

        return PredictionRepository.get_by_match(
            db,
            match_id,
        )

    # ==========================================================
    # ESTATÍSTICAS
    # ==========================================================

    @staticmethod
    def count_predictions(
        db: Session,
    ) -> int:

        return len(
            PredictionRepository.get_all(db)
        )

    @staticmethod
    def prediction_exists(
        db: Session,
        prediction_id: int,
    ) -> bool:

        return (
            PredictionRepository.get_by_id(
                db,
                prediction_id,
            )
            is not None
        )

    # ==========================================================
    # CADASTRO
    # ==========================================================

    @staticmethod
    def save_prediction(
        db: Session,
        prediction: Prediction,
    ) -> Prediction:

        existing = PredictionRepository.get_user_prediction(
            db,
            prediction.user_id,
            prediction.match_id,
        )

        if existing:

            existing.home_score = prediction.home_score
            existing.away_score = prediction.away_score
                # Os pontos serão recalculados quando o resultado oficial
                # da partida for processado.
            return PredictionRepository.update(
                db,
                existing,
            )

        return PredictionRepository.create(
            db,
            prediction,
        )

    # ==========================================================
    # EXCLUSÃO
    # ==========================================================

    @staticmethod
    def delete_prediction(
        db: Session,
        prediction_id: int,
    ) -> bool:

        prediction = PredictionRepository.get_by_id(
            db,
            prediction_id,
        )

        if prediction is None:
            return False

        PredictionRepository.delete(
            db,
            prediction,
        )

        return True

    @staticmethod
    def delete_predictions_by_user(
        db: Session,
        user_id: int,
    ):

        predictions = PredictionRepository.get_by_user(
            db,
            user_id,
        )

        for prediction in predictions:

            PredictionRepository.delete(
                db,
                prediction,
            )

    # ==========================================================
    # PERSISTÊNCIA
    # ==========================================================

    @staticmethod
    def save_all_predictions(
        db: Session,
        predictions: list[Prediction],
    ):

        for prediction in predictions:

            existing = PredictionRepository.get_by_id(
                db,
                prediction.id,
            )

            if existing:

                existing.home_score = prediction.home_score
                existing.away_score = prediction.away_score
                  # Os pontos serão recalculados quando o resultado oficial
                  # da partida for processado.

                PredictionRepository.update(
                    db,
                    existing,
                )