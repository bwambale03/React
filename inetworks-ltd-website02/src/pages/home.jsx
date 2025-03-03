import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCode, FaMobileAlt, FaDesktop, FaQuoteLeft } from 'react-icons/fa';
import HeroSection from '../components/HeroSection';
import ServiceCard from '../components/ServiceCard';
import './Home.css';

const home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    { quote: "Transformed our business with stunning tech!", author: "Jane Doe, CEO" },
    { quote: "Best IT solutions ever!", author: "John Smith, CTO" },
    { quote: "Highly recommend their services!", author: "Alice Brown, Manager" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <section className="services-section">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Our Services
        </motion.h2>
        <div className="services-grid">
          <ServiceCard
            title="Web Development"
            description="Custom websites with cutting-edge tech."
            icon={<FaCode />}
            link="/services/web-development"
          />
          <ServiceCard
            title="Mobile Development"
            description="Robust apps for iOS and Android."
            icon={<FaMobileAlt />}
            link="/services/mobile-development"
          />
          <ServiceCard
            title="Desktop Development"
            description="Powerful desktop solutions for all platforms."
            icon={<FaDesktop />}
            link="/services/desktop-development"
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Clients Say</h2>
        <motion.div
          className="testimonial-carousel"
          key={activeTestimonial}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <FaQuoteLeft className="quote-icon" />
          <p>{testimonials[activeTestimonial].quote}</p>
          <span className="testimonial-author">{testimonials[activeTestimonial].author}</span>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <h2>Ready to Transform Your Business?</h2>
          <Link to="/contact">
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us Now
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};
export default home;