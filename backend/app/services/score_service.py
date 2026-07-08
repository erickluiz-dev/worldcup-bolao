from sqlalchemy.orm import Session

from app.services.match_service import MatchService
from app.services.prediction_service import PredictionService
from app.services.notification_service import NotificationService
from app.services.user_service import UserService

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

                match.qualified_team_id,

                match.home_team_id,

                match.away_team_id,

            )

        PredictionService.save_all_predictions(
            db,
            predictions,
        )

    # ==========================================================
    # Notificar usuários
    # ==========================================================
    
        for prediction in predictions:

            user = UserService.get_user_by_id(
                db,
                prediction.user_id,
            )
        
            if user is None:
                continue
        
            NotificationService.notify_result(
        
                db=db,
        
                user_id=user.id,
        
                home_team=match.home_team.name,
        
                away_team=match.away_team.name,
        
                points=prediction.points,

                match_id=match.id
        
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

                match.qualified_team_id,

                match.home_team_id,

                match.away_team_id,

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

        qualified_team_id: int | None,

        home_team_id: int,

        away_team_id: int,

    ) -> int:

        # ======================================================
        # 3 pontos - placar exato
        # ======================================================

        if (

            predicted_home == official_home

            and

            predicted_away == official_away

        ):

            return 3

        # ======================================================
        # Partidas empatadas
        # ======================================================

        if official_home == official_away:

            # Acertou que seria empate
            if predicted_home == predicted_away:

                return 1

            # Apostou na vitória do time que se classificou
            if qualified_team_id is not None:

                if (

                    predicted_home > predicted_away

                    and

                    qualified_team_id == home_team_id

                ):

                    return 1

                if (

                    predicted_away > predicted_home

                    and

                    qualified_team_id == away_team_id

                ):

                    return 1

            return 0

        # ======================================================
        # Regra normal
        # ======================================================

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