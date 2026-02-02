from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import date

from app.models.session import Session as SessionModel, SessionStatus
from app.schemas.session import SessionCreate, SessionUpdate

def create_session(db: Session, session: SessionCreate, patient_id: int):
    db_session = SessionModel(
        patient_id=patient_id,
        psychologist_id=session.psychologist_id,
        scheduled_date=session.scheduled_date,
        scheduled_time=session.scheduled_time,
        notes=session.notes,
        status=SessionStatus.PENDING
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_session(db: Session, session_id: int):
    return db.query(SessionModel).filter(SessionModel.id == session_id).first()

def get_patient_sessions(db: Session, patient_id: int, skip: int = 0, limit: int = 100):
    return db.query(SessionModel).filter(
        SessionModel.patient_id == patient_id
    ).offset(skip).limit(limit).all()

def get_psychologist_sessions(db: Session, psychologist_id: int, skip: int = 0, limit: int = 100):
    return db.query(SessionModel).filter(
        SessionModel.psychologist_id == psychologist_id
    ).offset(skip).limit(limit).all()

def update_session(db: Session, session_id: int, update_data: SessionUpdate):
    db_session = get_session(db, session_id)
    if not db_session:
        return None
    
    if update_data.status:
        db_session.status = update_data.status
    if update_data.notes:
        db_session.notes = update_data.notes
        
    db.commit()
    db.refresh(db_session)
    return db_session

def get_psychologist_slots(db: Session, psychologist_id: int, date_obj: date):
    # This is a basic implementation. In a real app, you'd check for conflicts.
    # returning existing sessions for that day to filter out taken slots
    return db.query(SessionModel).filter(
        and_(
            SessionModel.psychologist_id == psychologist_id,
            SessionModel.scheduled_date == date_obj,
            SessionModel.status.in_([SessionStatus.PENDING, SessionStatus.APPROVED])
        )
    ).all()
