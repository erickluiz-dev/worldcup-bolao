import json
import os

from app.models.result import Result
from datetime import datetime, timezone

DATA_FILE = "data/results.json"


class ResultService:

    @staticmethod
    def _load_results() -> list[Result]:
        if not os.path.exists(DATA_FILE):
            return []

        with open(DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)

        return [Result(**item) for item in data]

    @staticmethod
    def _save_results(results: list[Result]) -> None:
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

        with open(DATA_FILE, "w", encoding="utf-8") as file:
            json.dump(
                [result.model_dump() for result in results],
                file,
                indent=4,
                ensure_ascii=False
            )

    @classmethod
    def get_results(cls) -> list[Result]:
        return cls._load_results()

    @classmethod
    def get_result_by_id(cls, result_id: int) -> Result | None:
        for result in cls._load_results():
            if result.id == result_id:
                return result
        return None

    @classmethod
    def get_result_by_match(cls, match_id: int) -> Result | None:
        for result in cls._load_results():
            if result.match_id == match_id:
                return result
        return None

    @classmethod
    def save_result(cls, result: Result) -> Result:
        results = cls._load_results()

        existing = next(
            (
                r
                for r in results
                if r.match_id == result.match_id
            ),
            None,
        )

        if existing:

            existing.home_score = result.home_score
            existing.away_score = result.away_score
            existing.finished = result.finished
            existing.home_team = result.home_team
            existing.away_team = result.away_team

            cls._save_results(results)

            cls._recalculate_scores(result.match_id)

            return existing

        next_id = (
            max((r.id for r in results), default=0) + 1
        )

        result.id = next_id

        results.append(result)

        cls._save_results(results)

        cls._recalculate_scores(result.match_id)

        return result

    @classmethod
    def delete_result(cls, result_id: int) -> bool:
        results = cls._load_results()

        new_results = [
            result
            for result in results
            if result.id != result_id
        ]

        if len(results) == len(new_results):
            return False

        cls._save_results(new_results)

        return True

    @staticmethod
    def _recalculate_scores(match_id: int) -> None:
        """
        Dispara o recálculo da pontuação dos palpites da partida.

        A implementação será adicionada em
        utils/score_calculator.py na próxima etapa.
        """

        try:
            from app.utils.score_calculator import ScoreCalculator

            ScoreCalculator.calculate_match(match_id)

        except Exception:
            # Enquanto o ScoreCalculator ainda não existir,
            # apenas ignora a chamada.
            pass