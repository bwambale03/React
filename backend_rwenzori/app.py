# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS     
from services.firestoreService import get_reviews, add_review, delete_review
from services.firestoreService import get_blog_posts, add_blog_post, delete_blog_post
from services.firestoreService import db
import socketio
import eventlet
import jwt
from functools import wraps
from firebase_admin import auth
import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
sio = socketio.Server(cors_allowed_origins='http://localhost:3000', async_mode='eventlet', 
                      ping_timeout=60, 
                      ping_interval=25,
                      max_buffer_size=1000000)  # 10MB max buffer size
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

"""
    route catches all undefined paths and returns a 404 JSON
    response, directing users to http://localhost:3000 for frontend routes

    Returns:
        _type_: _description_
"""
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return jsonify({'error': 'Route not found', 'message': 'for frontend routes, use http://localhost:3000'}), 404

@sio.event
def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
def disconnect(sid):
    print(f"Client disconnected: {sid}")
# redirect 
# Auth middleware
def verify_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        try:
            token = token.split('Bearer ')[1]
            decoded = auth.verify_id_token(token)
            request.user = decoded
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Invalid or expired token', 'details': str(e)}), 401
    return decorated_function

def admin_required(f):
    @wraps(f)
    @verify_token
    def decorated_function(*args, **kwargs):
        uid = request.user['uid']
        user_doc = db.collection('users').document(uid).get()
        if not user_doc.exists or user_doc.to_dict().get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route('/api/reviews', methods=['GET'])
def handle_get_reviews():
    try:
        reviews = get_reviews()
        return jsonify(reviews), 200
    except Exception as e:
        print(f"Fetch reviews error: {e}")
        return jsonify({'error': 'Failed to fetch reviews', 'details': str(e)}), 500

@app.route('/api/reviews', methods=['POST'])
@verify_token  # Optional: restrict to authenticated users
def handle_add_review():
    try:
        review_data = request.get_json()
        if not review_data or not isinstance(review_data, dict):
            return jsonify({'error': 'Review data is required and must be an object'}), 400
        new_review = add_review(review_data)
        sio.emit('newReview', new_review)
        return jsonify(new_review), 201
    except Exception as e:
        print(f"Add review error: {e}")
        return jsonify({'error': 'Failed to add review', 'details': str(e)}), 500

@app.route('/api/reviews/<review_id>', methods=['DELETE'])
@admin_required
def handle_delete_review(review_id):
    try:
        delete_review(review_id)
        return jsonify({'message': 'Review deleted'}), 204
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        print(f"Delete review error: {e}")
        return jsonify({'error': 'Failed to delete review', 'details': str(e)}), 500

@app.route('/api/blogPosts', methods=['GET'])
def handle_get_blog_posts():
    try:
        posts = get_blog_posts()
        return jsonify(posts), 200
    except Exception as e:
        print(f"Fetch blog posts error: {e}")
        return jsonify({'error': 'Failed to fetch blog posts', 'details': str(e)}), 500

@app.route('/api/blogPosts', methods=['POST'])
@verify_token  # Optional
def handle_add_blog_post():
    try:
        post_data = request.get_json()
        if not post_data or not isinstance(post_data, dict):
            return jsonify({'error': 'Blog post data is required and must be an object'}), 400
        new_post = add_blog_post(post_data)
        sio.emit('newBlogPost', new_post)
        return jsonify(new_post), 201
    except Exception as e:
        print(f"Add blog post error: {e}")
        return jsonify({'error': 'Failed to add blog post', 'details': str(e)}), 500

@app.route('/api/blogPosts/<post_id>', methods=['DELETE'])
@admin_required
def handle_delete_blog_post(post_id):
    try:
        delete_blog_post(post_id)
        return jsonify({'message': 'Blog post deleted'}), 204
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        print(f"Delete blog post error: {e}")
        return jsonify({'error': 'Failed to delete blog post', 'details': str(e)}), 500

@app.route('/api/auth/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data or 'name' not in data:
            return jsonify({'error': 'Email, password, and name are required'}), 400
        user = auth.create_user(
            email=data['email'],
            password=data['password'],
            display_name=data['name']
        )
        db.collection('users').document(user.uid).set({
            'email': user.email,
            'name': user.display_name,
            'role': 'user',
            'createdAt': datetime.datetime.now().isoformat()
        })
        return jsonify({'uid': user.uid, 'email': user.email, 'name': user.display_name}), 201
    except auth.EmailAlreadyExistsError:
        return jsonify({'error': 'Email already exists'}), 409
    except Exception as e:
        print(f"Register error: {e}")
        return jsonify({'error': 'Failed to register', 'details': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password are required'}), 400
        # Firebase Admin SDK can't verify passwords directly; rely on client-side auth
        # This endpoint could fetch user data or validate custom logic
        user = auth.get_user_by_email(data['email'])
        return jsonify({'uid': user.uid, 'email': user.email, 'name': user.display_name}), 200
    except auth.UserNotFoundError:
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Failed to login', 'details': str(e)}), 500

@app.route('/api/destinations', methods=['GET'])
def handle_get_destinations():
    try:
        destinations = db.collection('destinations').stream()
        data = [doc.to_dict() for doc in destinations]
        return jsonify(data), 200
    except Exception as e:
        print(f"Fetch destinations error: {e}")
        return jsonify({'error': 'Failed to fetch destinations', 'details': str(e)}), 500

@app.route('/api/destinations', methods=['POST'])
@verify_token
def handle_add_destination():
    try:
        dest_data = request.get_json()
        if not dest_data or not isinstance(dest_data, dict):
            return jsonify({'error': 'Destination data is required and must be an object'}), 400
        new_dest = db.collection('destinations').add(dest_data)
        dest_data['id'] = new_dest[1].id
        sio.emit('newDestination', dest_data)
        return jsonify(dest_data), 201
    except Exception as e:
        print(f"Add destination error: {e}")
        return jsonify({'error': 'Failed to add destination', 'details': str(e)}), 500

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('0.0.0.0', 5000)), app)