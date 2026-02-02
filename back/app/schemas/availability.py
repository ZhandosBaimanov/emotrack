from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional

class AvailabilityCreate(BaseModel):
    available_date: date
    available_time: time
    is_available: bool = True

class AvailabilityResponse(AvailabilityCreate):
    id: int
    psychologist_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AvailabilityBulkCreate(BaseModel):
    available_date: date
    times: list[time]  # Список времён для этой даты
