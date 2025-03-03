import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext'; // Assuming you have this
import '../styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode, setDarkMode } = useContext(ThemeContext); // Theme toggle
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const menuVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo">
        <Link to="/">
          <img src={darkMode ? "/logo-dark.svg" : "/logo-light.svg"} alt="iNetworks Ltd Logo" className="logo-img" />
        </Link>
      </div>

      <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate={isMenuOpen ? 'open' : 'closed'}
          className="nav-links"
        >
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <div className="dropdown">
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>About ▼</Link>
            <div className="dropdown-content">
              <Link to="/about/team">Our Team</Link>
              <Link to="/about/mission">Mission</Link>
            </div>
          </div>
          <Link to="/services" onClick={() => setIsMenuOpen(false)}>Services</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        </motion.div>
      </nav>

      <div className="header-actions">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            aria-label="Search site"
          />
          <button type="submit" aria-label="Submit search">🔍</button>
        </form>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <div className="menu-icon" onClick={toggleMenu} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
