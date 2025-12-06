from datetime import datetime, timezone, time
from extensions import db
from models import ChatSession, Message

class ChatService:
    @staticmethod
    def get_daily_session_count(user_id):
        today = datetime.now(timezone.utc).date()
        start_of_day = datetime.combine(today, time.min)
        return ChatSession.query.filter(
            ChatSession.user_id == user_id,
            ChatSession.created_at >= start_of_day
        ).count()

    @staticmethod
    def create_session(user_id):
        try:
            new_session = ChatSession(
                user_id=user_id,
                title="New Chat",
                total_messages=0,
                average_score=0.0,
                overall_mood='Neutral',
                trend='Stable'
            )
            db.session.add(new_session)
            db.session.commit()
            return new_session
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def get_session(session_id, user_id):
        session = ChatSession.query.get(session_id)
        if session and session.user_id == user_id:
            return session
        return None

    @staticmethod
    def save_message(session, role, content, sentiment=None):
        new_message = Message(
            session_id=session.id,
            role=role,
            content=content,
            sentiment_score=sentiment.get('score') if sentiment else None,
            sentiment_label=sentiment.get('label') if sentiment else None
        )
        db.session.add(new_message)
        
        # Update stats
        session.total_messages += 1
        session.updated_at = datetime.now(timezone.utc)
        
        # Update title if it's the first user message
        if role == 'user' and session.total_messages <= 2:
            session.title = ' '.join(content.split()[:5])

        try:
            db.session.commit()
            return new_message
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def update_session_stats(session, data):
        session.average_score = data.get('averageScore', session.average_score)
        session.overall_mood = data.get('overallMood', session.overall_mood)
        session.trend = data.get('trend', session.trend)
        session.summary_data = str(data)
        db.session.commit()

    @staticmethod
    def get_user_history(user_id, limit=100):
        return ChatSession.query.filter_by(user_id=user_id)\
            .order_by(ChatSession.created_at.desc())\
            .limit(limit)\
            .all()

    @staticmethod
    def get_session_messages(session_id):
        return Message.query.filter_by(session_id=session_id).order_by(Message.timestamp.asc()).all()
