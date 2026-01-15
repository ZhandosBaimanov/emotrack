from sqlalchemy.orm import Session
import random
import string

from app.models import User, UserRole
from app.schemas import UserCreate, UserRole as SchemaUserRole
from app.security import get_password_hash


def generate_psychologist_code(db: Session) -> str:
    """Генерирует уникальный 6-символьный код для психолога"""
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        # Проверяем уникальность
        existing = db.query(User).filter(User.psychologist_code == code).first()
        if not existing:
            return code


def get_user_by_psychologist_code(db: Session, code: str):
    """Найти психолога по его коду"""
    return db.query(User).filter(
        User.psychologist_code == code,
        User.role == UserRole.PSYCHOLOGIST
    ).first()


def get_user_by_email(db: Session, email: str):
    """Получить пользователя по email"""
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):
    """Создать нового пользователя"""
    hashed_pass = get_password_hash(user.password)
    
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email, 
        hashed_password=hashed_pass,
        role=UserRole(user.role.value)
    )
    
    # Если психолог — генерируем уникальный код
    if user.role == SchemaUserRole.PSYCHOLOGIST:
        db_user.psychologist_code = generate_psychologist_code(db)
    
    # Если пациент и передан код психолога — привязываем
    if user.role == SchemaUserRole.USER and user.link_code:
        psychologist = get_user_by_psychologist_code(db, user.link_code)
        if psychologist:
            db_user.linked_psychologist_id = psychologist.id
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_patients_by_psychologist(db: Session, psychologist_id: int):
    """Получить всех пациентов психолога"""
    return db.query(User).filter(
        User.linked_psychologist_id == psychologist_id
    ).all()


def get_psychologist_by_patient(db: Session, patient_id: int):
    """Получить психолога пациента"""
    patient = db.query(User).filter(User.id == patient_id).first()
    if patient and patient.linked_psychologist_id:
        return db.query(User).filter(User.id == patient.linked_psychologist_id).first()
    return None


def get_all_psychologists(db: Session, limit: int = 10):
    """Получить список всех психологов"""
    return db.query(User).filter(
        User.role == UserRole.PSYCHOLOGIST
    ).limit(limit).all()
