from pydantic import BaseModel, EmailStr, field_serializer
from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    PSYCHOLOGIST = "psychologist"


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.USER
    link_code: str | None = None  # Код психолога для привязки (только для пациентов)


class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    role: str  # Изменено на str для правильной сериализации
    psychologist_code: str | None = None  # Показываем только для психологов

    @field_serializer('role')
    def serialize_role(self, role, _info):
        """Сериализация роли в строку"""
        if isinstance(role, Enum):
            return role.value
        return str(role)

    class Config:
        from_attributes = True


class PatientOut(BaseModel):
    """Схема пациента для психолога"""
    id: int
    first_name: str
    last_name: str
    email: EmailStr

    class Config:
        from_attributes = True
