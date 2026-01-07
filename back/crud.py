from sqlalchemy.orm import Session
import models, schemas, security
import random
import string


def generate_psychologist_code(db: Session) -> str:
    """Генерирует уникальный 6-символьный код для психолога"""
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        # Проверяем уникальность
        existing = db.query(models.User).filter(models.User.psychologist_code == code).first()
        if not existing:
            return code


def get_user_by_psychologist_code(db: Session, code: str):
    """Найти психолога по его коду"""
    return db.query(models.User).filter(
        models.User.psychologist_code == code,
        models.User.role == models.UserRole.PSYCHOLOGIST
    ).first()


# Эта функция нужна для проверки: существует ли уже такой email
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# Эта функция создает пользователя
def create_user(db: Session, user: schemas.UserCreate):
    hashed_pass = security.get_password_hash(user.password)
    
    db_user = models.User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_pass,
        role=models.UserRole(user.role.value)
    )
    
    # Если психолог — генерируем уникальный код
    if user.role == schemas.UserRole.PSYCHOLOGIST:
        db_user.psychologist_code = generate_psychologist_code(db)
    
    # Если пациент и передан код психолога — привязываем
    if user.role == schemas.UserRole.USER and user.link_code:
        psychologist = get_user_by_psychologist_code(db, user.link_code)
        if psychologist:
            db_user.linked_psychologist_id = psychologist.id
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# CRUD для эмоций
def create_emotion(db: Session, emotion: schemas.EmotionCreate, user_id: int):
    db_emotion = models.Emotion(
        user_id=user_id,
        emotion_type=emotion.emotion_type,
        intensity=emotion.intensity,
        note=emotion.note
    )
    db.add(db_emotion)
    db.commit()
    db.refresh(db_emotion)
    return db_emotion


def get_user_emotions(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Emotion).filter(
        models.Emotion.user_id == user_id
    ).order_by(models.Emotion.created_at.desc()).offset(skip).limit(limit).all()


def get_patients_by_psychologist(db: Session, psychologist_id: int):
    """Получить всех пациентов психолога"""
    return db.query(models.User).filter(
        models.User.linked_psychologist_id == psychologist_id
    ).all()