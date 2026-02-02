import os
from pathlib import Path
from fastapi import UploadFile
from datetime import datetime


UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


async def save_upload_file(file: UploadFile, user_id: int) -> dict:
    """Сохранить загруженный файл и вернуть информацию о нём"""
    
    # Создаём уникальное имя файла
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_extension = Path(file.filename).suffix
    safe_filename = f"{user_id}_{timestamp}{file_extension}"
    
    file_path = UPLOAD_DIR / safe_filename
    
    # Сохраняем файл
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Определяем тип файла
    file_type = get_file_type(file.filename)
    
    return {
        "file_url": f"/uploads/{safe_filename}",
        "file_name": file.filename,
        "file_type": file_type,
        "file_size": len(content)
    }


def get_file_type(filename: str) -> str:
    """Определить тип файла по расширению"""
    extension = Path(filename).suffix.lower()
    
    if extension in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
        return 'image'
    elif extension in ['.pdf']:
        return 'pdf'
    elif extension in ['.doc', '.docx']:
        return 'document'
    elif extension in ['.xls', '.xlsx']:
        return 'spreadsheet'
    elif extension in ['.mp4', '.avi', '.mov']:
        return 'video'
    elif extension in ['.mp3', '.wav']:
        return 'audio'
    else:
        return 'file'
