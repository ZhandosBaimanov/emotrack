from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, time
from typing import List

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User, UserRole
from app.schemas.availability import AvailabilityCreate, AvailabilityResponse, AvailabilityBulkCreate
from app.crud import availability as crud_availability

router = APIRouter(
    prefix="/availability",
    tags=["availability"]
)

@router.post("/", response_model=AvailabilityResponse)
def create_availability(
    availability: AvailabilityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать доступное время для психолога"""
    if current_user.role != UserRole.PSYCHOLOGIST:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только психологи могут добавлять доступность"
        )
    return crud_availability.create_availability(db, current_user.id, availability)

@router.post("/bulk", response_model=dict)
def bulk_create_availability(
    bulk_data: AvailabilityBulkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Массовое добавление доступных времён на дату"""
    if current_user.role != UserRole.PSYCHOLOGIST:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только психологи могут добавлять доступность"
        )
    
    availabilities = []
    for t in bulk_data.times:
        availabilities.append(AvailabilityCreate(
            available_date=bulk_data.available_date,
            available_time=t,
            is_available=True
        ))
    
    crud_availability.bulk_create_availability(db, current_user.id, availabilities)
    return {"status": "success", "count": len(availabilities)}

@router.get("/{psychologist_id}/{date_str}", response_model=List[AvailabilityResponse])
def get_availability(
    psychologist_id: int,
    date_str: str,
    db: Session = Depends(get_db),
):
    """Получить доступные времена психолога на дату"""
    try:
        available_date = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Неверный формат даты")
    
    return crud_availability.get_availability_for_date(db, psychologist_id, available_date)

@router.delete("/{availability_id}")
def delete_availability(
    availability_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить доступное время"""
    if current_user.role != UserRole.PSYCHOLOGIST:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только психологи могут удалять доступность"
        )
    
    if crud_availability.delete_availability(db, availability_id):
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Доступность не найдена")
