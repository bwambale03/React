import React, { useState, useRef, useEffect } from "react";
import "../styles/ContactForm.css";
import { motion } from "framer-motion";

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current.focus(); // Auto-focus name field on mount
  }, []);

  const validateField = (name, value) => {
    let error = "";
    if (name === "name" && !value.trim()) error = "Name is required";
    if (name === "email" && (!value.trim() || !/\S+@\S+\.\S+/.test(value))) error = "Valid email is required";
    if (name === "message" && !value.trim()) error = "Message cannot be empty";
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setSubmitted(false);
        setErrors({});
        nameRef.current.focus(); // Refocus after reset
      }, 2000);
    } catch (error) {
      setErrors({ submit: "Failed to send message. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="contact-form"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-label="Contact Form"
    >
      <h2>Contact Us</h2>
      {submitted && <p className="success" role="alert">Message sent successfully!</p>}
      {errors.submit && <p className="error" role="alert">{errors.submit}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onBlur={handleBlur}
            ref={nameRef}
            aria-label="Your Name"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <span className="error" id="name-error">{errors.name}</span>
          )}
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onBlur={handleBlur}
            aria-label="Your Email"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span className="error" id="email-error">{errors.email}</span>
          )}
        </div>
        <div>
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            onBlur={handleBlur}
            aria-label="Your Message"
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <span className="error" id="message-error">{errors.message}</span>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </motion.div>
  );
};

export default ContactForm;