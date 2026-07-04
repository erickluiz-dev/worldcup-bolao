import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]

env_file = BASE_DIR / ".env"

load_dotenv(env_file)


class Settings:

    DATABASE_URL = os.getenv("DATABASE_URL")

    DATABASE_HOST = os.getenv(
        "DATABASE_HOST",
        "localhost",
    )

    DATABASE_PORT = int(
        os.getenv(
            "DATABASE_PORT",
            "5432",
        )
    )

    DATABASE_NAME = os.getenv(
        "DATABASE_NAME",
        "copa_bolao",
    )

    DATABASE_USER = os.getenv(
        "DATABASE_USER",
        "postgres",
    )

    DATABASE_PASSWORD = os.getenv(
        "DATABASE_PASSWORD",
        "",
    )

    JWT_SECRET = os.getenv(
        "JWT_SECRET",
        "secret",
    )

    JWT_EXPIRE_MINUTES = int(
        os.getenv(
            "JWT_EXPIRE_MINUTES",
            "60",
        )
    )

    DATABASE_URL = os.getenv("DATABASE_URL", "")

settings = Settings()