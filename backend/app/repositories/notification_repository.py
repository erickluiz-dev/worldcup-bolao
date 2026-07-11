from sqlalchemy.orm import Session

from app.models_db.notification import Notification

from sqlalchemy.orm import Session, joinedload

from app.models_db.match import Match

class NotificationRepository:

    # ==========================================================
    # CONSULTAS
    # ==========================================================

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[Notification]:

        return (
            db.query(Notification)
            .options(
                joinedload(Notification.match)
                    .joinedload(Match.home_team),

                joinedload(Notification.match)
                    .joinedload(Match.away_team),
            )
            .order_by(Notification.created_at.desc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        notification_id: int,
    ) -> Notification | None:

        return (
            db.query(Notification)
            .options(
                joinedload(Notification.match)
                    .joinedload(Match.home_team),

                joinedload(Notification.match)
                    .joinedload(Match.away_team),
            )
            .filter(Notification.id == notification_id)
            .first()
        )

    @staticmethod
    def get_by_user(
        db: Session,
        user_id: int,
    ) -> list[Notification]:

        return (
            db.query(Notification)
            .options(
                joinedload(Notification.match)
                    .joinedload(Match.home_team),

                joinedload(Notification.match)
                    .joinedload(Match.away_team),
            )
            .filter(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .all()
        )

    @staticmethod
    def get_unread_by_user(
        db: Session,
        user_id: int,
    ) -> list[Notification]:

        return (
            db.query(Notification)
            .options(
                joinedload(Notification.match)
                    .joinedload(Match.home_team),

                joinedload(Notification.match)
                    .joinedload(Match.away_team),
            )
            .filter(
                Notification.user_id == user_id,
                Notification.is_read == False,
            )
            .order_by(Notification.created_at.desc())
            .all()
        )
    # ==========================================================
    # CADASTRO
    # ==========================================================

    @staticmethod
    def create(
        db: Session,
        notification: Notification,
    ) -> Notification:

        db.add(notification)

        db.commit()

        db.refresh(notification)

        return notification

    # ==========================================================
    # ATUALIZAÇÃO
    # ==========================================================

    @staticmethod
    def update(
        db: Session,
        notification: Notification,
    ) -> Notification:

        db.commit()

        db.refresh(notification)

        return notification

    @staticmethod
    def mark_as_read(
        db: Session,
        notification: Notification,
    ) -> Notification:

        notification.is_read = True

        db.commit()

        db.refresh(notification)

        return notification

    @staticmethod
    def mark_all_as_read(
        db: Session,
        user_id: int,
    ):

        notifications = (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.is_read == False,
            )
            .all()
        )

        for notification in notifications:

            notification.is_read = True

        db.commit()

    # ==========================================================
    # EXCLUSÃO
    # ==========================================================

    @staticmethod
    def delete(
        db: Session,
        notification: Notification,
    ):

        db.delete(notification)

        db.commit()

    @staticmethod
    def delete_all_by_user(
        db: Session,
        user_id: int,
    ):

        (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id
            )
            .delete()
        )

        db.commit()