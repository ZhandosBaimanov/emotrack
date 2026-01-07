from fastapi import FastAPI
import models
from database import engine
from routers import auth, users, emotions  # Импорт наших роутеров

# Создаем таблицы
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Emotrack API")

# Подключаем модули
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(emotions.router)

@app.get("/")
def home():
    return {"status": "API is running", "project": "Emotrack"}