from pydantic import BaseModel
from typing import Optional
from datetime import date, time, datetime
from app.models.session import SessionStatus

class SessionBase(BaseModel):
    scheduled_date: date
    scheduled_time: time
    notes: Optional[str] = None

class SessionCreate(SessionBase):
    psychologist_id: int

class SessionUpdate(BaseModel):
    status: Optional[SessionStatus] = None
    notes: Optional[str] = None

class SessionResponse(SessionBase):
    id: int
    patient_id: int
    psychologist_id: int
    status: SessionStatus
    created_at: datetime

    class Config:
        from_attributes = True
