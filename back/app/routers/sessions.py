from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User, UserRole
from app.schemas.session import SessionCreate, SessionResponse, SessionUpdate
from app.crud import session as crud_session
from app.models.session import SessionStatus

router = APIRouter(
    prefix="/sessions",
    tags=["sessions"]
)

@router.post("/request", response_model=SessionResponse)
def request_session(
    session: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.USER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только пациенты могут отправлять запросы на сеанс"
        )
    return crud_session.create_session(db=db, session=session, patient_id=current_user.id)

@router.get("/my", response_model=List[SessionResponse])
def get_my_sessions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == UserRole.USER:
        return crud_session.get_patient_sessions(db, current_user.id, skip, limit)
    else:
        return crud_session.get_psychologist_sessions(db, current_user.id, skip, limit)

@router.patch("/{session_id}/status", response_model=SessionResponse)
def update_session_status(
    session_id: int,
    status_update: SessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = crud_session.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Сеанс не найден")

    # Authorization checks
    if current_user.role == UserRole.PSYCHOLOGIST:
        if session.psychologist_id != current_user.id:
            raise HTTPException(status_code=403, detail="Нет доступа")
    elif current_user.role == UserRole.USER:
        if session.patient_id != current_user.id:
             raise HTTPException(status_code=403, detail="Нет доступа")
        # Patients can only cancel pending sessions
        if status_update.status == SessionStatus.CANCELLED and session.status != SessionStatus.PENDING:
             raise HTTPException(status_code=400, detail="Можно отменить только ожидающий подтверждения сеанс")

    return crud_session.update_session(db, session_id, status_update)

@router.get("/slots/{psychologist_id}", response_model=List[SessionResponse])
def get_slots(
    psychologist_id: int,
    date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_session.get_psychologist_slots(db, psychologist_id, date)
