from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
from datetime import datetime, timedelta

from app.models import User, UserRole, Message, Emotion
from app.schemas.user import PatientEnhancedOut
from app.dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/psychologist",
    tags=["Psychologist"]
)

@router.get("/patients", response_model=List[PatientEnhancedOut])
def get_patients_advanced(
    search: Optional[str] = None,
    sort: Optional[str] = "last_seen", # name, last_seen, entries
    order: Optional[str] = "desc",
    filter_status: Optional[str] = None, # all, new_activity
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.PSYCHOLOGIST:
        raise HTTPException(status_code=403, detail="Only psychologists can access this")
        
    query = db.query(User).filter(User.linked_psychologist_id == current_user.id)
    
    # Search
    if search:
        search_term = f"%{search}%"
        query = query.filter(or_(
            User.first_name.ilike(search_term),
            User.last_name.ilike(search_term),
            User.email.ilike(search_term)
        ))
        
    patients = query.all()
    enhanced_patients = []
    
    yesterday = datetime.now() - timedelta(days=1)
    
    for p in patients:
        unread = db.query(func.count(Message.id)).filter(
            Message.sender_id == p.id,
            Message.recipient_id == current_user.id,
            Message.is_read == False
        ).scalar() or 0
        
        # New entries (emotions in last 24h)
        new_entries = db.query(func.count(Emotion.id)).filter(
            Emotion.user_id == p.id,
            Emotion.created_at >= yesterday
        ).scalar() or 0
        
        has_activity = (unread > 0) or (new_entries > 0)
        
        # Filter by status logic
        if filter_status == "new_activity" and not has_activity:
            continue
            
        enhanced_patients.append({
            "id": p.id,
            "first_name": p.first_name,
            "last_name": p.last_name,
            "email": p.email,
            "last_seen": p.last_seen,
            "unread_messages_count": unread,
            "new_entries_count": new_entries,
            "has_new_activity": has_activity
        })
        
    # Sort
    reverse = (order == "desc")
    if sort == "name":
        enhanced_patients.sort(key=lambda x: (x["first_name"], x["last_name"]), reverse=reverse)
    elif sort == "last_seen":
        # Handle None dates for sorting
        enhanced_patients.sort(key=lambda x: x["last_seen"].timestamp() if x["last_seen"] else 0, reverse=reverse)
    elif sort == "entries":
        enhanced_patients.sort(key=lambda x: x["new_entries_count"], reverse=reverse)
        
    # Pagination
    start = (page - 1) * per_page
    end = start + per_page
    return enhanced_patients[start:end]
