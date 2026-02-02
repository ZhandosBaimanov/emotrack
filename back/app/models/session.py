from sqlalchemy import Column, Integer, ForeignKey, Date, Time, Enum as SQLEnum, Text, DateTime
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.database import Base

class SessionStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    psychologist_id = Column(Integer, ForeignKey("users.id"))
    scheduled_date = Column(Date, nullable=False)
    scheduled_time = Column(Time, nullable=False)
    status = Column(SQLEnum(SessionStatus), default=SessionStatus.PENDING)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    patient = relationship("User", foreign_keys=[patient_id], backref="patient_sessions")
    psychologist = relationship("User", foreign_keys=[psychologist_id], backref="psychologist_sessions")
