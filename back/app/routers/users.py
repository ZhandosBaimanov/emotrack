from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.models import User
from app.schemas import UserOut, PatientOut
from app.dependencies import get_current_user, get_db
from app.crud import user as user_crud

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me", response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Возвращает данные текущего авторизованного пользователя.
    Зависимость get_current_user сама проверяет токен и ищет юзера в БД.
    """
    return current_user


@router.get("/my-psychologist", response_model=UserOut | None)
def get_my_psychologist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Получить психолога текущего пациента.
    Возвращает null если психолог не назначен.
    """
    psychologist = user_crud.get_psychologist_by_patient(db, current_user.id)
    return psychologist


@router.get("/psychologists", response_model=List[UserOut])
def get_psychologists(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Получить список рекомендуемых психологов.
    """
    psychologists = user_crud.get_all_psychologists(db)
    return psychologists
