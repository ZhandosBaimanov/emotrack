from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from app.models import User
from app.schemas import UserOut, PatientOut, UserUpdate, PasswordChange, Toggle2FA
from app.dependencies import get_current_user, get_db
from app.crud import user as user_crud
from app.utils.files import save_upload_file
from app.security import verify_password, get_password_hash

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


@router.patch("/me", response_model=UserOut)
def update_user_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить профиль текущего пользователя"""
    return user_crud.update_user(db, current_user, user_update)


@router.post("/me/avatar", response_model=UserOut)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Загрузить аватар"""
    file_info = await save_upload_file(file, current_user.id)
    
    # Обновляем URL аватара
    current_user.avatar_url = file_info["file_url"]
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/me/avatar", response_model=UserOut)
def delete_avatar(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить аватар"""
    current_user.avatar_url = None
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/change-password", response_model=dict)
def change_password(
    password_data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Изменить пароль пользователя"""
    # Проверяем текущий пароль
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Неверный текущий пароль")
    
    # Проверяем длину нового пароля
    if len(password_data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Пароль должен содержать минимум 6 символов")
    
    # Обновляем пароль
    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Пароль успешно изменён"}


@router.put("/toggle-2fa", response_model=dict)
def toggle_2fa(
    toggle_data: Toggle2FA,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Включить/выключить двухфакторную аутентификацию"""
    # В будущем здесь будет реальная логика 2FA
    # Пока просто возвращаем успешный ответ
    return {
        "message": f"Двухфакторная аутентификация {'включена' if toggle_data.enabled else 'отключена'}",
        "enabled": toggle_data.enabled
    }
