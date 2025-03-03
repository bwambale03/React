import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaRocket,
  FaChartLine,
  FaHistory,
  FaDownload,
  FaTwitter,
  FaChevronLeft,
  FaChevronRight,
  FaAward,
} from 'react-icons/fa';
import './About.css';

const useCounter = (end, duration) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 1000); // Microsecond steps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 1); // 1ms interval for microsecond feel
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
};

const About = () => {
  const [activeTeam, setActiveTeam] = useState(0);
  const [activeMilestone, setActiveMilestone] = useState(null);
  const employees = useCounter(75, 3);
  const years = useCounter(10, 3);
  const projects = useCounter(500, 3);
  const clients = useCounter(200, 3);
  const stats = { employees, years, projects, clients };

  const team = [
    { name: "Jane Doe", role: "CEO", photo: "/team/jane.jpg", bio: "20+ years shaping tech futures." },
    { name: "John Smith", role: "CTO", photo: "/team/john.jpg", bio: "Mastermind of innovative systems." },
    { name: "Alice Brown", role: "Lead Designer", photo: "/team/alice.jpg", bio: "UI/UX visionary." },
  ];

  const milestones = [
    { year: "2015", event: "Founded iNetworks Ltd.", detail: "Started with 5 employees in a garage." },
    { year: "2018", event: "Global Expansion", detail: "Opened offices in 3 continents." },
    { year: "2023", event: "Cloud Launch", detail: "Awarded Best Tech Solution 2023." },
  ];

  const values = [
    { title: "Innovation", desc: "Pushing tech boundaries.", icon: <FaRocket /> },
    { title: "Excellence", desc: "Top-quality deliverables.", icon: <FaAward /> },
    { title: "Collaboration", desc: "Teamwork drives success.", icon: <FaUsers /> },
  ];

  const nextTeam = () => setActiveTeam((prev) => (prev + 1) % team.length);
  const prevTeam = () => setActiveTeam((prev) => (prev - 1 + team.length) % team.length);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <motion.section
        className="about-hero"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h1>About iNetworks Ltd</h1>
        <p>Unleashing digital potential since 2015.</p>
        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <span>{stats.years}+ Years</span>
          <span>{stats.clients}+ Clients</span>
        </motion.div>
      </motion.section>

      {/* Mission & Vision */}
      <section className="about-mission-vision">
        <motion.div
          className="mission"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <FaRocket className="icon" />
          <h2>Our Mission</h2>
          <p>Empower businesses with innovative tech solutions.</p>
        </motion.div>
        <motion.div
          className="vision"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <FaChartLine className="icon" />
          <h2>Our Vision</h2>
          <p>Global leader in transformative IT by 2030.</p>
        </motion.div>
      </section>

      {/* Values Section */}
      <motion.section
        className="about-values"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      >
        <h2>Our Values</h2>
        <div className="values-grid">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="value-card"
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Slider */}
      <motion.section
        className="about-team"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
      >
        <h2>Meet Our Team</h2>
        <div className="team-slider">
          <button className="slider-nav prev" onClick={prevTeam}>
            <FaChevronLeft />
          </button>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam}
              className="team-card"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <img src={team[activeTeam].photo} alt={team[activeTeam].name} className="team-photo" />
              <h3>{team[activeTeam].name}</h3>
              <p className="role">{team[activeTeam].role}</p>
              <p className="bio">{team[activeTeam].bio}</p>
            </motion.div>
          </AnimatePresence>
          <button className="slider-nav next" onClick={nextTeam}>
            <FaChevronRight />
          </button>
        </div>
      </motion.section>

      {/* Stats with Progress Bars */}
      <motion.section
        className="about-stats"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1 }}
      >
        <h2>Our Achievements</h2>
        <div className="stats-grid">
          <div>
            <FaUsers />
            <h3>{stats.employees}</h3>
            <p>Employees</p>
            <motion.div className="progress-bar" animate={{ width: `${(stats.employees / 100) * 100}%` }} />
          </div>
          <div>
            <FaHistory />
            <h3>{stats.years}</h3>
            <p>Years</p>
            <motion.div className="progress-bar" animate={{ width: `${(stats.years / 15) * 100}%` }} />
          </div>
          <div>
            <FaChartLine />
            <h3>{stats.projects}</h3>
            <p>Projects</p>
            <motion.div className="progress-bar" animate={{ width: `${(stats.projects / 600) * 100}%` }} />
          </div>
          <div>
            <FaUsers />
            <h3>{stats.clients}</h3>
            <p>Clients</p>
            <motion.div className="progress-bar" animate={{ width: `${(stats.clients / 250) * 100}%` }} />
          </div>
        </div>
      </motion.section>

      {/* Timeline with Tooltips */}
      <motion.section
        className="about-timeline"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.2 }}
      >
        <h2>Our Milestones</h2>
        <div className="timeline">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              className={`timeline-item ${activeMilestone === index ? 'active' : ''}`}
              onClick={() => setActiveMilestone(index)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3>{milestone.year}</h3>
              <p>{milestone.event}</p>
              <AnimatePresence>
                {activeMilestone === index && (
                  <motion.div
                    className="tooltip"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {milestone.detail}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Social Feed */}
      <motion.section
        className="about-social"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.4 }}
      >
        <h2>Join the Conversation</h2>
        <div className="twitter-feed">
          <FaTwitter className="twitter-icon" />
          <iframe
            src="https://twitter.com/kambaleedwin?ref_src=twsrc%5Etfw"
            width="100%"
            height="400"
            title="Twitter Feed"
            style={{ border: 'none' }}
          ></iframe>
        </div>
      </motion.section>

      {/* Download Profile */}
      <motion.section
        className="about-download"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.6 }}
      >
        <h2>Our Company Profile</h2>
        <a href="/company-profile.pdf" download className="download-btn">
          <FaDownload /> Download PDF
        </a>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="about-cta"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.8 }}
      >
        <h2>Shape the Future with Us</h2>
        <Link to="/contact">
          <motion.button
            className="cta-button"
            whileHover={{ scale: 1.1, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            Get in Touch
          </motion.button>
        </Link>
      </motion.section>
    </div>
  );
};

export default About;