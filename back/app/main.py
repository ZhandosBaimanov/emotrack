from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import User, Emotion  # noqa: F401 - нужно для создания таблиц
from app.database import Base
from app.routers import auth, users, emotions

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Emotrack API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(emotions.router)


@app.get("/")
def home():
    return {"status": "API is running", "project": "Emotrack"}
