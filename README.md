# Context-Aware Sentiment Chatbot

A production-grade, context-aware chatbot that performs real-time sentiment analysis and adapts its responses based on the conversation's emotional trajectory.

## 🌟 Features

-   **Real-Time Sentiment Analysis**: Analyzes user input instantly using a hybrid approach (Local + Backend).
-   **Context-Aware Responses**: Adapts bot persona based on the conversation history and emotional context.
-   **Visual Feedback**: Dynamic UI that changes colors and gradients based on the current mood (Blue/Green/Red).
-   **Session Analytics**: Generates a comprehensive summary report with emotional trends and charts at the end of the session.
-   **Dockerized**: Fully containerized for easy deployment.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS
-   **Backend**: Python, Flask, Scikit-learn, NLTK VADER
-   **Deployment**: Docker, Docker Compose

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   Python (v3.10+)
-   Docker & Docker Compose (optional, for containerized run)

### Option 1: Run Locally

#### 1. Backend Setup
```bash
cd backend
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```
The backend will start on `http://localhost:5001`.

#### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run the development server
npm run dev
```
The frontend will start on `http://localhost:3000`.

### Option 2: Run with Docker (Recommended)

Run the entire application with a single command:

```bash
docker-compose up --build
```

-   **Frontend**: `http://localhost:3000`
-   **Backend**: `http://localhost:5001`

## 🧠 Core Logic

### The Context Matrix
The bot maintains a **Conversation State** to ensure emotional consistency.

| Current Input | Overall Mood (History) | Bot Persona | Example Response |
| :--- | :--- | :--- | :--- |
| **Positive** | **Positive** | Enthusiastic | "That's fantastic! Let's keep this momentum going!" |
| **Positive** | **Negative** | Cautious | "I'm glad that helped, but I haven't forgotten our earlier issues." |
| **Negative** | **Positive** | Surprised/Helpful | "Oh no, we were doing so well. Let me fix this immediately." |
| **Negative** | **Negative** | Apologetic | "I understand your frustration is growing. I am committed to fixing this." |

## 📂 Project Structure

```
├── backend/                # Flask API & Sentiment Analysis
│   ├── app.py              # Main application entry point
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend container config
│
├── frontend/               # React Application
│   ├── src/                # Source code
│   │   ├── components/     # UI Components
│   │   ├── services/       # API Services
│   │   └── utils/          # Helper functions
│   └── Dockerfile          # Frontend container config
│
└── docker-compose.yml      # Orchestration for both services
```

## 📝 License

This project is open-source and available under the MIT License.
