from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class NotificationType(str, enum.Enum):
    MESSAGE = "message"           # Новое сообщение
    SESSION = "session"           # Напоминание о сессии
    SYSTEM = "system"             # Системное уведомление
    EMOTION = "emotion"           # Уведомление об эмоциях
    REMINDER = "reminder"         # Напоминание


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Основные поля
    title = Column(String(255), nullable=False)
    message = Column(String(1000), nullable=False)
    notification_type = Column(SQLEnum(NotificationType), default=NotificationType.SYSTEM)
    
    # Статус
    is_read = Column(Boolean, default=False)
    
    # Опциональные поля
    avatar_url = Column(String(500), nullable=True)  # URL аватара отправителя
    action_url = Column(String(500), nullable=True)  # URL для перехода по клику
    
    # Временные метки
    created_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime, nullable=True)
    
    # Связи
    user = relationship("User", backref="notifications")
