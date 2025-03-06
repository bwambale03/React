from flask_restful import Resource, reqparse, abort
from core.models import db, User
from flask_login import login_user, current_user
from werkzeug.security import generate_password_hash

# Parser for user registration
user_parser = reqparse.RequestParser()
user_parser.add_argument('username', type=str, required=True, help='Username is required')
user_parser.add_argument('email', type=str, required=True, help='Email is required')
user_parser.add_argument('password', type=str, required=True, help='Password is required')

class UserRegister(Resource):
    """API resource for registering new users."""

    def post(self):
        """Register a new user."""
        args = user_parser.parse_args()

        # Check for existing user
        if User.query.filter_by(username=args['username']).first():
            abort(400, message='Username already taken')
        if User.query.filter_by(email=args['email']).first():
            abort(400, message='Email already registered')

        # Create new user
        user = User(
            username=args['username'],
            email=args['email'],
            password_hash=generate_password_hash(args['password'])
        )
        db.session.add(user)
        db.session.commit()

        # Log in the new user
        login_user(user)
        return {'message': 'User registered successfully', 'id': user.id}, 201

class UserProfile(Resource):
    """API resource for user profile data."""

    def get(self, id):
        """Retrieve a user's profile."""
        user = User.query.get_or_404(id)
        trips = [{
            'id': trip.id,
            'name': trip.name,
            'start_date': trip.start_date.isoformat(),
            'end_date': trip.end_date.isoformat(),
            'destinations': [d.name for d in trip.destinations]
        } for trip in user.trips]
        badges = [{'name': b.name, 'description': b.description} for b in user.badges]

        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'bio': user.bio,
            'avatar_url': user.avatar_url,
            'trips': trips,
            'badges': badges
        }, 200

