'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTwitter, FaFacebookF, FaInstagram, FaArrowUp } from 'react-icons/fa'; // Install react-icons

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeStatus('');
    try {
      // Simulate newsletter subscription (replace with real API)
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSubscribeStatus('Subscribed successfully!');
      setEmail('');
    } catch {
      setSubscribeStatus('Subscription failed. Try again.');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-blue-900 to-black text-white py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 tracking-wide">The Rwenzoris</h3>
            <p className="text-gray-300">
              Explore Uganda’s majestic Mountains of the Moon with us.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/destinations', text: 'Destinations' },
                { href: '/blog', text: 'Blog' },
                { href: '/itinerary', text: 'Plan Your Trip' },
                { href: '/contact', text: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
            {subscribeStatus && (
              <p className={`mt-2 text-sm ${subscribeStatus.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>
                {subscribeStatus}
              </p>
            )}
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {[
                { href: 'https://twitter.com', Icon: FaTwitter },
                { href: 'https://facebook.com', Icon: FaFacebookF },
                { href: 'https://instagram.com', Icon: FaInstagram },
              ].map(({ href, Icon }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-400">
          <p>© {new Date().getFullYear()} The Rwenzoris. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-blue-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-400">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        aria-label="Scroll to top"
      >
        <FaArrowUp size={20} />
      </motion.button>
    </footer>
  );
};

export default Footer;
