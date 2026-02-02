"""
Инициализация базы данных с тестовыми пользователями
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User, UserRole
from app.security import get_password_hash
from app.crud.user import generate_psychologist_code


def init_test_users(db: Session):
    """Создать тестовых пользователей если их еще нет"""
    
    # Проверяем, есть ли уже пользователи
    existing_patient = db.query(User).filter(User.email == "akimdzhan@gmail.com").first()
    existing_psychologist = db.query(User).filter(User.email == "nurken@gmail.com").first()
    
    psychologist = None
    
    # Создаем психолога
    if not existing_psychologist:
        psychologist_code = generate_psychologist_code(db)
        psychologist = User(
            first_name="Нуркен",
            last_name="Арыстанов",
            email="nurken@gmail.com",
            hashed_password=get_password_hash("Zhandos27"),
            role=UserRole.PSYCHOLOGIST,
            psychologist_code=psychologist_code
        )
        db.add(psychologist)
        db.commit()
        db.refresh(psychologist)
        print(f"Created psychologist: Нуркен Арыстанов (nurken@gmail.com)")
        print(f"   Password: Zhandos27")
        print(f"   Psychologist code: {psychologist_code}")
    else:
        psychologist = existing_psychologist
        print(f"Psychologist already exists: {psychologist.email}")
    
    # Создаем пациента
    if not existing_patient:
        patient = User(
            first_name="Жандос",
            last_name="Акимджан",
            email="akimdzhan@gmail.com",
            hashed_password=get_password_hash("Zhandos27"),
            role=UserRole.USER,
            linked_psychologist_id=psychologist.id if psychologist else None
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)
        print(f"Created patient: Жандос Акимджан (akimdzhan@gmail.com)")
        print(f"   Password: Zhandos27")
        if psychologist:
            print(f"   Linked to psychologist: {psychologist.first_name} {psychologist.last_name}")
    else:
        print(f"Patient already exists: {existing_patient.email}")


def init_db():
    """Инициализация базы данных"""
    db = SessionLocal()
    try:
        print("\nInitializing test users...")
        init_test_users(db)
        print("Initialization complete!\n")
    except Exception as e:
        print(f"Error during initialization: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()