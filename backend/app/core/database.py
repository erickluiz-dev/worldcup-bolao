from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

if settings.DATABASE_URL:
    DATABASE_URL = settings.DATABASE_URL.replace(
        "postgresql://",
        "postgresql+psycopg2://",
        1,
    )
else:
    DATABASE_URL = (
        f"postgresql+psycopg2://"
        f"{settings.DATABASE_USER}:"
        f"{settings.DATABASE_PASSWORD}@"
        f"{settings.DATABASE_HOST}:"
        f"{settings.DATABASE_PORT}/"
        f"{settings.DATABASE_NAME}"
    )

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
