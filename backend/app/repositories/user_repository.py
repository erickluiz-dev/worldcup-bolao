from sqlalchemy.orm import Session

from app.models_db.user import User


class UserRepository:

    # ==========================================================
    # CONSULTAS
    # ==========================================================

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[User]:

        return (
            db.query(User)
            .order_by(User.id)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: int,
    ) -> User | None:

        return (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

    @staticmethod
    def get_by_email(
        db: Session,
        email: str,
    ) -> User | None:

        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    @staticmethod
    def get_by_name(
        db: Session,
        name: str,
    ) -> User | None:

        return (
            db.query(User)
            .filter(User.name == name)
            .first()
        )

    # ==========================================================
    # CADASTRO
    # ==========================================================

    @staticmethod
    def create(
        db: Session,
        user: User,
    ) -> User:

        db.add(user)

        db.commit()

        db.refresh(user)

        return user

    # ==========================================================
    # ATUALIZAÇÃO
    # ==========================================================

    @staticmethod
    def update(
        db: Session,
        user: User,
    ) -> User:

        db.commit()

        db.refresh(user)

        return user

    # ==========================================================
    # EXCLUSÃO
    # ==========================================================

    @staticmethod
    def delete(
        db: Session,
        user: User,
    ) -> None:

        db.delete(user)

        db.commit()