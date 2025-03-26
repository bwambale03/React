'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion'; // For smooth animations
import { useRouter } from 'next/navigation'; // For navigation on button click

const HeroSection = () => {
  const router = useRouter();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Fallback image if video fails
  const fallbackImage = '/images/hero-bg.jpg';

  // Animation variants for Framer Motion
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    // Simulate video loading check (replace with real logic if using a hosted video)
    const timer = setTimeout(() => setIsVideoLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleExploreClick = () => {
    router.push('/destinations'); // Navigate to destinations page
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background: Video with fallback to Image */}
      <div className="absolute inset-0">
        {isVideoLoaded && !error ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={() => setError('Video failed to load')}
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={fallbackImage}
            alt="Rwenzori Mountains Hero Background"
            fill
            className="object-cover"
            priority
            onError={() => setError('Image failed to load')}
          />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
        {/* Animated Title */}
        <motion.h1
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white drop-shadow-2xl tracking-tight"
        >
          Welcome to Rwenzori
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl md:text-2xl text-white/90 mt-4 mb-8 max-w-3xl mx-auto"
        >
          Discover the breathtaking beauty of the Mountains of the Moon
        </motion.p>

        {/* Interactive Button */}
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onClick={handleExploreClick}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-300"
          aria-label="Explore Rwenzori destinations"
        >
          Explore Now
        </motion.button>

        {/* Error Message (if any) */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 mt-4 text-sm"
          >
            {error}. Please try refreshing the page.
          </motion.p>
        )}

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.5 } }}
          className="absolute bottom-10"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
