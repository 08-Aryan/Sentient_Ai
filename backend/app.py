import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from extensions import db, bcrypt
from routes.auth import auth_bp
from routes.chat import chat_bp
from routes.main import main_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize Extensions
    # Load allowed origins from env, default to localhost
    allowed_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
    CORS(app, supports_credentials=True, origins=allowed_origins)
    
    db.init_app(app)
    bcrypt.init_app(app)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(chat_bp, url_prefix='/chat')
    app.register_blueprint(main_bp) # /health, /predict at root

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    # Create Tables
    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5001, debug=True)
