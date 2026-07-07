from sqlalchemy.orm import Session

from app.models_db.notification import Notification
from app.repositories.notification_repository import NotificationRepository


class NotificationService:

    # ==========================================================
    # CONSULTAS
    # ==========================================================

    @staticmethod
    def get_notifications(
        db: Session,
    ) -> list[Notification]:

        return NotificationRepository.get_all(db)

    @staticmethod
    def get_notification(
        db: Session,
        notification_id: int,
    ) -> Notification | None:

        return NotificationRepository.get_by_id(
            db,
            notification_id,
        )

    @staticmethod
    def get_notifications_by_user(
        db: Session,
        user_id: int,
    ) -> list[Notification]:

        return NotificationRepository.get_by_user(
            db,
            user_id,
        )

    @staticmethod
    def get_unread_notifications(
        db: Session,
        user_id: int,
    ) -> list[Notification]:

        return NotificationRepository.get_unread_by_user(
            db,
            user_id,
        )

    # ==========================================================
    # CADASTRO
    # ==========================================================

    @staticmethod
    def create_notification(
        db: Session,
        user_id: int,
        title: str,
        message: str,
        notification_type: str,
    ) -> Notification:

        notification = Notification(

            user_id=user_id,

            title=title,

            message=message,

            type=notification_type,

            is_read=False,

        )

        return NotificationRepository.create(
            db,
            notification,
        )

    # ==========================================================
    # NOVA PARTIDA
    # ==========================================================

    @staticmethod
    def notify_new_match(
        db: Session,
        user_id: int,
        home_team: str,
        away_team: str,
    ) -> Notification:

        return NotificationService.create_notification(

            db=db,

            user_id=user_id,

            #🏟️ Nova partida disponível

            title="",

            message=f"{home_team} x {away_team}. ",                

            notification_type="info",

        )

    # ==========================================================
    # RESULTADO PUBLICADO
    # ==========================================================

    @staticmethod
    def notify_result(
        db: Session,
        user_id: int,
        home_team: str,
        away_team: str,
        points: int,
    ) -> Notification:

        if points == 3:

            #🏆 Aqui temos um Alpha!

            title = ""

            message =f"{home_team} x {away_team} "

            notification_type = "success"

        elif points == 1:

            #⚽ Parabéns

            title = ""

            message = f"{home_team} x {away_team} "

            notification_type = "warning"

        else:

            #❌ Brutal! Acabou pro Beta

            title = ""

            message = f"{home_team} x {away_team}."
            
            notification_type = "error"

        return NotificationService.create_notification(

            db=db,

            user_id=user_id,

            title=title,

            message=message,

            notification_type=notification_type,

        )

    # ==========================================================
    # ATUALIZAÇÃO
    # ==========================================================

    @staticmethod
    def mark_as_read(
        db: Session,
        notification_id: int,
    ) -> Notification | None:

        notification = NotificationRepository.get_by_id(

            db,

            notification_id,

        )

        if notification is None:

            return None

        return NotificationRepository.mark_as_read(

            db,

            notification,

        )

    @staticmethod
    def mark_all_as_read(
        db: Session,
        user_id: int,
    ):

        NotificationRepository.mark_all_as_read(

            db,

            user_id,

        )

    # ==========================================================
    # EXCLUSÃO
    # ==========================================================

    @staticmethod
    def delete_notification(
        db: Session,
        notification_id: int,
    ) -> bool:

        notification = NotificationRepository.get_by_id(

            db,

            notification_id,

        )

        if notification is None:

            return False

        NotificationRepository.delete(

            db,

            notification,

        )

        return True

    @staticmethod
    def delete_all_notifications(
        db: Session,
        user_id: int,
    ):

        NotificationRepository.delete_all_by_user(

            db,

            user_id,

        )
