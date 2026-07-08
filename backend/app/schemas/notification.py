from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ==========================================================
# BASE
# ==========================================================

class NotificationBase(BaseModel):

    title: str

    message: str

    type: str

    match_id: int | None = None


# ==========================================================
# CREATE
# ==========================================================

class NotificationCreate(NotificationBase):

    user_id: int    


# ==========================================================
# UPDATE
# ==========================================================

class NotificationUpdate(BaseModel):

    is_read: bool


# ==========================================================
# READ
# ==========================================================

class NotificationRead(NotificationBase):

    id: int

    user_id: int

    match_id: int | None = None

    is_read: bool

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )