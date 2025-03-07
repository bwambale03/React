from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

# Define db here
db = SQLAlchemy()

# Association tables
trip_destinations = db.Table('trip_destinations',
    db.Column('trip_id', db.Integer, db.ForeignKey('trip.id'), primary_key=True),
    db.Column('destination_id', db.Integer, db.ForeignKey('destination.id'), primary_key=True)
)

user_badges = db.Table('user_badges',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('badge_id', db.Integer, db.ForeignKey('badge.id'), primary_key=True)
)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)    
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    profile_picture = db.Column(db.String(255))
    reviews = db.relationship('Review', back_populates='reviewer', lazy=True)  # Fix here
    
    bio = db.Column(db.Text)
    avatar_url = db.Column(db.String(255))
    trips = db.relationship('Trip', backref='user', lazy=True)
    badges = db.relationship('Badge', secondary=user_badges, backref='users')

    
    @staticmethod
    def get_stats():
        total_users = User.query.count()
        total_reviews = Review.query.count()
        total_trips = Trip.query.count()
        return {
            "happy_travelers": total_users,
            "reviews_written": total_reviews,
            "trips_planned": total_trips
        }
        
    def __repr__(self):
        
        return f'<User {self.username}>'

class Destination(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    rating = db.Column(db.Float, default=0.0)
    category = db.Column(db.String(50))
    location = db.Column(db.String(100))
    best_time = db.Column(db.String(50))
    ar_model = db.Column(db.String(255))
    reviews = db.relationship('Review', backref='destination', lazy=True)

    def __repr__(self):
        return f'<Destination {self.name}>'

class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    preferences = db.Column(db.JSON, default=list)
    destinations = db.relationship('Destination', secondary=trip_destinations, backref='trips')

    def __repr__(self):
        return f'<Trip {self.name}>'

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    reviewer = db.relationship('User', back_populates='reviews')  # Fix here

    def __repr__(self):
        return f'<Review {self.id}>'
    
class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    def __repr__(self):
        return super().__repr__()

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    likes = db.relationship('User', secondary='post_likes', backref='liked_posts')
    hashtags = db.Column(db.JSON, default='list')
    comments = db.relationship('Comment', backref='post', lazy=True)
    
    def __repr__(self):
        return super().__repr__()

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)

    post_likes = db.Table('post_likes',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('post_id', db.Integer, db.ForeignKey('post.id'), primary_key=True)
    )
    def __repr__(self):
        return super().__repr__()

class Subscriber(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    date_subscribed = db.Column(db.DateTime, default=datetime.utcnow)
    def __repr__(self):
        return f'<Subscriber {self.email}>'
    
    
class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    date_sent = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return super().__repr__()
    
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Event {self.name}>'
    
class UserDeal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # e.g., pending, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='deals')
    event = db.relationship('Event', backref='user_deals')

    def __repr__(self):
        return f'<UserDeal {self.id} for {self.event.name}>'