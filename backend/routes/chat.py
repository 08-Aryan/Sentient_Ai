from flask import Blueprint, request, jsonify
from utils.decorators import token_required
from services.chat_service import ChatService

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/check-limit', methods=['GET'])
@token_required
def check_limit(current_user):
    session_count = ChatService.get_daily_session_count(current_user.id)
    remaining = 20 - session_count
    return jsonify({'remaining': remaining, 'limit': 20})

@chat_bp.route('/start', methods=['POST'])
@token_required
def start_chat(current_user):
    session_count = ChatService.get_daily_session_count(current_user.id)

    if session_count >= 20:
        return jsonify({'error': 'Daily limit reached'}), 403

    new_session = ChatService.create_session(current_user.id)
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

    session = ChatService.get_session(session_id, current_user.id)
    if not session:
        return jsonify({'error': 'Unauthorized or Session not found'}), 403

    # Check session message limit
    if session.total_messages >= 250:
        return jsonify({'error': 'Session message limit reached'}), 403

    try:
        new_message = ChatService.save_message(session, role, content, sentiment)
        return jsonify({'message': 'Message saved', 'id': new_message.id})
    except Exception as e:
        return jsonify({'error': 'Failed to save message'}), 500

@chat_bp.route('/end', methods=['POST'])
@token_required
def end_chat(current_user):
    data = request.get_json()
    session_id = data.get('session_id')
    
    if not session_id:
         return jsonify({'message': 'Session updated'}), 200

    session = ChatService.get_session(session_id, current_user.id)
    if session:
        ChatService.update_session_stats(session, data)
        return jsonify({'message': 'Session finalized'})
    
    return jsonify({'error': 'Session not found'}), 404

@chat_bp.route('/history', methods=['GET'])
@token_required
def get_history(current_user):
    sessions = ChatService.get_user_history(current_user.id)
    return jsonify([s.to_dict() for s in sessions])

@chat_bp.route('/session/<int:session_id>', methods=['GET'])
@token_required
def get_session_messages(current_user, session_id):
    session = ChatService.get_session(session_id, current_user.id)
    
    if not session:
        return jsonify({'error': 'Unauthorized'}), 403
        
    messages = ChatService.get_session_messages(session_id)
    
    return jsonify({
        'session': session.to_dict(),
        'messages': [m.to_dict() for m in messages]
    })
