const BASE_URL = 'http://localhost:5000/api'; // Adjust for production

export const fetchDestinations = async () => {
  const response = await fetch(`${BASE_URL}/destinations`);
  if (!response.ok) throw new Error('Failed to fetch destinations');
  return response.json();
};

export const fetchReviews = async () => {
  const response = await fetch(`${BASE_URL}/reviews`);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
};

export const fetchBlogPosts = async () => {
  const response = await fetch(`${BASE_URL}/blogPosts`);
  if (!response.ok) throw new Error('Failed to fetch blog posts');
  return response.json();
};

export const submitBooking = async (bookingData) => {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Booking failed');
  }
  return response.json();
};

export const submitReview = async (reviewData) => {
  const response = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Review submission failed');
  }
  return response.json();
};
