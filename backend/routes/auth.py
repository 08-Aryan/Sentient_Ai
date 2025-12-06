from flask import Blueprint, request, jsonify, make_response, current_app
import jwt
import datetime
from extensions import db, bcrypt
from models import User
from utils.decorators import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password_hash=hashed_password)
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Registration failed'}), 500

    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")

        response = make_response(jsonify({'message': 'Login successful', 'username': user.username}))
        response.set_cookie(
            'auth_token',
            token,
            httponly=True,
            secure=current_app.config['SESSION_COOKIE_SECURE'],
            samesite=current_app.config['SESSION_COOKIE_SAMESITE']
        )
        return response
    
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'message': 'Logged out'}))
    response.set_cookie('auth_token', '', expires=0)
    return response

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({'username': current_user.username, 'id': current_user.id})
