from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    PSYCHOLOGIST = "psychologist"


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.USER
    link_code: str | None = None  # Код психолога для привязки (только для пациентов)


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: UserRole
    psychologist_code: str | None = None  # Показываем только для психологов

    class Config:
        from_attributes = True


# Описание того, что сервер возвращает при успешном входе
class Token(BaseModel):
    access_token: str
    token_type: str


# Описание данных, которые мы достаем из расшифрованного токена
class TokenData(BaseModel):
    email: str | None = None


# Схемы для эмоций
class EmotionCreate(BaseModel):
    emotion_type: str
    intensity: int = 5  # 1-10
    note: str | None = None


class EmotionOut(BaseModel):
    id: int
    user_id: int
    emotion_type: str
    intensity: int
    note: str | None
    created_at: datetime

    class Config:
        from_attributes = True


# Схема пациента для психолога
class PatientOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True