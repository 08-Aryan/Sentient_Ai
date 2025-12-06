from flask import Blueprint, request, jsonify
from datetime import datetime, timezone, time
from services.sentiment import sentiment_service
from utils.decorators import token_required
from models import ChatSession

main_bp = Blueprint('main', __name__)

@main_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'online', 'model_loaded': sentiment_service.model is not None})

@main_bp.route('/predict', methods=['POST'])
@token_required
def predict(current_user):
    # Check daily limit first
    today = datetime.now(timezone.utc).date()
    start_of_day = datetime.combine(today, time.min)
    session_count = ChatSession.query.filter(
        ChatSession.user_id == current_user.id,
        ChatSession.created_at >= start_of_day
    ).count()

    # Soft check, frontend handles blocking mostly
    if session_count >= 20:
        return jsonify({'error': 'Daily limit reached'}), 403

    try:
        data = request.get_json()
        text_input = data.get('text') or data.get('review')

        if not text_input:
            return jsonify({'error': 'No text provided.'}), 400

        response = sentiment_service.predict(text_input)
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
