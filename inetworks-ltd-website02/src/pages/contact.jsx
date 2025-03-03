import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "How can I get a quote?",
      answer: "Fill out the contact form or call us directly for a personalized quote.",
    },
    {
      question: "What are your support hours?",
      answer: "We’re available 24/7 via email and 9 AM - 5 PM via phone.",
    },
    {
      question: "Where are you located?",
      answer: "Our main office is at 123 Tech Lane, Innovation City.",
    },
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <motion.section
        className="contact-hero"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h1>Contact Us</h1>
        <p>Reach out to us for any inquiries or support—we’re here to help!</p>
      </motion.section>

      {/* Contact Form and Details */}
      <section className="contact-main">
        <motion.div
          className="contact-form-wrapper"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <h2>Get in Touch</h2>
          <ContactForm />
        </motion.div>

        <motion.div
          className="contact-details"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <h2>Contact Information</h2>
          <ul>
            <li>
              <FaPhone /> <span>+1-555-123-4567</span>
            </li>
            <li>
              <FaEnvelope /> <span>info@inetworks.com</span>
            </li>
            <li>
              <FaMapMarkerAlt /> <span>123 Tech Lane, Innovation City</span>
            </li>
          </ul>
        </motion.div>
      </section>

      {/* Map Section */}
      <motion.section
        className="contact-map"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      >
        <h2>Our Location</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153169!3d-37.81627997975167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1e3b8d1%3A0x2b8e5e5e5e5e5e5e!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1630000000000"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Our Location"
        ></iframe>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="contact-faq"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
      >
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="faq-item"
              initial={{ height: 'auto' }}
              animate={{ height: activeFaq === index ? 'auto' : '60px' }}
              transition={{ duration: 0.3 }}
            >
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <h3>{faq.question}</h3>
                <FaChevronDown
                  className={`faq-toggle ${activeFaq === index ? 'open' : ''}`}
                />
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;
