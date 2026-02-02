from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import date, time
from app.models.availability import PsychologistAvailability
from app.schemas.availability import AvailabilityCreate

def create_availability(db: Session, psychologist_id: int, availability: AvailabilityCreate):
    """Создать или обновить доступное время для психолога"""
    # Проверяем, существует ли уже такое время
    existing = db.query(PsychologistAvailability).filter(
        and_(
            PsychologistAvailability.psychologist_id == psychologist_id,
            PsychologistAvailability.available_date == availability.available_date,
            PsychologistAvailability.available_time == availability.available_time,
        )
    ).first()
    
    if existing:
        existing.is_available = availability.is_available
        db.commit()
        return existing
    
    db_availability = PsychologistAvailability(
        psychologist_id=psychologist_id,
        available_date=availability.available_date,
        available_time=availability.available_time,
        is_available=availability.is_available
    )
    db.add(db_availability)
    db.commit()
    db.refresh(db_availability)
    return db_availability

def get_availability_for_date(db: Session, psychologist_id: int, available_date: date):
    """Получить все доступные времена психолога на конкретную дату"""
    return db.query(PsychologistAvailability).filter(
        and_(
            PsychologistAvailability.psychologist_id == psychologist_id,
            PsychologistAvailability.available_date == available_date,
            PsychologistAvailability.is_available == True
        )
    ).all()

def bulk_create_availability(db: Session, psychologist_id: int, availabilities: list):
    """Массовое создание доступных времён"""
    for availability_data in availabilities:
        create_availability(db, psychologist_id, availability_data)
    return True

def delete_availability(db: Session, availability_id: int):
    """Удалить доступное время"""
    availability = db.query(PsychologistAvailability).filter(
        PsychologistAvailability.id == availability_id
    ).first()
    if availability:
        db.delete(availability)
        db.commit()
        return True
    return False
