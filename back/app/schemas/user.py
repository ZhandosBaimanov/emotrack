from pydantic import BaseModel, EmailStr
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


class PatientOut(BaseModel):
    """Схема пациента для психолога"""
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True
