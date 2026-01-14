import os
from pathlib import Path
from dotenv import load_dotenv

# Загружаем переменные из .env в систему
# .env лежит в папке back/, на уровень выше app/
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)


class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "default-secret-key-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")


settings = Settings()
