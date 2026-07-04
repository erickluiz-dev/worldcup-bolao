from sqlalchemy.orm import Session

from app.models_db.match import Match
from app.repositories.match_repository import MatchRepository


class MatchService:

    # ==========================================================
    # CONSULTAS
    # ==========================================================

    @staticmethod
    def get_all_matches(
        db: Session,
    ) -> list[Match]:

        return MatchRepository.get_all(db)

    @staticmethod
    def get_match_by_id(
        db: Session,
        match_id: int,
    ) -> Match | None:

        return MatchRepository.get_by_id(
            db,
            match_id,
        )

    @staticmethod
    def get_matches_by_group(
        db: Session,
        group: str,
    ) -> list[Match]:

        return MatchRepository.get_by_group(
            db,
            group.upper(),
        )

    @staticmethod
    def get_matches_by_stage(
        db: Session,
        stage: str,
    ) -> list[Match]:

        return MatchRepository.get_by_stage(
            db,
            stage.upper(),
        )

    @staticmethod
    def get_matches_by_round(
        db: Session,
        round_number: int,
    ) -> list[Match]:

        return MatchRepository.get_by_round(
            db,
            round_number,
        )

    # ==========================================================
    # FILTROS
    # ==========================================================

    @staticmethod
    def get_finished_matches(
        db: Session,
    ) -> list[Match]:

        return [

            match

            for match in MatchRepository.get_all(db)

            if match.finished

        ]

    @staticmethod
    def get_pending_matches(
        db: Session,
    ) -> list[Match]:

        return [

            match

            for match in MatchRepository.get_all(db)

            if not match.finished

        ]

    @staticmethod
    def get_matches_by_team(
        db: Session,
        team_id: int,
    ) -> list[Match]:

        return [

            match

            for match in MatchRepository.get_all(db)

            if (

                match.home_team_id == team_id

                or

                match.away_team_id == team_id

            )

        ]

    @staticmethod
    def get_matches_by_stadium(
        db: Session,
        stadium_id: int,
    ) -> list[Match]:

        return [

            match

            for match in MatchRepository.get_all(db)

            if match.stadium_id == stadium_id

        ]

    @staticmethod
    def get_matches_by_date(
        db: Session,
        date: str,
    ) -> list[Match]:

        return [

            match

            for match in MatchRepository.get_all(db)

            if match.date == date

        ]

    # ==========================================================
    # ESTATÍSTICAS
    # ==========================================================

    @staticmethod
    def count_matches(
        db: Session,
    ) -> int:

        return len(
            MatchRepository.get_all(db)
        )

    @staticmethod
    def count_finished_matches(
        db: Session,
    ) -> int:

        return len(

            MatchService.get_finished_matches(db)

        )

    @staticmethod
    def count_pending_matches(
        db: Session,
    ) -> int:

        return len(

            MatchService.get_pending_matches(db)

        )

    @staticmethod
    def match_exists(
        db: Session,
        match_id: int,
    ) -> bool:

        return (

            MatchRepository.get_by_id(

                db,

                match_id,

            )

            is not None

        )
        # ==========================================================
    # CADASTRO
    # ==========================================================

    @staticmethod
    def create_match(
        db: Session,
        match: Match,
    ) -> Match:

        if match.home_team_id == match.away_team_id:

            raise ValueError(
                "Uma seleção não pode jogar contra ela mesma."
            )

        return MatchRepository.create(
            db,
            match,
        )

    # ==========================================================
    # ATUALIZAÇÃO
    # ==========================================================

    @staticmethod
    def update_match(
        db: Session,
        match_id: int,
        updated_match: Match,
    ) -> Match:

        match = MatchRepository.get_by_id(
            db,
            match_id,
        )

        if match is None:

            raise ValueError(
                "Partida não encontrada."
            )

        if (
            updated_match.home_team_id
            ==
            updated_match.away_team_id
        ):

            raise ValueError(
                "Uma seleção não pode jogar contra ela mesma."
            )

        match.home_team_id = updated_match.home_team_id

        match.away_team_id = updated_match.away_team_id

        match.stadium_id = updated_match.stadium_id

        match.date = updated_match.date

        match.time = updated_match.time

        match.stage = updated_match.stage

        match.group = updated_match.group

        match.round = updated_match.round

        match.home_score = updated_match.home_score

        match.away_score = updated_match.away_score

        match.finished = updated_match.finished

        return MatchRepository.update(
            db,
            match,
        )

    # ==========================================================
    # EXCLUSÃO
    # ==========================================================

    @staticmethod
    def delete_match(
        db: Session,
        match_id: int,
    ) -> bool:

        match = MatchRepository.get_by_id(
            db,
            match_id,
        )

        if match is None:

            raise ValueError(
                "Partida não encontrada."
            )

        MatchRepository.delete(
            db,
            match,
        )

        return True

    # ==========================================================
    # RESULTADO OFICIAL
    # ==========================================================

    @staticmethod
    def update_match_result(
        db: Session,
        match_id: int,
        home_score: int,
        away_score: int,
    ) -> Match:

        match = MatchRepository.get_by_id(
            db,
            match_id,
        )

        if match is None:

            raise ValueError(
                "Partida não encontrada."
            )

        if home_score < 0 or away_score < 0:

            raise ValueError(
                "O placar não pode ser negativo."
            )

        match.home_score = home_score

        match.away_score = away_score

        match.finished = True

        updated = MatchRepository.update(
            db,
            match,
        )

        # Recalcula a pontuação dos palpites

        from app.services.score_service import ScoreService

        ScoreService.calculate_match(
            db,
            match_id,
        )

        return updated

    # ==========================================================
    # FINALIZAÇÃO
    # ==========================================================

    @staticmethod
    def finish_match(
        db: Session,
        match_id: int,
    ) -> Match:

        match = MatchRepository.get_by_id(
            db,
            match_id,
        )

        if match is None:

            raise ValueError(
                "Partida não encontrada."
            )

        match.finished = True

        return MatchRepository.update(
            db,
            match,
        )

    # ==========================================================
    # ESTATÍSTICAS GERAIS
    # ==========================================================

    @staticmethod
    def get_match_statistics(
        db: Session,
    ) -> dict:

        total = MatchService.count_matches(db)

        finished = (
            MatchService.count_finished_matches(db)
        )

        pending = (
            MatchService.count_pending_matches(db)
        )

        return {

            "total_matches": total,

            "finished_matches": finished,

            "pending_matches": pending,

            "completion_rate": (

                round(

                    (finished / total) * 100,

                    2,

                )

                if total > 0

                else 0

            ),

        }