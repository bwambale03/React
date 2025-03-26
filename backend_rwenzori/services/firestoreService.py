# services/firestoreService.py
from firebaseConfig import db  # Import db from config
from google.cloud import firestore  # Import firestore
import datetime

# Reviews
def get_reviews():
    reviews_ref = db.collection('reviews').order_by('createdAt', direction=firestore.Query.DESCENDING)
    docs = reviews_ref.stream()
    return [{'id': doc.id, **doc.to_dict()} for doc in docs] if docs else []

def add_review(review_data):
    review_data['createdAt'] = datetime.datetime.now().isoformat()
    doc_ref = db.collection('reviews').document()
    doc_ref.set(review_data)
    return {'id': doc_ref.id, **review_data}

def delete_review(review_id):
    doc_ref = db.collection('reviews').document(review_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise ValueError('Review not found')
    doc_ref.delete()

# Blog Posts
def get_blog_posts():
    posts_ref = db.collection('blogPosts').order_by('createdAt', direction=firestore.Query.DESCENDING)
    docs = posts_ref.stream()
    return [{'id': doc.id, **doc.to_dict()} for doc in docs] if docs else []

def add_blog_post(post_data):
    post_data['createdAt'] = datetime.datetime.now().isoformat()
    doc_ref = db.collection('blogPosts').document()
    doc_ref.set(post_data)
    return {'id': doc_ref.id, **post_data}

def delete_blog_post(post_id):
    doc_ref = db.collection('blogPosts').document(post_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise ValueError('Blog post not found')
    doc_ref.delete()

# Add more functions as needed (e.g., users, comments, likes, etc.)
