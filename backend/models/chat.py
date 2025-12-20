from extensions import db
from datetime import datetime, timezone

class ChatSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Session Metadata
    title = db.Column(db.String(100), nullable=True)

    # Summary Statistics
    total_messages = db.Column(db.Integer, default=0)
    average_score = db.Column(db.Float, default=0.0)
    overall_mood = db.Column(db.String(20), default='Neutral')
    trend = db.Column(db.String(20), default='Stable')
    
    # Updated: Store raw stats JSON using JSON type (works with Postgres)
    # SQLAlchemy's JSON type maps to TEXT in SQLite automatically if needed, 
    # but uses native JSON/JSONB in Postgres.
    summary_data = db.Column(db.JSON, nullable=True) 
    
    messages = db.relationship('Message', backref='session', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat() if self.updated_at else self.created_at.isoformat(),
            'title': self.title,
            'total_messages': self.total_messages,
            'average_score': self.average_score,
            'overall_mood': self.overall_mood,
            'trend': self.trend,
            'summary_data': self.summary_data
        }

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('chat_session.id'), nullable=False)
    role = db.Column(db.String(10), nullable=False) # 'user' or 'bot'
    content = db.Column(db.Text, nullable=False)
    sentiment_score = db.Column(db.Float, nullable=True)
    sentiment_label = db.Column(db.String(20), nullable=True)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'role': self.role,
            'content': self.content,
            'sentiment': {
                'score': self.sentiment_score,
                'label': self.sentiment_label
            } if self.sentiment_score is not None else None,
            'timestamp': self.timestamp.isoformat()
        }

class ResponseTemplate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    overall_mood = db.Column(db.String(20), nullable=False) # e.g., 'Positive', 'Negative', 'Neutral'
    user_sentiment = db.Column(db.String(20), nullable=False) # e.g., 'Positive', 'Negative', 'Neutral'
    content = db.Column(db.Text, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'overall_mood': self.overall_mood,
            'user_sentiment': self.user_sentiment,
            'content': self.content
        }
