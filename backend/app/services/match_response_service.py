from app.models.match_response import MatchResponse
from app.models.team import Team
from app.models.stadium import Stadium

from app.services.team_service import TeamService
from app.services.stadium_service import get_all_stadiums

from app.services.match_service import get_all_matches


class MatchResponseService:

    @staticmethod
    def get_matches() -> list[MatchResponse]:

        teams = TeamService.get_teams()
        stadiums = get_all_stadiums()

        response = []

        for match in get_all_matches():

            home_team = next(
                (
                    team
                    for team in teams
                    if team["name"] == match.home_team
                ),
                None,
            )

            away_team = next(
                (
                    team
                    for team in teams
                    if team["name"] == match.away_team
                ),
                None,
            )

            stadium = next(
                (
                    item
                    for item in stadiums
                    if item["name"] == match.stadium
                ),
                None,
            )

            response.append(

                MatchResponse(

                    id=match.id,

                    group=match.group,

                    round=match.round,

                    date=match.date,

                    time=match.time,

                    home_team=(
                        Team(**home_team)
                        if home_team
                        else None
                    ),

                    away_team=(
                        Team(**away_team)
                        if away_team
                        else None
                    ),

                    stadium=(
                        Stadium(**stadium)
                        if stadium
                        else None
                    ),

                    home_score=match.home_score,

                    away_score=match.away_score,

                    finished=match.finished,

                )

            )

        return response