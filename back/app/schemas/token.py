from pydantic import BaseModel


class Token(BaseModel):
    """Описание того, что сервер возвращает при успешном входе"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Описание данных, которые мы достаем из расшифрованного токена"""
    email: str | None = None
