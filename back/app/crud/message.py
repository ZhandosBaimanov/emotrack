from sqlalchemy.orm import Session
from app.models import Message
from app.schemas import MessageCreate
from datetime import datetime


def create_message(db: Session, message: MessageCreate, sender_id: int):
    """Создать новое сообщение"""
    db_message = Message(
        content=message.content,
        sender_id=sender_id,
        recipient_id=message.recipient_id,
        timestamp=datetime.utcnow(),
        is_read=False
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def get_chat_history(db: Session, user1_id: int, user2_id: int, skip: int = 0, limit: int = 100):
    """Получить историю чата между двумя пользователями"""
    messages = db.query(Message).filter(
        ((Message.sender_id == user1_id) & (Message.recipient_id == user2_id)) |
        ((Message.sender_id == user2_id) & (Message.recipient_id == user1_id))
    ).order_by(Message.timestamp.asc()).offset(skip).limit(limit).all()
    return messages


def mark_messages_as_read(db: Session, sender_id: int, recipient_id: int):
    """Отметить все сообщения от отправителя как прочитанные"""
    db.query(Message).filter(
        Message.sender_id == sender_id,
        Message.recipient_id == recipient_id,
        Message.is_read == False
    ).update({"is_read": True})
    db.commit()


def get_unread_count(db: Session, user_id: int):
    """Получить количество непрочитанных сообщений"""
    count = db.query(Message).filter(
        Message.recipient_id == user_id,
        Message.is_read == False
    ).count()
    return count
