from sqlalchemy.orm import Session

from app.services.prediction_service import PredictionService
from app.services.user_service import UserService


class RankingService:
    """
    Serviço responsável por gerar o ranking geral
    dos participantes do bolão.
    """

    # ==========================================================
    # Ranking Geral
    # ==========================================================

    @staticmethod
    def get_ranking(
        db: Session,
    ):

        predictions = PredictionService.get_predictions(
            db,
        )

        users = {}

        for prediction in predictions:

            user_id = prediction.user_id

            if user_id not in users:

                user = UserService.get_user_by_id(
                    db,
                    user_id,
                )

                users[user_id] = {

                    "user_id": user_id,

                    "name": (
                        user.name
                        if user
                        else f"Usuário {user_id}"
                    ),

                    "avatar": (
                        user.avatar
                        if user
                        else 1
                    ),

                    "points": 0,

                    "predictions": 0,

                    "exact_hits": 0,

                    "winner_hits": 0,

                }

            users[user_id]["points"] += prediction.points

            users[user_id]["predictions"] += 1

            if prediction.points == 3:

                users[user_id]["exact_hits"] += 1

            elif prediction.points == 1:

                users[user_id]["winner_hits"] += 1

        ranking = list(users.values())

        ranking.sort(

            key=lambda user: (

                -user["points"],

                -user["exact_hits"],

                -user["winner_hits"],

                user["user_id"],

            )

        )

        for position, user in enumerate(

            ranking,

            start=1,

        ):

            user["position"] = position

        return ranking

    # ==========================================================
    # Posição do Usuário
    # ==========================================================

    @staticmethod
    def get_user_position(
        db: Session,
        user_id: int,
    ):

        ranking = RankingService.get_ranking(
            db,
        )

        for user in ranking:

            if user["user_id"] == user_id:

                return user

        return None