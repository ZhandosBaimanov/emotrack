from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import crud, schemas, models
from dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/emotions",
    tags=["Emotions"]
)


@router.post("/", response_model=schemas.EmotionOut)
def create_emotion(
    emotion: schemas.EmotionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Создать запись об эмоции (только для пациентов)"""
    if current_user.role == models.UserRole.PSYCHOLOGIST:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Психологи не могут создавать записи об эмоциях"
        )
    return crud.create_emotion(db=db, emotion=emotion, user_id=current_user.id)


@router.get("/", response_model=List[schemas.EmotionOut])
def get_my_emotions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Получить свои эмоции (для пациентов)"""
    return crud.get_user_emotions(db=db, user_id=current_user.id, skip=skip, limit=limit)


@router.get("/patient/{patient_id}", response_model=List[schemas.EmotionOut])
def get_patient_emotions(
    patient_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Получить эмоции пациента (только для психолога, к которому привязан пациент)"""
    # Проверяем, что текущий пользователь — психолог
    if current_user.role != models.UserRole.PSYCHOLOGIST:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только психологи могут просматривать эмоции пациентов"
        )
    
    # Проверяем, что пациент привязан к этому психологу
    patient = db.query(models.User).filter(models.User.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пациент не найден"
        )
    
    if patient.linked_psychologist_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Этот пациент не привязан к вам"
        )
    
    return crud.get_user_emotions(db=db, user_id=patient_id, skip=skip, limit=limit)


@router.get("/patients", response_model=List[schemas.PatientOut])
def get_my_patients(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Получить список своих пациентов (только для психологов)"""
    if current_user.role != models.UserRole.PSYCHOLOGIST:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только психологи могут просматривать список пациентов"
        )
    
    return crud.get_patients_by_psychologist(db=db, psychologist_id=current_user.id)
