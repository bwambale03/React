'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Jane Doe',
      text: 'This website made planning my trip to the Rwenzoris a breeze!',
      avatar: '/public/testimonials/user1.png' // Fixed dimensions in URL
    },
    {
      id: 2,
      name: 'John Smith',
      text: 'The interactive map and AI planner are game-changers.',
      avatar: '/public/testimonials/user1.png'
    },
    {
      id: 3,
      name: 'Emily Brown',
      text: 'Loved the curated destinations and real-time weather updates!',
      avatar: '/public/testimonials/user1.png'
    },
  ];

  const [current, setCurrent] = useState(0);

  const nextTestimonial = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 bg-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 animate-fade-in">
          What Our Travelers Say
        </h2>
        <div className="relative">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Image
              src={testimonials[current].avatar}
              alt={testimonials[current].name}
              width={64}
              height={64}
              className="rounded-full mx-auto mb-4"
            />
            <p className="text-gray-700 italic mb-4">&quot;{testimonials[current].text}&quot;</p>
            <h3 className="text-lg font-semibold text-gray-900">{testimonials[current].name}</h3>
          </div>
          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            ←
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}