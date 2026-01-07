from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone
import enum


class UserRole(str, enum.Enum):
    USER = "user"
    PSYCHOLOGIST = "psychologist"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Роль пользователя
    role = Column(SQLEnum(UserRole), default=UserRole.USER)
    
    # Уникальный код психолога (только для психологов)
    psychologist_code = Column(String(6), unique=True, nullable=True)
    
    # Ссылка на психолога (только для пациентов)
    linked_psychologist_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Self-referencing relationships
    psychologist = relationship("User", remote_side=[id], backref="patients", foreign_keys=[linked_psychologist_id])


class Emotion(Base):
    __tablename__ = "emotions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    emotion_type = Column(String, nullable=False)  # happy, sad, angry, etc.
    intensity = Column(Integer, default=5)  # 1-10
    note = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationship
    user = relationship("User", backref="emotions")