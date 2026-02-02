from pydantic import BaseModel, EmailStr, field_serializer
from enum import Enum
from typing import Optional, Dict, Any
from datetime import datetime
from typing import Optional


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


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    social_links: Optional[Dict[str, Any]] = None
    notification_settings: Optional[Dict[str, Any]] = None
    language: Optional[str] = None
    currency: Optional[str] = None


class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    role: str  # Изменено на str для правильной сериализации
    psychologist_code: str | None = None  # Показываем только для психологов
    
    # Новые поля
    phone: str | None = None
    avatar_url: str | None = None
    social_links: Dict[str, Any] | None = None
    notification_settings: Dict[str, Any] | None = None
    language: str | None = "Русский"
    currency: str | None = "RUB"

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


class PasswordChange(BaseModel):
    """Схема для смены пароля"""
    current_password: str
    new_password: str


class Toggle2FA(BaseModel):
    """Схема для включения/выключения 2FA"""
    enabled: bool
class PatientEnhancedOut(PatientOut):
    last_seen: Optional[datetime] = None
    unread_messages_count: int = 0
    new_entries_count: int = 0
    has_new_activity: bool = False
