from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, jsonify, abort
from flask_login import login_required, current_user, login_user, logout_user
from core.models import db, User, Destination, Trip, Review, Post, Comment, Subscriber, Event, UserDeal
from core import utils
from werkzeug.security import check_password_hash
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField, SelectField, FileField
from wtforms.validators import DataRequired, Email, Length
from services.weather import get_weather_for_destination
from services.ar_tools import enhance_ar_experience
from services.recommender import get_recommendations
from services.maptiler import get_maptiler_coordinates, get_maptiler_static_map  # Only this import
from flask_mail import Mail, Message
from datetime import datetime

# Define blueprint for routes
bp = Blueprint('routes', __name__)

# Forms (unchanged)
class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')

class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=80)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    submit = SubmitField('Sign Up')

class ReviewForm(FlaskForm):
    rating = SelectField('Rating', choices=[(i, f'{i} ★') for i in range(1, 6)], validators=[DataRequired()])
    comment = TextAreaField('Comment', validators=[DataRequired()])
    submit = SubmitField('Submit Review')

class PostForm(FlaskForm):
    content = TextAreaField('Content', validators=[DataRequired()], render_kw={"placeholder": "Share your thoughts... Use #hashtags to categorize your post!"})
    image = FileField('Image')
    submit = SubmitField('Post')

class CommentForm(FlaskForm):
    content = StringField('Content', validators=[DataRequired()])
    submit = SubmitField('Send')
mail = Mail()

def init_routes(app):
    """Register routes blueprint with the app."""
    mail.init_app(app)
    if 'routes' not in app.blueprints:
        app.register_blueprint(bp)

@bp.route('/')
def index():
    featured_trips = Destination.query.order_by(Destination.rating.desc()).limit(3).all()
    testimonials = Review.query.join(User).limit(5).all()
    active_events = Event.query.filter(Event.expires_at > datetime.utcnow()).all()
    stats = User.get_stats()
    return render_template('index.html', featured_trips=featured_trips, testimonials=testimonials, active_events=active_events, stats=stats)

@bp.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and check_password_hash(user.password_hash, form.password.data):
            login_user(user)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('routes.index'))
        flash('Invalid email or password', 'danger')
    return render_template('auth/login.html', form=form)

@bp.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        return redirect(url_for('api.UserRegister'))
    return render_template('auth/register.html', form=form)

@bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('routes.index'))

@bp.route('/destinations')
def destinations():
    page = request.args.get('page', 1, type=int)
    per_page = 10
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    sort = request.args.get('sort', 'name')

    query = Destination.query
    if search:
        query = query.filter(Destination.name.ilike(f'%{search}%'))
    if category:
        query = query.filter_by(category=category)
    if sort == 'rating':
        query = query.order_by(Destination.rating.desc())
    else:
        query = query.order_by(Destination.name.asc())

    destinations = query.paginate(page=page, per_page=per_page)
    return render_template('destinations/list.html', destinations=destinations)

@bp.route('/destinations/<int:id>')
def destination_detail(id):
    destination = Destination.query.get_or_404(id)
    weather = get_weather_for_destination(destination)
    coords = get_maptiler_coordinates(destination.location)  # Use services.maptiler
    lat, lon = coords if coords else (None, None)
    static_map_url = get_maptiler_static_map(lat, lon) if lat and lon else None
    form = ReviewForm()
    return render_template('destinations/detail.html', destination=destination, review_form=form, weather=weather, lat=lat, lon=lon, static_map_url=static_map_url)

@bp.route('/destinations/<int:destination_id>/review', methods=['POST'])
@login_required
def add_review(destination_id):
    form = ReviewForm()
    if form.validate_on_submit():
        review = Review(
            user_id=current_user.id,
            destination_id=destination_id,
            rating=int(form.rating.data),
            comment=form.comment.data
        )
        db.session.add(review)
        db.session.commit()
        flash('Review added!', 'success')
    return redirect(url_for('routes.destination_detail', id=destination_id))

@bp.route('/planner', methods=['GET', 'POST'])
@login_required
def planner():
    form = FlaskForm()
    available_destinations = Destination.query.all()
    recommendations = get_recommendations(current_user.preferences if hasattr(current_user, 'preferences') else ['adventure'])
    return render_template('planner/wizard.html', form=form, available_destinations=available_destinations, recommendations=recommendations)

@bp.route('/planner/<int:trip_id>')
@login_required
def itinerary(trip_id):
    trip = Trip.query.get_or_404(trip_id)
    if trip.user_id != current_user.id:
        flash('Unauthorized access', 'danger')
        return redirect(url_for('routes.index'))
    itinerary = utils.generate_itinerary(trip)
    return render_template('planner/itinerary.html', trip=trip, itinerary=itinerary)

# Feed Route to Filter by Hashtag
@bp.route('/social/feed', methods=['GET', 'POST'])
def social_feed():
    form = PostForm()
    if form.validate_on_submit() and current_user.is_authenticated:
        # Extract hashtags from the post content
        hashtags = [word.lower() for word in form.content.data.split() if word.startswith('#')]
        
        # Save the post with hashtags
        image_path = utils.process_image(form.image.data) if form.image.data else None
        post = Post(
            user_id=current_user.id,
            content=form.content.data,
            hashtags=hashtags,  # Add hashtags to the post
            image_url=image_path
        )
        db.session.add(post)
        db.session.commit()
        flash('Posted!', 'success')
        return redirect(url_for('routes.social_feed'))

    # Filter posts by hashtag if a search query is provided
    search = request.args.get('search', '').strip()
    query = Post.query

    if search.startswith('#'):  # Filter by hashtag
        hashtag = search.replace('#', '').lower()
        query = query.filter(Post.hashtags.contains([hashtag]))

    posts = query.order_by(Post.date_posted.desc()).all()
    comment_form = CommentForm()
    return render_template('social/feed.html', posts=posts, post_form=form, comment_form=comment_form)
@bp.route('/social/feed/<int:post_id>/comment', methods=['POST'])
@login_required
def add_comment(post_id):
    form = CommentForm()
    if form.validate_on_submit():
        comment = Comment(user_id=current_user.id, post_id=post_id, content=form.content.data)
        db.session.add(comment)
        db.session.commit()
    return redirect(url_for('routes.social_feed'))

@bp.route('/profile/<int:id>')
def profile(id):
    user = User.query.get_or_404(id)
    return render_template('social/profile.html', user=user)

@bp.route('/ar_experience/<int:destination_id>')
def ar_experience(destination_id):
    destination = Destination.query.get_or_404(destination_id)
    ar_data = enhance_ar_experience(destination)
    return render_template('ar_experience.html', destination=destination, ar_data=ar_data)

@bp.route('/destination/<location>')
def destination(location):
    """Fetch and display coordinates for a given location using MapTiler."""
    coords = get_maptiler_coordinates(location)  # Use services.maptiler
    if coords:
        latitude, longitude = coords
        static_map_url = get_maptiler_static_map(latitude, longitude)
        return render_template('destination.html', location=location, latitude=latitude, longitude=longitude, static_map_url=static_map_url)
    else:
        flash(f"Failed to fetch coordinates for {location}.", 'danger')
        return redirect(url_for('routes.index')), 400
@bp.route('/newsletter', methods=['POST'])
def newsletter():
    email = request.form.get('email')
    if not email:
        return jsonify({'success': False, 'message': 'Email is required!'}), 400
    if Subscriber.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'You’re already subscribed!'}), 400

    try:
        subscriber = Subscriber(email=email)
        db.session.add(subscriber)
        db.session.commit()
        # TODO: Add email sending logic here (e.g., welcome email)
        # Send a welcome email
        msg = Message('Welcome to TravelBlog!', recipients=[email])
        msg.html = render_template('email/welcome.html', email=email)
        mail.send(msg)

        return jsonify({'success': True, 'message': 'Subscribed successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Oops! Something went wrong.'}), 500

@bp.route('/newsletter/unsubscribe', methods=['POST'])
def unsubscribe():
    email = request.form.get('email')
    subscriber = Subscriber.query.filter_by(email=email).first()
    if subscriber:
        db.session.delete(subscriber)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Unsubscribed successfully!'}), 200
    else:
        return jsonify({'success': False, 'message': 'Email not found!'}), 404
    
@bp.route('/newsletter/send', methods=['POST'])
def send_newsletter():
    subscribers = Subscriber.query.all()
    for subscriber in subscribers:
        msg = Message('TravelBlog Newsletter', recipients=[subscriber.email])
        msg.html = render_template('email/newsletter.html', subscribers=subscribers)
        mail.send(msg)
    return jsonify({'success': True, 'message': 'Newsletter sent successfully!'}), 200

@bp.route('/api/destinations')
def get_destinations():
    destinations = Destination.query.limit(10).all()
    return jsonify([{
        "name": dest.name,
        "coordinates": [dest.longitude, dest.latitude]  # Ensure these fields exist in your model
    } for dest in destinations])
    
    
# adding a route  to handle search queries for autocomplete
@bp.route('/api/search')
def search_destinations():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify([])

    destinations = Destination.query.filter(Destination.name.ilike(f'%{query}%')).limit(10).all()
    return jsonify([{
        "id": dest.id,
        "name": dest.name
    } for dest in destinations])

@bp.route('/api/testimonials')
def get_testimonials():
    testimonials = Review.query.join(User).limit(5).all()
    return jsonify([{
        "user": review.user.username,
        "comment": review.comment,
        "destination": review.destination.name
    } for review in testimonials])
    
# route to fecth trending hashtags
from collections import Counter


@bp.route('/api/trending-hashtags')
def trending_hashtags():
    # Fetch all posts and extract hashtags
    posts = Post.query.all()
    hashtags = []
    for post in posts:
        if post.hashtags and post.hashtags != 'list':  # Check for valid hashtags string
            hashtags.extend(post.hashtags.split())  # Split string into list
    if not hashtags:
        return jsonify([])  # Return empty list if no hashtags, no 'z'
    # Count and sort hashtags by frequency
    trending = Counter(hashtags).most_common(10)  # Top 10 hashtags
    return jsonify([{"hashtag": tag, "count": count} for tag, count in trending])

'''
    Deal Processing Routes 
'''
@bp.route('/grab-deal/<int:event_id>')
@login_required
def grab_deal(event_id):
    """Redirects to confirmation page after selecting a deal."""
    event = Event.query.get_or_404(event_id)
    if event.expires_at < datetime.utcnow():
        flash('This deal has expired!', 'danger')
        return redirect(url_for('routes.index'))
    
    # Create a new UserDeal entry
    user_deal = UserDeal(user_id=current_user.id, event_id=event_id, status='pending')
    db.session.add(user_deal)
    db.session.commit()
    return redirect(url_for('routes.deal_confirm', deal_id=user_deal.id))

@bp.route('/deal-confirm/<int:deal_id>')
@login_required
def deal_confirm(deal_id):
    """Displays deal details and payment option."""
    user_deal = UserDeal.query.get_or_404(deal_id)
    event = Event.query.get_or_404(user_deal.event_id)
    if user_deal.user_id != current_user.id or user_deal.status != 'pending':
        flash('Invalid deal request!', 'danger')
        return redirect(url_for('routes.index'))
    return render_template('deal_confirm.html', event=event, user_deal=user_deal)

@bp.route('/deal-payment/<int:deal_id>', methods=['GET', 'POST'])
@login_required
def deal_payment(deal_id):
    """Handles payment (mock for now, can integrate API later)."""
    user_deal = UserDeal.query.get_or_404(deal_id)
    event = Event.query.get_or_404(user_deal.event_id)
    if user_deal.user_id != current_user.id or user_deal.status != 'pending':
        flash('Invalid deal request!', 'danger')
        return redirect(url_for('routes.index'))

    if request.method == 'POST':
        # Mock payment processing
        card_number = request.form.get('card-number')
        expiry = request.form.get('expiry')
        cvv = request.form.get('cvv')
        if card_number and expiry and cvv:  # Basic validation
            user_deal.status = 'completed'
            db.session.commit()
            flash('Payment processed successfully!', 'success')
            return redirect(url_for('routes.deal_success', deal_id=deal_id))
        flash('Invalid payment details!', 'danger')

    return render_template('deal_payment.html', event=event, user_deal=user_deal)

@bp.route('/deal-success/<int:deal_id>')
@login_required
def deal_success(deal_id):
    """Shows success page after payment."""
    user_deal = UserDeal.query.get_or_404(deal_id)
    event = Event.query.get_or_404(user_deal.event_id)
    if user_deal.user_id != current_user.id or user_deal.status != 'completed':
        flash('Invalid deal status!', 'danger')
        return redirect(url_for('routes.index'))
    return render_template('deal_success.html', event=event, user_deal=user_deal)

'''
    Deal Processing Routes end here 
'''

import random

@bp.route('/spin-globe')
def spin_globe():
    destinations = Destination.query.filter_by(location="Uganda").all()
    if not destinations:
        return jsonify({"error": "No Ugandan destinations available"})
    random_dest = random.choice(destinations)
    return jsonify({
        "id": random_dest.id,
        "name": random_dest.name,
        "image_url": random_dest.image_url or url_for('static', filename='imgs/destinations/hero.jpg'),
        "description": random_dest.description,
        "best_time": random_dest.best_time or "Anytime",
        "rating": float(random_dest.rating) if random_dest.rating else "Not rated yet",
        "category": random_dest.category or "General",
        "location": random_dest.location
    })

import requests
@bp.route('/destination_detail_dynamic/<int:id>')
def destination_detail_dynamic(id):
    # Try to get the destination from the DB
    destination = Destination.query.get(id)
    if not destination:
        # If not in DB, fetch dynamically from an API
        try:
            # Using OpenTripMap API to get Ugandan destination details
            api_key = "YOUR_OPENTRIPMAP_API_KEY"  # Get your free API key from OpenTripMap
            url = f"https://api.opentripmap.com/0.1/en/places/geoname?name=Uganda&country=UG&apikey={api_key}"
            response = requests.get(url).json()
            
            # Check if API returned valid data
            if "error" in response or not response.get("name"):
                abort(404, description="Destination not found via API.")
            
            # Mock a destination object with API data
            destination = Destination(
                id=id,
                name=response.get("name", "Unknown"),
                description=f"Explore {response.get('name', 'a place')} in Uganda.",
                image_url=f"https://source.unsplash.com/800x600/?{response.get('name', 'uganda')}",
                location="Uganda",
                best_time="Anytime",
                rating=4.0,  # Placeholder
                category="Cultural"
            )
        except Exception as e:
            abort(404, description=f"Failed to fetch destination: {str(e)}")

    return render_template('destination_detail.html', destination=destination)


@bp.route('/travel-quiz', methods=['GET', 'POST'])
def travel_quiz():
    # Sample quiz questions about Uganda
    quiz_data = [
        {
            "question": "What is the capital city of Uganda?",
            "options": ["Nairobi", "Kampala", "Dar es Salaam", "Entebbe"],
            "correct_answer": "Kampala"
        },
        {
            "question": "Which river is known as the source of the Nile in Uganda?",
            "options": ["Congo River", "White Nile", "Blue Nile", "Zambezi River"],
            "correct_answer": "White Nile"
        },
        {
            "question": "What is the official language of Uganda?",
            "options": ["Swahili", "English", "French", "Luganda"],
            "correct_answer": "English"
        }
    ]

    if request.method == 'POST':
        user_answer = request.json.get('answer')
        current_question = request.json.get('question')
        correct_answer = next(q["correct_answer"] for q in quiz_data if q["question"] == current_question)
        return jsonify({"correct": user_answer == correct_answer, "message": "Correct!" if user_answer == correct_answer else "Try again!"})

    # For GET, return a random question
    question = random.choice(quiz_data)
    return jsonify({"question": question["question"], "options": question["options"]})

@bp.route('/news')
def news():
    # Sample news data about Ugandan species and attractions
    news_data = [
        {
            "id": 1,
            "title": "Mountain Gorillas in Bwindi",
            "image_url": "https://source.unsplash.com/800x600/?gorilla,uganda",
            "snippet": "Bwindi Impenetrable National Park hosts half the world’s mountain gorillas...",
            "details": "Bwindi Impenetrable National Park, a UNESCO site, is home to over 400 mountain gorillas. Trek through dense forests to witness these gentle giants in their natural habitat. The park also boasts 348 bird species and 120 mammals, making it a biodiversity hotspot."
        },
        {
            "id": 2,
            "title": "Murchison Falls Spectacle",
            "image_url": "https://source.unsplash.com/800x600/?waterfall,uganda",
            "snippet": "Murchison Falls National Park features the Nile River rushing through a narrow gorge...",
            "details": "Murchison Falls National Park, Uganda’s largest, showcases the Nile River squeezing through a 7-meter gorge to create the stunning Murchison Falls. Enjoy boat rides for birdwatching (451 species) and spot wildlife like hippos, crocodiles, and elephants across 76 mammal species."
        },
        {
            "id": 3,
            "title": "Birdwatching at Lake Bunyonyi",
            "image_url": "https://source.unsplash.com/800x600/?lake,bird,uganda",
            "snippet": "Lake Bunyonyi, Uganda’s deepest lake, is a birdwatcher’s paradise...",
            "details": "Lake Bunyonyi in southwestern Uganda is a serene spot for birdwatching, hosting species like herons, egrets, and grey crowned cranes. With 20 islands to explore by wooden boat, it’s also a safe swimming destination amidst stunning landscapes."
        }
    ]
    return jsonify(news_data)

@bp.route('/news/<int:id>')
def news_detail(id):
    # Sample news data (could be from a DB in a real app)
    news_data = [
        {
            "id": 1,
            "title": "Mountain Gorillas in Bwindi",
            "image_url": "https://source.unsplash.com/800x600/?gorilla,uganda",
            "snippet": "Bwindi Impenetrable National Park hosts half the world’s mountain gorillas...",
            "details": "Bwindi Impenetrable National Park, a UNESCO site, is home to over 400 mountain gorillas. Trek through dense forests to witness these gentle giants in their natural habitat. The park also boasts 348 bird species and 120 mammals, making it a biodiversity hotspot."
        },
        {
            "id": 2,
            "title": "Murchison Falls Spectacle",
            "image_url": "https://source.unsplash.com/800x600/?waterfall,uganda",
            "snippet": "Murchison Falls National Park features the Nile River rushing through a narrow gorge...",
            "details": "Murchison Falls National Park, Uganda’s largest, showcases the Nile River squeezing through a 7-meter gorge to create the stunning Murchison Falls. Enjoy boat rides for birdwatching (451 species) and spot wildlife like hippos, crocodiles, and elephants across 76 mammal species."
        },
        {
            "id": 3,
            "title": "Birdwatching at Lake Bunyonyi",
            "image_url": "https://source.unsplash.com/800x600/?lake,bird,uganda",
            "snippet": "Lake Bunyonyi, Uganda’s deepest lake, is a birdwatcher’s paradise...",
            "details": "Lake Bunyonyi in southwestern Uganda is a serene spot for birdwatching, hosting species like herons, egrets, and grey crowned cranes. With 20 islands to explore by wooden boat, it’s also a safe swimming destination amidst stunning landscapes."
        }
    ]
    
    news_item = next((item for item in news_data if item["id"] == id), None)
    if not news_item:
        abort(404, description="News item not found.")
    
    return render_template('news_detail.html', news=news_item)

@bp.route('/send-message', methods=['POST'])
def send_message():
    data = request.form
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    # Basic validation
    if not all([name, email, message]):
        return jsonify({"success": False, "message": "All fields are required!"}), 400

    # In a real app, you'd save to DB or send an email here
    # For now, just log the message
    print(f"Message from {name} ({email}): {message}")

    return jsonify({"success": True, "message": "Message sent successfully!"})