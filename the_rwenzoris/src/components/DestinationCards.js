// DestinationCards.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

const DestinationCards = () => {
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Socket.IO setup inside useEffect for single instantiation
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'], // WebSocket first, polling fallback
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Socket event listeners
    socket.on('connect', () => console.log('Connected to Socket.IO server (DestinationCards)'));
    socket.on('connect_error', (err) => console.error('Connection error (DestinationCards):', err.message));
    socket.on('newDestination', (destination) => {
      setDestinations((prev) => (
        Array.isArray(prev) ? [destination, ...prev.filter((d) => d.id !== destination.id)] : [destination]
      ));
    });

    // Fetch destinations
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/destinations', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // For auth if needed
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server responded with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.warn('Destinations response is not an array:', data);
          setDestinations([]);
        } else {
          setDestinations(data);
        }
      } catch (err) {
        console.error('Fetch destinations error:', err);
        setError(`Failed to load destinations: ${err.message}`);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('newDestination');
      socket.disconnect();
    };
  }, []); // Empty array ensures single run on mount

  // Loading state
  if (loading) {
    return (
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-700">Loading destinations...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (destinations.length === 0) {
    return (
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-700">No destinations available yet.</p>
        </div>
      </section>
    );
  }

  // Main render
  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-900 mb-8"
        >
          Explore Destinations
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <motion.div
              key={destination.id || Math.random()} // Fallback for missing id
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <Image
                src={destination.image || 'https://via.placeholder.com/500x192'}
                alt={destination.name || 'Destination'}
                width={500}
                height={192}
                className="w-full h-48 object-cover"
                priority={true} // Preload first few images
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {destination.name || 'Unnamed Destination'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {destination.description?.slice(0, 100) + '...' || 'No description available.'}
                </p>
                <Link
                  href={`/destinations/${destination.id}` || '#'}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Learn More
                </Link>
                {destination.location && (
                  <p className="text-gray-500 text-sm mt-2">Location: {destination.location}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationCards;
