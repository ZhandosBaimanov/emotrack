from sqlalchemy import Column, Integer, ForeignKey, Date, Time, Boolean, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base

class PsychologistAvailability(Base):
    __tablename__ = "psychologist_availability"
    __table_args__ = (
        UniqueConstraint('psychologist_id', 'available_date', 'available_time', 
                        name='unique_psychologist_availability'),
    )

    id = Column(Integer, primary_key=True, index=True)
    psychologist_id = Column(Integer, ForeignKey("users.id"), index=True)
    available_date = Column(Date, nullable=False, index=True)
    available_time = Column(Time, nullable=False)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    psychologist = relationship("User", foreign_keys=[psychologist_id], backref="availability_slots")
