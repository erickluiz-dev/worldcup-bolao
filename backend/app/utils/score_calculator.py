from app.services.prediction_service import PredictionService


class ScoreCalculator:
    """
    Responsável por calcular a pontuação dos palpites.
    """

    EXACT_SCORE_POINTS = 3
    WINNER_POINTS = 1
    WRONG_POINTS = 0

    @classmethod
    def calculate_match(cls, match_id: int):
        """
        Recalcula todos os palpites referentes
        a uma determinada partida.
        """

        from app.services.result_service import ResultService

        result = ResultService.get_result_by_match(match_id)

        if result is None:
            return

        predictions = PredictionService.get_predictions_by_match(match_id)

        updated = False

        for prediction in predictions:

            prediction.points = cls.calculate_points(
                prediction.home_score,
                prediction.away_score,
                result.home_score,
                result.away_score
            )

            updated = True

        if updated:
            PredictionService.save_all_predictions(predictions)

    @classmethod
    def calculate_points(
        cls,
        predicted_home: int,
        predicted_away: int,
        official_home: int,
        official_away: int
    ) -> int:
        """
        Calcula a pontuação de um único palpite.
        """

        # Acertou exatamente o placar
        if (
            predicted_home == official_home
            and predicted_away == official_away
        ):
            return cls.EXACT_SCORE_POINTS

        predicted_result = cls._winner(
            predicted_home,
            predicted_away
        )

        official_result = cls._winner(
            official_home,
            official_away
        )

        # Acertou vencedor (ou empate)
        if predicted_result == official_result:
            return cls.WINNER_POINTS

        return cls.WRONG_POINTS

    @staticmethod
    def _winner(home: int, away: int) -> str:

        if home > away:
            return "HOME"

        if away > home:
            return "AWAY"

        return "DRAW"