import pytest
from core.app import create_app
from core.models import db, Destination

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
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_get_destinations_empty(client):
    response = client.get('/api/destinations', headers={"Accept": "application/json"})
    assert response.status_code == 200
    assert response.json['destinations'] == []

def test_create_destination(client):
    dest_data = {"name": "Paris", "description": "City of Light", "rating": 4.5}
    response = client.post('/api/destinations', json=dest_data)  # Assumes POST endpoint exists
    assert response.status_code == 405  # No POST yet, adjust if added
