from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class ResourceBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_public: bool = False
    tags: Optional[List[str]] = None

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
    tags: Optional[List[str]] = None

class ResourceOut(ResourceBase):
    id: int
    file_path: str
    file_type: str
    file_size: int
    psychologist_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
