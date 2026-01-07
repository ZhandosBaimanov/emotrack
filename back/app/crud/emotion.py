from sqlalchemy.orm import Session

from app.models import Emotion
from app.schemas import EmotionCreate


def create_emotion(db: Session, emotion: EmotionCreate, user_id: int):
    """Создать запись об эмоции"""
    db_emotion = Emotion(
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
    """Получить эмоции пользователя"""
    return db.query(Emotion).filter(
        Emotion.user_id == user_id
    ).order_by(Emotion.created_at.desc()).offset(skip).limit(limit).all()
