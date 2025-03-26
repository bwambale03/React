'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchDestinations, submitBooking } from '../utils/api';
import { motion } from 'framer-motion';
import { z } from 'zod';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  date: z.string().nonempty('Please select a date'),
  destination: z.string().nonempty('Please select a destination'),
  activities: z.array(z.string()).min(1, 'Select at least one activity'),
});

const BookingSystem = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    date: '',
    destination: '',
    activities: [],
  });
  const [destinations, setDestinations] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  useEffect(() => {
    fetchDestinations()
      .then((data) => setDestinations(data))
      .catch(() => setErrors({ fetch: 'Failed to load destinations.' }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        activities: checked
          ? [...prev.activities, value]
          : prev.activities.filter((act) => act !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form data
      bookingSchema.parse(formData);

      // Submit to Firebase via API
      const result = await submitBooking(formData);
      setBookingConfirmed(result.booking);
      setFormData({ name: '', email: '', date: '', destination: '', activities: [] });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(err.flatten().fieldErrors);
      } else {
        setErrors({ submit: err.message || 'Booking failed. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center text-gray-900 mb-8"
        >
          Book Your Adventure
        </motion.h2>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          {errors.fetch && <p className="text-red-500">{errors.fetch}</p>}
          {errors.submit && <p className="text-red-500">{errors.submit}</p>}

          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isSubmitting}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          <div>
            <select
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isSubmitting}
            >
              <option value="">Select Destination</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.name}>
                  {dest.name}
                </option>
              ))}
            </select>
            {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Activities</label>
            <div className="space-y-2">
              {['Hiking', 'Wildlife Safari', 'Cultural Tour'].map((activity) => (
                <label key={activity} className="flex items-center">
                  <input
                    type="checkbox"
                    name="activities"
                    value={activity}
                    checked={formData.activities.includes(activity)}
                    onChange={handleChange}
                    className="mr-2 accent-blue-600"
                    disabled={isSubmitting}
                  />
                  {activity}
                </label>
              ))}
            </div>
            {errors.activities && <p className="text-red-500 text-sm mt-1">{errors.activities}</p>}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-300"
          >
            {isSubmitting ? 'Booking...' : 'Book Now'}
          </motion.button>
        </form>

        {bookingConfirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h3>
              <p className="text-gray-700 mb-4">
                Your trip to <strong>{bookingConfirmed.destination}</strong> on{' '}
                <strong>{bookingConfirmed.date}</strong> is booked (ID: {bookingConfirmed.id}).
              </p>
              <p className="text-gray-600 mb-6">
                <strong>Next Steps:</strong>
                <ul className="list-disc list-inside">
                  <li>Check your email for confirmation and payment instructions.</li>
                  <li>
                    Plan your itinerary with our{' '}
                    <a href="/itinerary" className="text-blue-600 hover:underline">
                      trip planner
                    </a>
                    .
                  </li>
                  <li>Contact support at <a href="mailto:support@rwenzoris.com" className="text-blue-600 hover:underline">support@rwenzoris.com</a>.</li>
                </ul>
              </p>
              <button
                onClick={() => setBookingConfirmed(null)}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BookingSystem;