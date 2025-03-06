from flask_restful import Resource, reqparse, abort
from core.models import db, Destination
from flask import jsonify

# Request parser for filtering destinations
destination_parser = reqparse.RequestParser()
destination_parser.add_argument('search', type=str, help='Search by name')
destination_parser.add_argument('category', type=str, help='Filter by category')
destination_parser.add_argument('sort', type=str, default='name', help='Sort by field')

class DestinationList(Resource):
    """API resource for listing destinations."""

    def get(self):
        """Retrieve a list of destinations with optional filtering."""
        args = destination_parser.parse_args()
        query = Destination.query

        # Apply filters
        if args['search']:
            query = query.filter(Destination.name.ilike(f"%{args['search']}%"))
        if args['category']:
            query = query.filter(Destination.category == args['category'])

        # Apply sorting
        if args['sort'] == 'rating':
            query = query.order_by(Destination.rating.desc())
        else:
            query = query.order_by(Destination.name)

        # Pagination (assuming 10 per page)
        page = reqparse.RequestParser().add_argument('page', type=int, default=1).parse_args()['page']
        per_page = 10
        paginated = query.paginate(page=page, per_page=per_page)

        # Serialize response
        return {
            'destinations': [{
                'id': dest.id,
                'name': dest.name,
                'description': dest.description,
                'image_url': dest.image_url,
                'rating': dest.rating,
                'category': dest.category
            } for dest in paginated.items],
            'total': paginated.total,
            'pages': paginated.pages,
            'page': paginated.page
        }, 200

class DestinationDetail(Resource):
    """API resource for a single destination."""

    def get(self, id):
        """Retrieve details of a specific destination."""
        destination = Destination.query.get_or_404(id)
        reviews = [{
            'user_id': review.user_id,
            'username': review.user.username,
            'rating': review.rating,
            'comment': review.comment,
            'date_posted': review.date_posted.isoformat()
        } for review in destination.reviews]

        return {
            'id': destination.id,
            'name': destination.name,
            'description': destination.description,
            'image_url': destination.image_url,
            'rating': destination.rating,
            'category': destination.category,
            'location': destination.location,
            'best_time': destination.best_time,
            'reviews': reviews
        }, 200

