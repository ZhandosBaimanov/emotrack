from pydantic import BaseModel
from datetime import datetime


class MessageCreate(BaseModel):
    content: str | None = None
    recipient_id: int


class MessageOut(BaseModel):
    id: int
    content: str | None = None
    sender_id: int
    recipient_id: int
    timestamp: datetime
    is_read: bool
    file_url: str | None = None
    file_name: str | None = None
    file_type: str | None = None
    file_size: int | None = None

    class Config:
        from_attributes = True
