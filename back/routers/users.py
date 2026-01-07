from fastapi import APIRouter, Depends
import models, schemas
from dependencies import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """
    Возвращает данные текущего авторизованного пользователя.
    Зависимость get_current_user сама проверяет токен и ищет юзера в БД.
    """
    return current_user