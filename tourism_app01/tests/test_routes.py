import pytest
from core.app import create_app
from core.models import db, User
from flask_login import login_user

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"
    })
    with app.app_context():
        db.create_all()
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

def test_index(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"WanderLuxe" in response.data

def test_planner_login_required(client):
    response = client.get('/planner')
    assert response.status_code == 302  # Redirect to login
    assert '/login' in response.location

def test_login_post(client):
    user = User(username="testuser", email="test@example.com", password_hash="hashed")
    with client.application.app_context():
        db.session.add(user)
        db.session.commit()
    response = client.post('/login', data={"email": "test@example.com", "password": "hashed"})
    assert response.status_code == 302  # Should redirect after login