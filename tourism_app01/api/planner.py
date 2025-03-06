from flask_restful import Resource, reqparse, abort
from core.models import db, Trip, Destination, User
from flask_login import login_required, current_user
from datetime import datetime, timedelta

# Parser for trip creation
planner_parser = reqparse.RequestParser()
planner_parser.add_argument('trip_name', type=str, required=True, help='Trip name is required')
planner_parser.add_argument('start_date', type=str, required=True, help='Start date is required')
planner_parser.add_argument('end_date', type=str, required=True, help='End date is required')
planner_parser.add_argument('destinations', type=int, action='append', help='List of destination IDs')
planner_parser.add_argument('preferences', type=str, action='append', help='List of preferences')

class TripPlanner(Resource):
    """API resource for creating trips."""

    @login_required
    def post(self):
        """Create a new trip."""
        args = planner_parser.parse_args()

        # Validate dates
        try:
            start_date = datetime.fromisoformat(args['start_date'])
            end_date = datetime.fromisoformat(args['end_date'])
            if start_date >= end_date:
                abort(400, message='End date must be after start date')
        except ValueError:
            abort(400, message='Invalid date format. Use YYYY-MM-DD')

        # Validate destinations
        if not args['destinations']:
            abort(400, message='At least one destination is required')
        destinations = Destination.query.filter(Destination.id.in_(args['destinations'])).all()
        if len(destinations) != len(args['destinations']):
            abort(400, message='One or more destination IDs are invalid')

        # Create trip
        trip = Trip(
            name=args['trip_name'],
            start_date=start_date,
            end_date=end_date,
            user_id=current_user.id,
            preferences=args['preferences'] or []
        )
        trip.destinations.extend(destinations)
        db.session.add(trip)
        db.session.commit()

        return {'message': 'Trip created successfully', 'trip_id': trip.id}, 201

class TripDetail(Resource):
    """API resource for trip details."""

    @login_required
    def get(self, trip_id):
        """Retrieve a specific trip."""
        trip = Trip.query.get_or_404(trip_id)
        if trip.user_id != current_user.id:
            abort(403, message='You can only view your own trips')

        # Generate basic itinerary (could be enhanced with services/recommender.py)
        itinerary = [{
            'day': i + 1,
            'date': (trip.start_date + timedelta(days=i)).isoformat(),
            'destination': dest.name,
            'activity': 'Explore ' + dest.name  # Placeholder logic
        } for i, dest in enumerate(trip.destinations)]

        return {
            'id': trip.id,
            'name': trip.name,
            'start_date': trip.start_date.isoformat(),
            'end_date': trip.end_date.isoformat(),
            'destinations': [{'id': d.id, 'name': d.name} for d in trip.destinations],
            'preferences': trip.preferences,
            'itinerary': itinerary
        }, 200