# Context-Aware Sentiment Chatbot

A sophisticated chatbot application that understands the emotional tone of conversations. It features real-time sentiment analysis, mood tracking, and a secure, context-aware chat interface.

## Features

-   **Context-Aware Conversations**: Maintains conversation history to provide relevant responses.
-   **Real-time Sentiment Analysis**: Analyzes the sentiment (Positive, Negative, Neutral) of every user message using a custom-trained model.
-   **Mood Tracking**: Visualizes the emotional trend of the conversation with dynamic charts.
-   **Secure Authentication**: User registration and login with JWT-based session management and HttpOnly cookies.
-   **Session History**: View past conversations and their sentiment summaries.
-   **Responsive Design**: A modern, dark-themed UI built with React and Tailwind CSS.

## Tech Stack

### Frontend
-   **React**: UI library for building the interface.
-   **TypeScript**: For type-safe code.
-   **Tailwind CSS**: For styling (via CDN for simplicity).
-   **Recharts**: For sentiment visualization charts.
-   **Lucide React**: For icons.
-   **React Router**: For navigation and routing.
-   **Vite**: Build tool and development server.

### Backend
-   **Flask**: Python web framework.
-   **Flask-SQLAlchemy**: ORM for database interactions.
-   **Flask-Bcrypt**: For password hashing.
-   **PyJWT**: For JSON Web Token authentication.
-   **Scikit-learn**: For the sentiment analysis model.
-   **Numpy**: For numerical operations.

### Database
-   **SQLite**: Lightweight relational database for storing users and chat sessions.

## Project Structure

```
├── backend/
│   ├── routes/         # API routes (auth, chat, main)
│   ├── services/       # Business logic (sentiment analysis)
│   ├── utils/          # Helper functions and decorators
│   ├── models.py       # Database models
│   ├── app.py          # Application entry point
│   ├── config.py       # Configuration settings
│   └── requirements.txt # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # React Context (Auth)
    │   ├── hooks/      # Custom React hooks
    │   ├── pages/      # Page components (Landing, Login, Chat)
    │   ├── utils/      # Utility functions
    │   └── App.tsx     # Main application component
    └── package.json    # Node.js dependencies
```

## Setup Instructions

### Prerequisites
-   Node.js (v14+)
-   Python (v3.8+)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Create a `.env` file based on `.env.example`:
    ```bash
    cp .env.example .env
    ```

5.  Run the server:
    ```bash
    python app.py
    ```
    The backend will run on `http://localhost:5001`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will run on `http://localhost:5173`.

## Environment Variables

### Backend (`.env`)
-   `SECRET_KEY`: Secret key for Flask sessions and JWT.
-   `DATABASE_URL`: Database connection string (default: `sqlite:///chatbot.db`).
-   `FLASK_ENV`: `development` or `production`.
-   `CORS_ORIGINS`: Comma-separated list of allowed CORS origins.
-   `ARTIFACT_PATH`: Path to the sentiment analysis model artifacts.

### Frontend (`.env` or `vite.config.ts`)
-   `VITE_API_URL`: URL of the backend API (default: `http://localhost:5001`).

## Usage

1.  Open the frontend URL in your browser.
2.  Click **Get Started** to register a new account.
3.  Log in to access the chat interface.
4.  Start chatting! The bot will analyze your sentiment and respond accordingly.
5.  Click **End Chat** to see a summary report of your conversation.
6.  Use the sidebar to view previous session summaries.

## License

[MIT License](LICENSE)