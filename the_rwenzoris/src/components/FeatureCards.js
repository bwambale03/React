'use client';

import { useEffect, useState } from 'react';

export default function FeatureCards() {
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState(null);

  // Simulated API call for features (replace with real data if available)
  useEffect(() => {
    try {
      const fetchedFeatures = [
        { id: 1, title: 'Curated Trips', desc: 'Handpicked destinations for your next adventure.', icon: '✈️' },
        { id: 2, title: 'Real-Time Maps', desc: 'Explore destinations with interactive maps.', icon: '🗺️' },
        { id: 3, title: 'AI Planner', desc: 'Let AI craft your perfect itinerary.', icon: '🤖' },
      ];
      setFeatures(fetchedFeatures);
    } catch (err) {
      setError('Failed to load features. Please try again later.');
    }
  }, []);

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 animate-fade-in">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
