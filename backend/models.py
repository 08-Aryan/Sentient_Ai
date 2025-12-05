from extensions import db
from datetime import datetime, timezone

# db = SQLAlchemy() # Removed, imported from extensions

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    sessions = db.relationship('ChatSession', backref='user', lazy=True)

class ChatSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Summary Statistics
    total_messages = db.Column(db.Integer, default=0)
    average_score = db.Column(db.Float, default=0.0)
    overall_mood = db.Column(db.String(20))
    trend = db.Column(db.String(20))
    
    # Store raw stats JSON if needed for detailed charts later
    # For SQLite, we can store as Text (JSON string)
    summary_data = db.Column(db.Text, nullable=True) 

    def to_dict(self):
        return {
            'id': self.id,
            'created_at': self.created_at.isoformat(),
            'total_messages': self.total_messages,
            'average_score': self.average_score,
            'overall_mood': self.overall_mood,
            'trend': self.trend,
            'summary_data': self.summary_data
        }
