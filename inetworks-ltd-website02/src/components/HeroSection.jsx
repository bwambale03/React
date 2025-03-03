import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/HeroSection.css';

const HeroSection = () => {
  const [count, setCount] = useState({ clients: 0, projects: 0 });

  useEffect(() => {
    const animateCounter = () => {
      setCount({ clients: 150, projects: 300 });
    };
    const timer = setTimeout(animateCounter, 500);
    return () => clearTimeout(timer);
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section className="hero">
      <div className="hero-bg">
        <video autoPlay muted loop className="hero-video">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>
      <motion.div
        className="hero-content"
        initial="hidden"
        animate="visible"
        variants={textVariants}
      >
        <h1>Empowering Your Digital Future</h1>
        <p>We provide cutting-edge IT solutions tailored to your business needs.</p>
        <div className="hero-actions">
          <Link to="/contact">
            <motion.button
              className="cta-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
          <Link to="/services">
            <motion.button
              className="cta-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Services
            </motion.button>
          </Link>
        </div>
      </motion.div>
      <div className="hero-stats">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <h3>{count.clients}+</h3>
          <p>Satisfied Clients</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <h3>{count.projects}+</h3>
          <p>Projects Completed</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;