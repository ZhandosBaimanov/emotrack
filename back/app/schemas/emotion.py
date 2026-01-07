from pydantic import BaseModel
from datetime import datetime


class EmotionCreate(BaseModel):
    emotion_type: str
    intensity: int = 5  # 1-10
    note: str | None = None


class EmotionOut(BaseModel):
    id: int
    user_id: int
    emotion_type: str
    intensity: int
    note: str | None
    created_at: datetime

    class Config:
        from_attributes = True
