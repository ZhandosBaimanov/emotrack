# EmoAI (Emotrack)

## Overview
EmoAI is a mental health tracking application that helps users monitor their emotions, identify stress triggers, and maintain emotional balance. It features user authentication, emotion logging, and psychologist-patient relationships with Solma-style dashboards.

## Recent Changes (January 2026)
- Added Solma-style patient dashboard with dark theme
- Created dashboard components: MoodTracker, TherapistCard, EmotionInput, SessionCalendar, RecentJournals
- Added psychologist recommendation system (shows assigned psychologist OR recommended list)
- Updated psychologist dashboard with emotion tracker visualization for patients
- Added API endpoints for psychologist data

## Project Structure
```
/
├── back/                    # Backend (Python FastAPI)
│   ├── alembic/            # Database migrations
│   ├── app/
│   │   ├── crud/           # Database operations
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API endpoints (auth, users, emotions)
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── config.py       # Configuration settings
│   │   ├── database.py     # Database connection
│   │   ├── dependencies.py # FastAPI dependencies
│   │   ├── main.py         # FastAPI application entry
│   │   └── security.py     # JWT and password handling
│   └── requirements.txt
└── front/                   # Frontend (React + Vite)
    ├── src/
    │   ├── api/            # API client (axios)
    │   ├── components/
    │   │   ├── dashboard/  # Dashboard components (MoodTracker, TherapistCard, etc.)
    │   │   └── ui/         # UI components
    │   ├── context/        # React context providers
    │   ├── pages/          # Page components (PatientDashboard, PsychologistDashboard)
    │   ├── lib/            # Utilities
    │   ├── App.jsx         # Main app component
    │   └── main.jsx        # Entry point
    ├── package.json
    └── vite.config.js
```

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios, Framer Motion
- **Backend**: FastAPI, SQLAlchemy, Alembic, PostgreSQL
- **Auth**: JWT (python-jose), bcrypt password hashing
- **Design**: Dark theme (#1a1a2e), glassmorphism, purple/violet accents

## Development
- Frontend runs on port 5000 (Vite dev server)
- Backend runs on port 8000 (uvicorn)
- Frontend proxies `/api` requests to backend

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-configured by Replit)
- `SECRET_KEY` - JWT signing secret
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time

## API Endpoints
- `/auth/register` - User registration
- `/auth/login` - User login (returns JWT)
- `/users/me` - Get current user
- `/users/my-psychologist` - Get patient's assigned psychologist (returns null if none)
- `/users/psychologists` - Get list of recommended psychologists
- `/emotions/` - CRUD for emotions
- `/emotions/patient/{id}` - Get patient emotions (for psychologists)
- `/emotions/patients` - Get psychologist's patients

## Dashboard Features
- **Patient Dashboard**: Welcome card, emotion input, mood tracker (weekly graph), therapist card, session calendar, recent journals
- **Psychologist Dashboard**: Patient list, emotion history, mood tracker per patient, statistics
- **Therapist Logic**: If patient has assigned psychologist - shows their info; otherwise shows recommended psychologists list
