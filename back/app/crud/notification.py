from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from typing import Optional

from app.models.notification import Notification
from app.schemas.notification import NotificationCreate


def get_notifications_by_user(
    db: Session, 
    user_id: int, 
    skip: int = 0, 
    limit: int = 50,
    unread_only: bool = False
) -> list[Notification]:
    """Получить уведомления пользователя"""
    query = db.query(Notification).filter(Notification.user_id == user_id)
    
    if unread_only:
        query = query.filter(Notification.is_read == False)
    
    return query.order_by(desc(Notification.created_at)).offset(skip).limit(limit).all()


def get_notification_by_id(db: Session, notification_id: int) -> Optional[Notification]:
    """Получить уведомление по ID"""
    return db.query(Notification).filter(Notification.id == notification_id).first()


def get_unread_count(db: Session, user_id: int) -> int:
    """Получить количество непрочитанных уведомлений"""
    return db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).count()


def get_total_count(db: Session, user_id: int) -> int:
    """Получить общее количество уведомлений"""
    return db.query(Notification).filter(Notification.user_id == user_id).count()


def create_notification(db: Session, notification: NotificationCreate) -> Notification:
    """Создать новое уведомление"""
    db_notification = Notification(
        user_id=notification.user_id,
        title=notification.title,
        message=notification.message,
        notification_type=notification.notification_type,
        avatar_url=notification.avatar_url,
        action_url=notification.action_url
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


def mark_as_read(db: Session, notification_id: int, user_id: int) -> Optional[Notification]:
    """Отметить уведомление как прочитанное"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    
    if notification:
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        db.commit()
        db.refresh(notification)
    
    return notification


def mark_all_as_read(db: Session, user_id: int) -> int:
    """Отметить все уведомления пользователя как прочитанные"""
    result = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    })
    db.commit()
    return result


def delete_notification(db: Session, notification_id: int, user_id: int) -> bool:
    """Удалить уведомление"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    
    if notification:
        db.delete(notification)
        db.commit()
        return True
    
    return False


def delete_all_read(db: Session, user_id: int) -> int:
    """Удалить все прочитанные уведомления"""
    result = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == True
    ).delete()
    db.commit()
    return result
