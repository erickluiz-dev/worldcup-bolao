from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.notification import (
    NotificationRead,
)

from app.services.notification_service import NotificationService

from app.models.match_response import MatchResponse

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"],
)

def to_match_response(match):

    if match is None:
        return None

    return MatchResponse(
        id=match.id,
        home_team=match.home_team,
        away_team=match.away_team,
        stadium=match.stadium,
        date=match.date,
        time=match.time,
        stage=match.stage,
        group=match.group,
        round=match.round,
        home_score=match.home_score,
        away_score=match.away_score,
        qualified_team_id=match.qualified_team_id,
        finished=match.finished,
    )

def to_notification_response(notification):

    return NotificationRead(
        id=notification.id,
        user_id=notification.user_id,
        title=notification.title,
        message=notification.message,
        type=notification.type,
        match=to_match_response(notification.match),
        is_read=notification.is_read,
        created_at=notification.created_at,
    )

# ==========================================================
# GET /
# ==========================================================

@router.get(
    "/",
    response_model=List[NotificationRead],
)
def get_notifications(
    db: Session = Depends(get_db),
):
    """
    Retorna todas as notificações.
    """
    notifications = NotificationService.get_notifications(db)

    return [
        to_notification_response(notification)
        for notification in notifications
    ]


# ==========================================================
# GET /{notification_id}
# ==========================================================

@router.get(
    "/{notification_id}",
    response_model=NotificationRead,
)
def get_notification(
    notification_id: int,
    db: Session = Depends(get_db),
):

    notification = NotificationService.get_notification(
        db,
        notification_id,
    )

    if notification is None:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Notificação não encontrada.",

        )

    return to_notification_response(notification)


# ==========================================================
# GET /user/{user_id}
# ==========================================================

@router.get(
    "/user/{user_id}",
    response_model=List[NotificationRead],
)
def get_notifications_by_user(
    user_id: int,
    db: Session = Depends(get_db),
):

    notifications = NotificationService.get_notifications_by_user(
        db,
        user_id,
    )

    return [
        to_notification_response(notification)
        for notification in notifications
    ]


# ==========================================================
# GET /user/{user_id}/unread
# ==========================================================

@router.get(
    "/user/{user_id}/unread",
    response_model=List[NotificationRead],
)
def get_unread_notifications(
    user_id: int,
    db: Session = Depends(get_db),
):

    notifications = NotificationService.get_unread_notifications(
        db,
        user_id,
    )

    return [
        to_notification_response(notification)
        for notification in notifications
    ]


# ==========================================================
# PATCH /{notification_id}/read
# ==========================================================

@router.patch(
    "/{notification_id}/read",
    response_model=NotificationRead,
)
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
):

    notification = NotificationService.mark_as_read(

        db,

        notification_id,

    )

    if notification is None:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Notificação não encontrada.",

        )

    return to_notification_response(notification)


# ==========================================================
# PATCH /user/{user_id}/read
# ==========================================================

@router.patch(
    "/user/{user_id}/read",
)
def mark_all_as_read(
    user_id: int,
    db: Session = Depends(get_db),
):

    NotificationService.mark_all_as_read(

        db,

        user_id,

    )

    return {

        "message": "Todas as notificações foram marcadas como lidas."

    }


# ==========================================================
# DELETE /{notification_id}
# ==========================================================

@router.delete(
    "/{notification_id}",
)
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
):

    deleted = NotificationService.delete_notification(

        db,

        notification_id,

    )

    if not deleted:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Notificação não encontrada.",

        )

    return {

        "message": "Notificação removida."

    }


# ==========================================================
# DELETE /user/{user_id}
# ==========================================================

@router.delete(
    "/user/{user_id}",
)
def delete_all_notifications(
    user_id: int,
    db: Session = Depends(get_db),
):

    NotificationService.delete_all_notifications(

        db,

        user_id,

    )

    return {

        "message": "Todas as notificações foram removidas."

    }