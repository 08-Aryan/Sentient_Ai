# Context-Aware Sentiment Chatbot

A sophisticated chatbot application that persists conversation history, analyzes sentiment in real-time, and provides context-aware responses.

## Features

- **Real-Time Sentiment Analysis**: Analyzes user input to determine mood (Positive, Negative, Neutral).
- **Context-Aware Responses**: Adjusts bot personality based on the conversation's overall mood.
- **Session Management**: Persists chat sessions and history.
- **Usage Limits**: Enforces daily session limits (20 sessions/day) for free tier management.
- **Secure Authentication**: JWT-based login and registration.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS (presumed), Recharts (Analytics).
- **Backend**: Flask, SQLAlchemy (SQLite), Scikit-learn (Sentiment Model).

## Installation

### Prerequisites
- Node.js & npm
- Python 3.10+

### Local Development

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

## Deployment (Optional)

- **Render & Vercel**: See [DEPLOYMENT_RENDER_VERCEL.md](DEPLOYMENT_RENDER_VERCEL.md) for a production-ready cloud setup.

## Configuration

Security is handled via environment variables (defaults provided for local dev).

### Variables
| Variable | Description | Default (Local) |
|----------|-------------|---------------|
| `SECRET_KEY` | Secures sessions & tokens | `dev_secret_key_local_fallback` |
| `FLASK_ENV` | Toggle Debug/Prod mode | `development` |
| `GEMINI_API_KEY` | (Optional) For AI features | User Provided |

## Usage

1.  **Register/Login**: Create an account to start.
2.  **Chat**: Type messages to interact. The bot will analyze your sentiment.
3.  **Analytics**: View real-time sentiment scores and session history.
