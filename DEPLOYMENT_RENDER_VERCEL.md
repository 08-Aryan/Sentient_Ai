# Deployment Guide: Render & Vercel

This guide explains how to deploy the chatbot with a **split architecture**:
- **Backend**: Deployed on **Render** (Python/Flask).
- **Frontend**: Deployed on **Vercel** (React/Vite).
- **Database**: PostgreSQL on **Render**.

---

## Step 1: Push Code to GitHub
Ensure all your specific configuration changes (like the recent `vercel.json` addition) are pushed to your GitHub repository.

---

## Step 2: Deploy Backend (Render)

1.  **Create Account/Login**: Go to [render.com](https://render.com).
2.  **Create Web Service**:
    -   Click **New +** -> **Web Service**.
    -   Connect your GitHub repository: `Sentient_Ai` (or whatever you named it).
3.  **Configuration**:
    -   **Name**: `sentiment-chatbot-backend`
    -   **Region**: Closest to you (e.g., Ohio, Frankfurt).
    -   **Branch**: `main`
    -   **Runtime**: `Python 3`
    -   **Build Command**: `pip install -r backend/requirements.txt`
    -   **Start Command**: `cd backend && gunicorn app:app`
    -   **Plan**: Free
4.  **Environment Variables** (Scroll down to "Advanced"):
    -   `FLASK_ENV`: `production`
    -   `SECRET_KEY`: (Generate a random string)
    -   `PYTHON_VERSION`: `3.10.12` (Recommended)
    -   `CORS_ORIGINS`: `*` (Temporarily, we will lock this down to the Vercel URL later).
    -   `GUNICORN_WORKERS`: `2` (Optional, defaults to 2).
5.  **Create Service**: Click **Create Web Service**.

### Add Database (Crucial for Persistence)
1.  On Render.com dashboard, click **New +** -> **PostgreSQL**.
2.  **Name**: `chatbot-db`
3.  **Plan**: Free.
4.  **Create Database**.
5.  **Copy Internal DB URL**: Find the `Internal Database URL` (starts with `postgres://`).
6.  **Link to Backend**:
    -   Go back to your **Web Service** (`sentiment-chatbot-backend`).
    -   Go to **Environment**.
    -   Add `DATABASE_URL` and paste the `Internal Database URL`.
    -   Save Changes. Render will redeploy.

**Copy Backend URL**: Once deployed, copy the URL (e.g., `https://sentiment-chatbot-backend.onrender.com`). You need this for Vercel.

---

## Step 3: Deploy Frontend (Vercel)

1.  **Create Account/Login**: Go to [vercel.com](https://vercel.com).
2.  **Add New Project**:
    -   Click **Add New...** -> **Project**.
    -   Import your `Sentient_Ai` Git repository.
3.  **Configure Project**:
    -   **Framework Preset**: Vite (should be auto-detected).
    -   **Root Directory**: Click "Edit" and select `frontend`.
4.  **Environment Variables**:
    -   `VITE_API_URL`: Paste your Render Backend URL (e.g., `https://sentiment-chatbot-backend.onrender.com`). **Important**: Do NOT add a trailing slash `/`.
5.  **Deploy**: Click **Deploy**.

---

## Step 4: Finalize Connectivity

1.  **Get Frontend URL**: Copy your new Vercel URL (e.g., `https://sentient-ai.vercel.app`).
2.  **Update Backend CORS**:
    -   Go back to **Render** -> **Web Service** -> **Environment**.
    -   Edit `CORS_ORIGINS` to match your Vercel URL (e.g., `https://sentient-ai.vercel.app`).
    -   Save.

**Done!** Your app is now fully deployed with persistent storage and a global CDN.
