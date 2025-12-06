# Context-Aware Sentiment Chatbot

A sophisticated chatbot application that persists conversation history, analyzes sentiment in real-time, and provides context-aware responses.

## Features

- **Real-Time Sentiment Analysis**: Analyzes user input to determine mood (Positive, Negative, Neutral).
- **Context-Aware Responses**: Adjusts bot personality based on the conversation's overall mood.
- **Session Management**: Persists chat sessions and history.
- **Usage Limits**: Enforces daily session limits (20 sessions/day) for free tier management.
- **Secure Authentication**: JWT-based login and registration.
- **Dockerized**: Ready for production with Nginx and Gunicorn.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS (presumed), Recharts (Analytics).
- **Backend**: Flask, SQLAlchemy (SQLite), Scikit-learn (Sentiment Model).
- **Infrastructure**: Docker, Docker Compose, Nginx.

## Installation

### Prerequisites
- Node.js & npm
- Python 3.10+
- Docker (optional, for containerized run)

### Option 1: Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/context-aware-sentiment-chatbot.git
    cd context-aware-sentiment-chatbot
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    
    # Run the server
    python app.py
    ```
    Backend runs on `http://localhost:5001`.

3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    
    # Run the dev server
    npm run dev
    ```
    Frontend runs on `http://localhost:3000`.

### Option 2: Docker (Production)

To run the full stack (Frontend + Backend + DB) in containers:

```bash
docker-compose up --build -d
```
Access the app at `http://localhost:3000`.

## Cloud Deployment

- **Google Cloud (Free Tier)**: See [GCP_DEPLOYMENT_GUIDE.md](GCP_DEPLOYMENT_GUIDE.md).

## Usage

1.  **Register/Login**: Create an account to start.
2.  **Chat**: Type messages to interact. The bot will analyze your sentiment.
3.  **Analytics**: View real-time sentiment scores and session history.
