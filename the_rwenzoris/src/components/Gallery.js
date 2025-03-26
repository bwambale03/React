'use client';

import Image from 'next/image';

export default function Gallery() {
    const images = [
      { id: 1, src: '/public/testimonials/user1.png', alt: 'Mountain View' },
      { id: 2, src: '/public/testimonials/user1.png', alt: 'Beach Sunset' },
      { id: 3, src: '/public/testimonials/user1.png', alt: 'Cityscape' },
      { id: 4, src: '/public/testimonials/user1.png', alt: 'Forest Trail' },
    ];
  
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 animate-fade-in">
            Explore Our Destinations
          </h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="mb-4 break-inside-avoid">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={64}
                  height={64}
                  className="w-full rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
