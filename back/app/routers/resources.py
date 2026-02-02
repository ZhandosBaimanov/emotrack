from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import os
from pathlib import Path
from datetime import datetime

from app.models import User, UserRole, Resource
from app.schemas import ResourceOut, ResourceCreate, ResourceUpdate
from app.dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/resources",
    tags=["Resources"]
)

# Use absolute path relative to backend root
# back/app/routers/resources.py -> back/uploads/resources
UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "resources"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/", response_model=ResourceOut)
async def upload_resource(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    is_public: bool = Form(False),
    tags: Optional[str] = Form(None), # Expecting JSON string
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.PSYCHOLOGIST:
        raise HTTPException(status_code=403, detail="Only psychologists can upload resources")
        
    # Save file
    # Generate unique filename: {psychologist_id}_{timestamp}_{original_name}
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    # Sanitize filename slightly
    original_name = Path(file.filename).name
    safe_filename = f"{current_user.id}_{timestamp}_{original_name}"
    file_path = UPLOAD_DIR / safe_filename
    
    # Read and write
    content = await file.read()
    if len(content) > 50 * 1024 * 1024: # 50MB limit
         raise HTTPException(status_code=400, detail="File too large (max 50MB)")
    
    with open(file_path, "wb") as buffer:
        buffer.write(content)
        
    parsed_tags = []
    if tags:
        try:
            parsed_tags = json.loads(tags)
        except:
            pass
            
    resource = Resource(
        title=title,
        description=description,
        file_path=str(file_path),
        file_type=Path(file.filename).suffix.lower(),
        file_size=len(content),
        psychologist_id=current_user.id,
        is_public=is_public,
        tags=parsed_tags
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource

@router.get("/psychologist", response_model=List[ResourceOut])
def get_my_resources(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.PSYCHOLOGIST:
        raise HTTPException(status_code=403, detail="Only psychologists can view their resources")
    return db.query(Resource).filter(Resource.psychologist_id == current_user.id).order_by(Resource.created_at.desc()).all()

@router.get("/patient", response_model=List[ResourceOut])
def get_patient_resources(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.USER:
        raise HTTPException(status_code=403, detail="Only patients can view patient resources")
        
    if not current_user.linked_psychologist_id:
        return []
        
    return db.query(Resource).filter(
        Resource.psychologist_id == current_user.linked_psychologist_id,
        Resource.is_public == True
    ).order_by(Resource.created_at.desc()).all()

@router.get("/{resource_id}/download")
def download_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    # Check access
    if current_user.role == UserRole.PSYCHOLOGIST:
        if resource.psychologist_id != current_user.id:
             raise HTTPException(status_code=403, detail="Not authorized")
    elif current_user.role == UserRole.USER:
        if resource.psychologist_id != current_user.linked_psychologist_id:
             raise HTTPException(status_code=403, detail="Not authorized")
        if not resource.is_public:
             raise HTTPException(status_code=403, detail="Resource is private")
             
    return FileResponse(
        path=resource.file_path, 
        filename=Path(resource.file_path).name,
        media_type="application/octet-stream" # Force download
    )

@router.delete("/{resource_id}")
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    if resource.psychologist_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this resource")
        
    # Delete file
    try:
        if os.path.exists(resource.file_path):
            os.remove(resource.file_path)
    except OSError:
        pass 
        
    db.delete(resource)
    db.commit()
    return {"message": "Resource deleted"}
