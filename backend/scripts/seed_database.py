import json
from pathlib import Path

from sqlalchemy.exc import SQLAlchemyError
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
from app.core.database import SessionLocal

from app.models_db.team import Team
from app.models_db.stadium import Stadium
from app.models_db.match import Match
from app.models_db.user import User
from app.models_db.prediction import Prediction


BASE_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = BASE_DIR / "data"


def load_json(filename: str):

    file_path = DATA_DIR / filename

    if not file_path.exists():
        raise FileNotFoundError(
            f"Arquivo não encontrado: {file_path}"
        )

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


db = SessionLocal()

try:

    print("=" * 60)
    print("INICIANDO IMPORTAÇÃO")
    print("=" * 60)

    teams_json = load_json("teams.json")
    stadiums_json = load_json("stadiums.json")
    matches_json = load_json("matches.json")
    users_json = load_json("users.json")
    predictions_json = load_json("predictions.json")

    ##########################################################
    # TEAMS
    ##########################################################

    print("\nImportando Teams...")

    teams_imported = 0

    for item in teams_json:

        exists = (
            db.query(Team)
            .filter(
                Team.code == item["code"]
            )
            .first()
        )

        if exists:
            continue

        team = Team(

            name=item["name"],

            group=item["group"],

            code=item["code"],

            flag=item["flag"]

        )

        db.add(team)

        teams_imported += 1

    db.commit()

    print(f"{teams_imported} teams importados.")

    ##########################################################
    # STADIUMS
    ##########################################################

    print("\nImportando Stadiums...")

    stadiums_imported = 0

    for item in stadiums_json:

        exists = (
            db.query(Stadium)
            .filter(
                Stadium.name == item["name"]
            )
            .first()
        )

        if exists:
            continue

        stadium = Stadium(

            name=item["name"],

            city=item["city"],

            country=item["country"]

        )

        db.add(stadium)

        stadiums_imported += 1

    db.commit()

    print(f"{stadiums_imported} stadiums importados.")

    ##########################################################
    # CRIA MAPAS PARA USO NAS PARTIDAS
    ##########################################################

    team_map = {

        team.name: team.id

        for team in db.query(Team).all()

    }

    stadium_map = {

        stadium.name: stadium.id

        for stadium in db.query(Stadium).all()

    }

    print("\nMapas criados com sucesso.")

    print(f"Teams encontrados: {len(team_map)}")

    print(f"Stadiums encontrados: {len(stadium_map)}")

    print("\nPreparando importação das partidas...")

    ##########################################################
    # MATCHES
    ##########################################################

    print("\nImportando Matches...")

    matches_imported = 0

    for item in matches_json:

        home_team_id = team_map.get(item["home_team"])
        away_team_id = team_map.get(item["away_team"])
        stadium_id = stadium_map.get(item["stadium"])

        if home_team_id is None:

            print(
                f"Time mandante não encontrado: "
                f"{item['home_team']}"
            )
            continue

        if away_team_id is None:

            print(
                f"Time visitante não encontrado: "
                f"{item['away_team']}"
            )
            continue

        if stadium_id is None:

            print(
                f"Estádio não encontrado: "
                f"{item['stadium']}"
            )
            continue

        exists = (

            db.query(Match)

            .filter(

                Match.home_team_id == home_team_id,

                Match.away_team_id == away_team_id,

                Match.date == item["date"],

                Match.time == item["time"]

            )

            .first()

        )

        if exists:
            continue

        match = Match(

            home_team_id=home_team_id,

            away_team_id=away_team_id,

            stadium_id=stadium_id,

            date=item["date"],

            time=item["time"],

            stage=item["stage"],

            group=item.get("group"),

            round=item["round"],

            home_score=item.get("home_score"),

            away_score=item.get("away_score"),

            finished=item.get("finished", False),

            created_at=item.get("created_at"),

            updated_at=item.get("updated_at")

        )

        db.add(match)

        matches_imported += 1

        if matches_imported % 25 == 0:

            print(
                f"{matches_imported} partidas importadas..."
            )

    db.commit()

    print(f"{matches_imported} partidas importadas.")

    ##########################################################
    # RECARREGA MAPA DAS PARTIDAS
    ##########################################################

    print("\nCriando mapa das partidas...")

    match_map = {}

    matches = db.query(Match).all()

    for match in matches:

        key = (

            match.home_team_id,

            match.away_team_id,

            match.date,

            match.time

        )

        match_map[key] = match.id

    print(
        f"{len(match_map)} partidas encontradas."
    )

    ##########################################################
    # USERS
    ##########################################################

    print("\nPreparando importação dos usuários...")

    ##########################################################
    # USERS
    ##########################################################

    print("\nImportando Users...")

    users_imported = 0

    user_map = {}

    for item in users_json:

        exists = (
            db.query(User)
            .filter(User.email == item["email"])
            .first()
        )

        if exists:
            user_map[item["id"]] = exists.id
            continue

        user = User(

            name=item["name"],

            email=item["email"],

            password_hash=item["password_hash"],

            avatar=item.get("avatar", 1),

            role=item.get("role", "user"),

            active=item.get("active", True),

            created_at=item.get("created_at"),

            last_login=item.get("last_login")

        )

        db.add(user)

        db.flush()

        user_map[item["id"]] = user.id

        users_imported += 1

    db.commit()

    print(f"{users_imported} usuários importados.")

    ##########################################################
    # RECARREGA USUÁRIOS
    ##########################################################

    user_map = {}

    for user in db.query(User).all():

        user_map[user.email] = user.id

    ##########################################################
    # PREDICTIONS
    ##########################################################

    print("\nImportando Predictions...")

    predictions_imported = 0

    for item in predictions_json:

        user = (
            db.query(User)
            .filter(User.id == item["user_id"])
            .first()
        )

        match = (
            db.query(Match)
            .filter(Match.id == item["match_id"])
            .first()
        )

        if user is None:

            print(
                f"Usuário {item['user_id']} não encontrado."
            )

            continue

        if match is None:

            print(
                f"Partida {item['match_id']} não encontrada."
            )

            continue

        exists = (
            db.query(Prediction)
            .filter(
                Prediction.user_id == user.id,
                Prediction.match_id == match.id
            )
            .first()
        )

        if exists:
            continue

        prediction = Prediction(

            user_id=user.id,

            match_id=match.id,

            home_score=item["home_score"],

            away_score=item["away_score"],

            points=item.get("points", 0),

            created_at=item.get("created_at"),

            updated_at=item.get("updated_at")

        )

        db.add(prediction)

        predictions_imported += 1

    db.commit()

    ##########################################################
    # RELATÓRIO FINAL
    ##########################################################

    print("\n" + "=" * 60)
    print("IMPORTAÇÃO CONCLUÍDA")
    print("=" * 60)

    print(f"Teams...............: {db.query(Team).count()}")
    print(f"Stadiums............: {db.query(Stadium).count()}")
    print(f"Matches.............: {db.query(Match).count()}")
    print(f"Users...............: {db.query(User).count()}")
    print(f"Predictions.........: {db.query(Prediction).count()}")

    print("=" * 60)

except SQLAlchemyError as e:

    db.rollback()

    print("\nERRO NO BANCO DE DADOS")
    print(e)

except Exception as e:

    db.rollback()

    print("\nERRO")
    print(e)

finally:

    db.close()

    print("\nConexão encerrada.")

