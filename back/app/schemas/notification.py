from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum


class NotificationType(str, Enum):
    MESSAGE = "message"
    SESSION = "session"
    SYSTEM = "system"
    EMOTION = "emotion"
    REMINDER = "reminder"


class NotificationBase(BaseModel):
    title: str
    message: str
    notification_type: NotificationType = NotificationType.SYSTEM
    avatar_url: Optional[str] = None
    action_url: Optional[str] = None


class NotificationCreate(NotificationBase):
    user_id: int


class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None


class NotificationOut(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationListOut(BaseModel):
    notifications: list[NotificationOut]
    total: int
    unread_count: int
