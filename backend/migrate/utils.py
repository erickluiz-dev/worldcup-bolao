import json
from pathlib import Path

from app.core.database import SessionLocal


BASE_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = BASE_DIR / "data"


def load_json(filename: str):

    path = DATA_DIR / filename

    if not path.exists():
        raise FileNotFoundError(path)

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def get_session():
    return SessionLocal()