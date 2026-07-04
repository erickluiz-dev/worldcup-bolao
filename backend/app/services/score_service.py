from sqlalchemy.orm import Session

from app.services.match_service import MatchService
from app.services.prediction_service import PredictionService


class ScoreService:
    """
    Serviço responsável por calcular a pontuação
    dos palpites após a publicação do resultado oficial.
    """

    # ==========================================================
    # Recalcular uma partida
    # ==========================================================

    @staticmethod
    def calculate_match(
        db: Session,
        match_id: int,
    ) -> None:

        match = MatchService.get_match_by_id(
            db,
            match_id,
        )

        if match is None:
            return

        predictions = PredictionService.get_predictions_by_match(
            db,
            match_id,
        )

        for prediction in predictions:

            prediction.points = ScoreService.calculate_points(

                prediction.home_score,

                prediction.away_score,

                match.home_score,

                match.away_score,

            )

        PredictionService.save_all_predictions(
            db,
            predictions,
        )

    # ==========================================================
    # Recalcular tudo
    # ==========================================================

    @staticmethod
    def calculate_all(
        db: Session,
    ) -> None:

        predictions = PredictionService.get_predictions(
            db,
        )

        for prediction in predictions:

            match = MatchService.get_match_by_id(

                db,

                prediction.match_id,

            )

            if match is None:
                continue

            if not match.finished:
                continue

            prediction.points = ScoreService.calculate_points(

                prediction.home_score,

                prediction.away_score,

                match.home_score,

                match.away_score,

            )

        PredictionService.save_all_predictions(

            db,

            predictions,

        )

    # ==========================================================
    # Regra de Pontuação
    # ==========================================================

    @staticmethod
    def calculate_points(

        predicted_home: int,

        predicted_away: int,

        official_home: int,

        official_away: int,

    ) -> int:

        # Placar exato

        if (

            predicted_home == official_home

            and

            predicted_away == official_away

        ):

            return 3

        predicted_result = (

            predicted_home > predicted_away

        ) - (

            predicted_home < predicted_away

        )

        official_result = (

            official_home > official_away

        ) - (

            official_home < official_away

        )

        if predicted_result == official_result:

            return 1

        return 0