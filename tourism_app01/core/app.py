from flask import Flask, render_template
from flask_migrate import Migrate
from flask_login import LoginManager
from core.config import Config
from core.models import db, Destination, Event  # Import db, Destination, and Event from models
from api import init_api

migrate = Migrate()
login_manager = LoginManager()

def create_app():
    """Factory function to create and configure the Flask app."""
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    app.config.from_object(Config)

    # Initialize extensions with the app
    db.init_app(app)
    with app.app_context():
        db.create_all()  # Moved here to ensure tables are created
        if not Destination.query.first():
            db.session.add(Destination(name="Paris", description="City of Love", image_url="https://source.unsplash.com/800x600/?paris", rating=4.5, category="City", location="France", best_time="Spring"))
            db.session.add(Destination(name="Tokyo", description="City of Lights"))
            db.session.commit()
            
        # seed events
        if not Event.query.first():
            from datetime import datetime, timedelta
            db.session.add(Event(
                name="Spring Getaway Sale",
                description="50% off trips to Paris!",
                expires_at=datetime.utcnow() + timedelta(days=3)
            ))
            db.session.add(Event(
                name="Tokyo Festival Discount",
                description="Book now for 30% off!",
                expires_at=datetime.utcnow() + timedelta(hours=12)
            ))
            db.session.commit()
            
    migrate.init_app(app, db)
    login_manager.init_app(app)
    login_manager.login_view = 'routes.login'

    # Register blueprints
    from core.routes import init_routes
    init_routes(app)
    init_api(app)

    # User loader for Flask-Login
    @login_manager.user_loader
    def load_user(user_id):
        from core.models import User  # Import here to avoid circular import
        return User.query.get(int(user_id))

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=Config.DEBUG)