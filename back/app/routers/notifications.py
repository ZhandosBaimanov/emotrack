from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.crud import notification as notification_crud
from app.schemas.notification import (
    NotificationOut, 
    NotificationListOut, 
    NotificationCreate
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("", response_model=NotificationListOut)
async def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    unread_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список уведомлений текущего пользователя"""
    notifications = notification_crud.get_notifications_by_user(
        db, 
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        unread_only=unread_only
    )
    total = notification_crud.get_total_count(db, current_user.id)
    unread_count = notification_crud.get_unread_count(db, current_user.id)
    
    return NotificationListOut(
        notifications=notifications,
        total=total,
        unread_count=unread_count
    )


@router.get("/unread-count")
async def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить количество непрочитанных уведомлений"""
    count = notification_crud.get_unread_count(db, current_user.id)
    return {"unread_count": count}


@router.get("/{notification_id}", response_model=NotificationOut)
async def get_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить конкретное уведомление"""
    notification = notification_crud.get_notification_by_id(db, notification_id)
    
    if not notification or notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return notification


@router.patch("/{notification_id}/read", response_model=NotificationOut)
async def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Отметить уведомление как прочитанное"""
    notification = notification_crud.mark_as_read(
        db, 
        notification_id=notification_id, 
        user_id=current_user.id
    )
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return notification


@router.patch("/mark-all-read")
async def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Отметить все уведомления как прочитанные"""
    count = notification_crud.mark_all_as_read(db, current_user.id)
    return {"message": f"Marked {count} notifications as read"}


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить уведомление"""
    success = notification_crud.delete_notification(
        db, 
        notification_id=notification_id, 
        user_id=current_user.id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return {"message": "Notification deleted"}


@router.delete("")
async def delete_read_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить все прочитанные уведомления"""
    count = notification_crud.delete_all_read(db, current_user.id)
    return {"message": f"Deleted {count} read notifications"}


# Внутренний эндпоинт для создания уведомлений (используется другими сервисами)
@router.post("", response_model=NotificationOut, include_in_schema=False)
async def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать уведомление (внутренний API)"""
    # Только для создания уведомлений самому себе или если есть права
    if notification.user_id != current_user.id:
        # В будущем можно добавить проверку на роль психолога
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create notification for another user"
        )
    
    return notification_crud.create_notification(db, notification)
