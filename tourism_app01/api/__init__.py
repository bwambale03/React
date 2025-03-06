from flask import Blueprint
from flask_restful import Api

# Define the API blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Initialize Flask-RESTful API
api = Api(api_bp)

# Import and register resources
from .destinations import DestinationList, DestinationDetail
from .users import UserRegister, UserProfile
from .planner import TripPlanner, TripDetail

api.add_resource(DestinationList, '/destinations')
api.add_resource(DestinationDetail, '/destinations/<int:id>')
api.add_resource(UserRegister, '/users/register')
api.add_resource(UserProfile, '/users/<int:id>')
api.add_resource(TripPlanner, '/planner')
api.add_resource(TripDetail, '/planner/<int:trip_id>')

def init_api(app):
    """Register the API blueprint with the Flask app."""
    app.register_blueprint(api_bp)