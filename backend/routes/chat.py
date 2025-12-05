from flask import Blueprint, request, jsonify
from datetime import datetime, timezone, time
from extensions import db
from models import ChatSession
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

    remaining = 10 - session_count
    return jsonify({'remaining': remaining, 'limit': 10})

@chat_bp.route('/end', methods=['POST'])
@token_required
def end_chat(current_user):
    data = request.get_json()
    
    new_session = ChatSession(
        user_id=current_user.id,
        total_messages=data.get('totalMessages', 0),
        average_score=data.get('averageScore', 0.0),
        overall_mood=data.get('overallMood', 'Neutral'),
        trend=data.get('trend', 'Stable'),
        summary_data=str(data)
    )
    db.session.add(new_session)
    db.session.commit()
    
    return jsonify({'message': 'Session saved'})

@chat_bp.route('/history', methods=['GET']) # Note: Changed from /user/history to /chat/history or keep /user/history? 
# Plan said /user/history but logic is chat related. Let's keep it under chat blueprint for now or create user blueprint.
# Actually, let's put it here but map it to /user/history in app.py or just change frontend to /chat/history?
# Let's stick to the plan which had /user/history in app.py. 
# But wait, I am making modules. Let's put it in a 'user' blueprint or just 'chat' blueprint.
# I will put it in 'chat' blueprint but the route will be /history, so /chat/history.
# I need to update frontend if I change URL.
# Or I can register this blueprint at /user for this route? No, that's messy.
# Let's create a separate user.py blueprint? Or just put it in auth.py (which is user related)?
# Let's put it in chat.py and change frontend to /chat/history. It makes more sense.
@token_required
def get_history(current_user):
    sessions = ChatSession.query.filter_by(user_id=current_user.id)\
        .order_by(ChatSession.created_at.desc())\
        .limit(100)\
        .all()
    
    return jsonify([s.to_dict() for s in sessions])
