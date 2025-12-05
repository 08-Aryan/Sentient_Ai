import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev_secret_key_change_this')
    basedir = os.path.abspath(os.path.dirname(__file__))
    # Go up one level from 'backend' to get to project root, then into 'instance'
    # Assuming the structure is:
    # project_root/
    #   backend/config.py
    #   instance/chatbot.db
    project_root = os.path.dirname(basedir)
    
    # Use absolute path for DB
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f'sqlite:///{os.path.join(project_root, "instance", "chatbot.db")}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = os.getenv('FLASK_ENV') == 'production'
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    ARTIFACT_PATH = os.path.join(basedir, os.getenv('ARTIFACT_PATH', 'sentiment_analysis_artifacts.joblib'))
