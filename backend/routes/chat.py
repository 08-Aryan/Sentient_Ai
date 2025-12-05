from flask import Blueprint, request, jsonify
from datetime import datetime, timezone, time
from extensions import db
from models import ChatSession, Message
from utils.decorators import token_required

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/check-limit', methods=['GET'])
@token_required
def check_limit(current_user):
    today = datetime.now(timezone.utc).date()
    start_of_day = datetime.combine(today, time.min)
    
    session_count = ChatSession.query.filter(
        ChatSession.user_id == current_user.id,
        ChatSession.created_at >= start_of_day
    ).count()

    print(f"User {current_user.id} has {session_count} sessions today ({today}).")
    remaining = 20 - session_count
    return jsonify({'remaining': remaining, 'limit': 20})

@chat_bp.route('/start', methods=['POST'])
@token_required
def start_chat(current_user):
    # Check daily limit
    today = datetime.now(timezone.utc).date()
    start_of_day = datetime.combine(today, time.min)
    session_count = ChatSession.query.filter(
        ChatSession.user_id == current_user.id,
        ChatSession.created_at >= start_of_day
    ).count()

    if session_count >= 20:
        return jsonify({'error': 'Daily limit reached'}), 403

    new_session = ChatSession(
        user_id=current_user.id,
        title="New Chat",
        total_messages=0,
        average_score=0.0,
        overall_mood='Neutral',
        trend='Stable'
    )
    db.session.add(new_session)
    db.session.commit()
    
    return jsonify({'session_id': new_session.id, 'message': 'Session started'})

@chat_bp.route('/message', methods=['POST'])
@token_required
def save_message(current_user):
    data = request.get_json()
    session_id = data.get('session_id')
    role = data.get('role')
    content = data.get('content')
    sentiment = data.get('sentiment') # Optional dict {score, label}

    if not session_id or not role or not content:
        return jsonify({'error': 'Missing required fields'}), 400

    session = ChatSession.query.get_or_404(session_id)
    if session.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    # Check session message limit
    if session.total_messages >= 250:
        return jsonify({'error': 'Session message limit reached'}), 403

    # Save message
    new_message = Message(
        session_id=session_id,
        role=role,
        content=content,
        sentiment_score=sentiment.get('score') if sentiment else None,
        sentiment_label=sentiment.get('label') if sentiment else None
    )
    db.session.add(new_message)
    
    # Update session stats
    session.total_messages += 1
    session.updated_at = datetime.now(timezone.utc)
    
    # Update title if it's the first user message
    if role == 'user' and session.total_messages <= 2:
        # Simple title generation: first few words
        session.title = ' '.join(content.split()[:5])

    db.session.commit()
    
    return jsonify({'message': 'Message saved', 'id': new_message.id})

@chat_bp.route('/end', methods=['POST'])
@token_required
def end_chat(current_user):
    # This endpoint is now primarily for updating final stats if needed, 
    # but real-time saving makes it less critical for data persistence.
    # We can use it to update the summary_data blob or final stats.
    data = request.get_json()
    session_id = data.get('session_id') # Expect session_id now
    
    if not session_id:
         # Fallback for old frontend behavior (creating new session on end)
         # But we want to enforce real-time. Let's assume frontend is updated.
         # If frontend sends full payload without session_id, we might create one, but let's stick to new plan.
         return jsonify({'message': 'Session updated'}), 200

    session = ChatSession.query.get(session_id)
    if session and session.user_id == current_user.id:
        session.average_score = data.get('averageScore', session.average_score)
        session.overall_mood = data.get('overallMood', session.overall_mood)
        session.trend = data.get('trend', session.trend)
        session.summary_data = str(data) # Update summary blob
        db.session.commit()
        return jsonify({'message': 'Session finalized'})
    
    return jsonify({'error': 'Session not found'}), 404

@chat_bp.route('/history', methods=['GET'])
@token_required
def get_history(current_user):
    sessions = ChatSession.query.filter_by(user_id=current_user.id)\
        .order_by(ChatSession.created_at.desc())\
        .limit(100)\
        .all()
    
    return jsonify([s.to_dict() for s in sessions])

@chat_bp.route('/session/<int:session_id>', methods=['GET'])
@token_required
def get_session_messages(current_user, session_id):
    session = ChatSession.query.get_or_404(session_id)
    
    if session.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    messages = Message.query.filter_by(session_id=session_id).order_by(Message.timestamp.asc()).all()
    
    return jsonify({
        'session': session.to_dict(),
        'messages': [m.to_dict() for m in messages]
    })
