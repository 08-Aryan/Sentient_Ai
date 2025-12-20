import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    if os.getenv('FLASK_ENV') == 'production' and not SECRET_KEY:
         raise ValueError("No SECRET_KEY set for production environment")
    SECRET_KEY = SECRET_KEY or 'dev_secret_key_local_fallback'
    
    basedir = os.path.abspath(os.path.dirname(__file__))
    # Go up one level from 'backend' to get to project root, then into 'instance'
    project_root = os.path.dirname(basedir)
    
    # Database URL: Handle Render's "postgres://" (deprecated in SQLAlchemy) -> "postgresql://"
    # Priority: DATABASE_URL env var -> Local Postgres Fallback (if desired) -> SQLite
    _db_url = os.getenv('DATABASE_URL')
    
    # If no env var, you might want to default to a local postgres for development if installed:
    # _db_url = _db_url or "postgresql://localhost/chatbot" 
    
    if _db_url and _db_url.startswith("postgres://"):
        _db_url = _db_url.replace("postgres://", "postgresql://", 1)
    
    # Default to SQLite if no header provided
    SQLALCHEMY_DATABASE_URI = _db_url or f'sqlite:///{os.path.join(basedir, "instance", "chatbot.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = os.getenv('SQLALCHEMY_ECHO', 'False').lower() == 'true' # Useful for local debugging
    
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = os.getenv('FLASK_ENV') == 'production'
    SESSION_COOKIE_SAMESITE = 'None' if os.getenv('FLASK_ENV') == 'production' else 'Lax'
    
    ARTIFACT_PATH = os.path.join(basedir, os.getenv('ARTIFACT_PATH', 'sentiment_analysis_artifacts.joblib'))

    # Constants
    DAILY_SESSION_LIMIT = 20
    SESSION_MESSAGE_LIMIT = 250
