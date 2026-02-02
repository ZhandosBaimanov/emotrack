from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import json

from app.models import User, UserRole, Message
from app.schemas import PatientOut, UserOut, MessageCreate, MessageOut
from app.dependencies import get_db, get_current_user
from app.crud import message as message_crud
from app.utils.files import save_upload_file

router = APIRouter(
    prefix="/messages",
    tags=["Messages"]
)


# WebSocket manager для управления соединениями
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)

    def get_online_users(self) -> List[int]:
        return list(self.active_connections.keys())


manager = ConnectionManager()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, db: Session = Depends(get_db)):
    await manager.connect(websocket, user_id)
    try:
        # Отправляем список онлайн пользователей
        await websocket.send_json({
            "type": "online_status",
            "online_users": manager.get_online_users()
        })
        
        # Уведомляем других о новом онлайн пользователе
        for uid in manager.get_online_users():
            if uid != user_id:
                await manager.send_personal_message({
                    "type": "online_status",
                    "online_users": manager.get_online_users()
                }, uid)

        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            msg_type = message_data.get("type")
            
            if msg_type == "message":
                # Создаем сообщение в БД
                message = MessageCreate(
                    content=message_data["content"],
                    recipient_id=message_data["recipient_id"]
                )
                db_message = message_crud.create_message(db, message, user_id)
                
                # Отправляем получателю
                await manager.send_personal_message({
                    "type": "message",
                    "message": {
                        "id": db_message.id,
                        "content": db_message.content,
                        "sender_id": db_message.sender_id,
                        "recipient_id": db_message.recipient_id,
                        "timestamp": db_message.timestamp.isoformat(),
                        "is_read": db_message.is_read
                    }
                }, message_data["recipient_id"])
                
                # Отправляем отправителю подтверждение
                await manager.send_personal_message({
                    "type": "message",
                    "message": {
                        "id": db_message.id,
                        "content": db_message.content,
                        "sender_id": db_message.sender_id,
                        "recipient_id": db_message.recipient_id,
                        "timestamp": db_message.timestamp.isoformat(),
                        "is_read": db_message.is_read
                    }
                }, user_id)
                
            elif msg_type == "typing":
                # Уведомляем получателя о печати
                await manager.send_personal_message({
                    "type": "typing",
                    "user_id": user_id
                }, message_data["recipient_id"])
                
            elif msg_type == "mark_read":
                # Отмечаем сообщения как прочитанные
                message_crud.mark_messages_as_read(
                    db, 
                    message_data["sender_id"], 
                    user_id
                )
                
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        # Уведомляем других об отключении
        for uid in manager.get_online_users():
            await manager.send_personal_message({
                "type": "online_status",
                "online_users": manager.get_online_users()
            }, uid)


@router.post("/", response_model=MessageOut)
def send_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Отправить сообщение (HTTP fallback)"""
    # Проверяем права доступа
    recipient = db.query(User).filter(User.id == message.recipient_id).first()
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Получатель не найден"
        )
    
    # Для психолога - только его пациенты
    if current_user.role == UserRole.PSYCHOLOGIST:
        if recipient.linked_psychologist_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Вы можете отправлять сообщения только вашим пациентам"
            )
    
    # Для пациента - только его психолог
    if current_user.role == UserRole.USER:
        if current_user.linked_psychologist_id != message.recipient_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Вы можете отправлять сообщения только вашему психологу"
            )
    
    return message_crud.create_message(db, message, current_user.id)


@router.get("/patients", response_model=List[PatientOut])
def get_my_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список своих пациентов для чата (только для психологов)"""
    if current_user.role != UserRole.PSYCHOLOGIST:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только психологи могут просматривать список пациентов"
        )
    
    # Получаем всех пациентов, привязанных к текущему психологу
    patients = db.query(User).filter(
        User.linked_psychologist_id == current_user.id
    ).all()
    
    return patients


@router.get("/therapist", response_model=UserOut)
def get_my_therapist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить своего психолога для чата (только для пациентов)"""
    if current_user.role != UserRole.USER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только пациенты могут просматривать своего психолога"
        )
    
    if not current_user.linked_psychologist_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="У вас нет привязанного психолога"
        )
    
    therapist = db.query(User).filter(User.id == current_user.linked_psychologist_id).first()
    
    if not therapist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Психолог не найден"
        )
    
    return therapist


@router.get("/history/{recipient_id}", response_model=List[MessageOut])
def get_chat_history(
    recipient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить историю чата с пользователем"""
    # Проверяем права доступа
    recipient = db.query(User).filter(User.id == recipient_id).first()
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Получатель не найден"
        )
    
    # Для психолога - только его пациенты
    if current_user.role == UserRole.PSYCHOLOGIST:
        if recipient.linked_psychologist_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Вы можете общаться только с вашими пациентами"
            )
    
    # Для пациента - только его психолог
    if current_user.role == UserRole.USER:
        if current_user.linked_psychologist_id != recipient_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Вы можете общаться только с вашим психологом"
            )
    
    return message_crud.get_chat_history(db, current_user.id, recipient_id)


@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить количество непрочитанных сообщений"""
    count = message_crud.get_unread_count(db, current_user.id)
    return {"count": count}


@router.post("/upload", response_model=MessageOut)
async def upload_file(
    file: UploadFile = File(...),
    recipient_id: int = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Загрузить файл и отправить как сообщение"""
    
    # Проверяем права доступа
    recipient = db.query(User).filter(User.id == recipient_id).first()
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Получатель не найден"
        )
    
    # Для психолога - только его пациенты
    if current_user.role == UserRole.PSYCHOLOGIST:
        if recipient.linked_psychologist_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Вы можете отправлять файлы только вашим пациентам"
            )
    
    # Для пациента - только его психолог
    if current_user.role == UserRole.USER:
        if current_user.linked_psychologist_id != recipient_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Вы можете отправлять файлы только вашему психологу"
            )
    
    # Сохраняем файл
    file_info = await save_upload_file(file, current_user.id)
    
    # Создаём сообщение
    db_message = Message(
        content=f"Отправил файл: {file_info['file_name']}",
        sender_id=current_user.id,
        recipient_id=recipient_id,
        file_url=file_info['file_url'],
        file_name=file_info['file_name'],
        file_type=file_info['file_type'],
        file_size=file_info['file_size'],
        is_read=False
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    return db_message
