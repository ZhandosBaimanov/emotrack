import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.database import engine
from app.models import User, Emotion, Message  # noqa: F401 - нужно для создания таблиц
from app.database import Base
from app.routers import auth, users, emotions, messages
from app.init_db import init_db

# Создаем таблицы
Base.metadata.create_all(bind=engine)

# Инициализируем тестовых пользователей
init_db()

app = FastAPI(title="Emotrack API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создаём директорию для загрузок
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Подключаем статику для загруженных файлов
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Подключаем роутеры
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(emotions.router, prefix="/api")
app.include_router(messages.router, prefix="/api")

# Serve static files in production
static_dir = Path(__file__).resolve().parent.parent.parent / "front" / "dist"
if static_dir.exists():
    app.mount("/assets", StaticFiles(directory=static_dir / "assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = static_dir / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(static_dir / "index.html")
else:
    @app.get("/")
    def home():
        return {"status": "API is running", "project": "Emotrack"}
