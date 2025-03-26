// Reviews.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import { submitReview } from '../utils/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ 
    rating: 5, 
    comment: '', 
    user: '' 
  });

  useEffect(() => {
    // Instantiate socket inside useEffect to ensure single connection
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Socket event listeners
    socket.on('connect', () => console.log('Connected to Socket.IO server'));
    socket.on('connect_error', (err) => console.error('Connection error:', err.message));
    socket.on('newReview', (review) => {
      setReviews(prev => {
        const current = Array.isArray(prev) ? prev : [];
        return [review, ...current.filter(r => r.id !== review.id)];
      });
    });
    socket.on('newBlogPost', (data) => console.log('New blog post:', data));

    // Fetch initial reviews
    // Reviews.js (snippet of fetchReviews)
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server responded with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.warn('Reviews response is not an array:', data);
          setReviews([]);
        } else {
          setReviews(data);
        }
      } catch (err) {
        console.error('Fetch error details:', err);
        setError(`Failed to load reviews: ${err.message}`);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('newReview');
      socket.off('newBlogPost');
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitReview(newReview);
      setNewReview({ rating: 5, comment: '', user: '' });
    } catch (error) {
      console.error('Review submission error:', error);
      setError('Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    const stars = Math.max(0, Math.min(5, rating));
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center text-gray-900 mb-8"
        >
          Traveler Reviews & Ratings
        </motion.h2>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Your Name</label>
            <input
              type="text"
              value={newReview.user}
              onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Rating</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Review
          </button>
        </form>

        {loading ? (
          <p className="text-center text-gray-500">Loading reviews...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review.id || Math.random()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">{renderStars(review.rating)}</span>
                  <span className="ml-2 text-gray-700">{review.rating}/5</span>
                </div>
                <p className="text-gray-700">{review.comment || 'No comment provided'}</p>
                <p className="text-sm text-gray-500 mt-2">- {review.user || 'Anonymous'}</p>
                {review.createdAt && (
                  <p className="text-sm text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
