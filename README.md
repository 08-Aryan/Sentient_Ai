# Context-Aware Sentiment Chatbot

A production-ready, full-stack chatbot with real-time sentiment analysis, persistent memory, and a modern "Black & Blue" aesthetic.

## 🏗 Architecture

The application follows a **Microservices-ready** architecture, fully containerized with Docker:

*   **Frontend**: React (Vite) + TypeScript + TailwindCSS.
*   **Backend**: Python (Flask) + Gunicorn + SQLAlchemy.
*   **Database**: PostgreSQL (Production) / SQLite (Development fallback).
*   **AI Engine**: Custom Sentiment Analysis Model (`scikit-learn` + `TF-IDF`) + Google Gemini (LLM).

## ✨ Key Features

*   **Real-time Sentiment Analysis**: Analyzes user mood instantly (Positive/Negative/Neutral).
*   **Dynamic Response System**: Responses are fetched from the database, allowing admin updates without code deploys.
*   **Security First**: Rate limiting, Secure Headers, and JWT-ready architecture.
*   **Persistent Sessions**: Chat history is saved to PostgreSQL, with session limits (20/day) enforced.
*   **Modern UI**: Glassmorphism, smooth animations, and responsive design.

## 🚀 Getting Started (The Easy Way)

We recommend using **Docker** for a consistent environment.

### Prerequisites
*   Docker Desktop installed and running.
*   Google Gemini API Key (for LLM features).

### 1. Configure Environment
Create a `.env` file in the `backend/` directory (or rely on defaults/Docker envs):
```bash
# backend/.env
GEMINI_API_KEY=your_key_here
```

### 2. Run with Docker Compose
This command builds the frontend, backend, and database containers and connects them:
```bash
docker-compose up --build
```
*   **Frontend**: `http://localhost:3000`
*   **Backend**: `http://localhost:5001`
*   **Database**: Port `5435` (mapped locally to avoid conflicts).

### 3. Seed the Database
Crucial Step! The database starts empty. Run this connection command **once** to populate response templates:
```bash
docker-compose exec backend python seed_templates.py
```
> You should see: "Successfully added 90 templates."

---

## 🛠 Manual Setup (Without Docker)

If you prefer running services individually:

### Backend
1.  Navigate to `backend/`.
2.  Install dependencies: `pip install -r requirements.txt`.
3.  Run the server: `python app.py`.
4.  Seed DB: `python seed_templates.py`.

### Frontend
1.  Navigate to `frontend/`.
2.  Install dependencies: `npm install`.
3.  Run the dev server: `npm run dev`.

---

## 🧪 Testing

We use **pytest** for backend unit testing.
```bash
# Run tests inside the container
docker-compose exec backend pytest
```

## 📦 Deployment

See [DEPLOYMENT_RENDER_VERCEL.md](./DEPLOYMENT_RENDER_VERCEL.md) for detailed instructions on deploying to **Render (Backend)** and **Vercel (Frontend)**.
