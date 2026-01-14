# Emotrack

## Overview
Emotrack is a mental health tracking application that helps users monitor their emotions, identify stress triggers, and maintain emotional balance. It features user authentication, emotion logging, and psychologist-patient relationships.

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
    │   ├── components/     # Reusable UI components
    │   ├── context/        # React context providers
    │   ├── pages/          # Page components
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
- `/emotions/` - CRUD for emotions
- `/emotions/patient/{id}` - Get patient emotions (for psychologists)
- `/emotions/patients` - Get psychologist's patients
