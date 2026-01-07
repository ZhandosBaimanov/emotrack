from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

from app.database import Base


class UserRole(str, enum.Enum):
    USER = "user"
    PSYCHOLOGIST = "psychologist"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Роль пользователя
    role = Column(SQLEnum(UserRole), default=UserRole.USER)
    
    # Уникальный код психолога (только для психологов)
    psychologist_code = Column(String(6), unique=True, nullable=True)
    
    # Ссылка на психолога (только для пациентов)
    linked_psychologist_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Self-referencing relationships
    psychologist = relationship(
        "User", 
        remote_side=[id], 
        backref="patients", 
        foreign_keys=[linked_psychologist_id]
    )
