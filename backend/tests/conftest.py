import pytest
import os
from app import create_app
from extensions import db as _db
from models import User

@pytest.fixture(scope='module')
def app():
    # Use SQLite in-memory for testing
    test_config = {
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SECRET_KEY': 'test_secret_key'
    }
    
    app = create_app(test_config)

    with app.app_context():
        _db.create_all()
        yield app
        _db.session.remove()
        _db.drop_all()

@pytest.fixture(scope='module')
def client(app):
    return app.test_client()

@pytest.fixture(scope='function')
def db(app):
    with app.app_context():
        # Start a transaction for each test
        connection = _db.engine.connect()
        transaction = connection.begin()
        
        # Bind the session to the connection
        _db.session.bind = connection
        
        yield _db
        
        # Rollback after test
        _db.session.remove()
        transaction.rollback()
        connection.close()

@pytest.fixture(scope='function')
def auth_header(client, db):
    # Helper to create a user and get token
    user = User(username='testuser', password_hash='hashed_pw')
    db.session.add(user)
    db.session.commit()
    
    # We cheat and mock the token or just login to get cookie
    # But since our app uses cookies, we use the client to login
    # Actually, we need to register first or just insert user.
    # The login endpoint sets the cookie.
    return user
