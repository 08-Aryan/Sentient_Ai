import pytest
from config import Config

def login(client, username, password):
    return client.post('/auth/login', json={
        'username': username,
        'password': password
    })

def test_daily_session_limit(client, db):
    # Register/Login
    username = 'limituser'
    password = 'pw'
    client.post('/auth/register', json={'username': username, 'password': password})
    login(client, username, password)
    
    # Create 20 sessions (Config.DAILY_SESSION_LIMIT)
    for i in range(Config.DAILY_SESSION_LIMIT):
        response = client.post('/chat/start')
        assert response.status_code == 200, f"Failed at iteration {i}"
        
    # Attempt 21st session
    response = client.post('/chat/start')
    assert response.status_code == 403
    assert response.json['error'] == 'Daily limit reached'

def test_session_message_limit(client, db):
    # Register/Login
    username = 'msguser'
    password = 'pw'
    client.post('/auth/register', json={'username': username, 'password': password})
    login(client, username, password)
    
    # Start Session
    start_res = client.post('/chat/start')
    session_id = start_res.json['session_id']
    
    # Hack: Manually update the session count in DB to 250 to save time
    from models import ChatSession
    session = ChatSession.query.get(session_id)
    session.total_messages = Config.SESSION_MESSAGE_LIMIT
    db.session.commit()
    
    # Try sending one more
    response = client.post('/chat/message', json={
        'session_id': session_id,
        'role': 'user',
        'content': 'One too many'
    })
    
    assert response.status_code == 403
    assert response.json['error'] == 'Session message limit reached'
