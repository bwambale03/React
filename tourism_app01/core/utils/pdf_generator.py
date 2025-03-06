import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from flask import current_app

def generate_itinerary_pdf(trip, itinerary):
    """Generate a PDF for a trip itinerary."""
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], f'itinerary_{trip.id}.pdf')
    doc = SimpleDocTemplate(filepath, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph(f"Trip: {trip.name}", styles['Title']))
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"Dates: {trip.start_date} to {trip.end_date}", styles['Normal']))
    story.append(Spacer(1, 12))

    for day in itinerary:
        story.append(Paragraph(f"Day {day['day']}: {day['date']}", styles['Heading2']))
        story.append(Paragraph(f"{day['destination']} - {day['activity']}", styles['Normal']))
        story.append(Spacer(1, 12))

    doc.build(story)
    return filepath

def generate_itinerary(trip):
    """Generate a simple itinerary list (used in routes)."""
    from datetime import timedelta
    days = (trip.end_date - trip.start_date).days + 1
    return [{
        'day': i + 1,
        'date': trip.start_date + timedelta(days=i),
        'destination': trip.destinations[i % len(trip.destinations)],
        'activity': f"Explore {trip.destinations[i % len(trip.destinations)].name}",
        'weather_forecast': "Sunny"  # Placeholder, integrate services/weather.py later
    } for i in range(days)]
