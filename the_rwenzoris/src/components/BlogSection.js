// BlogSection.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Socket.IO with robust config
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'], // WebSocket first, polling fallback
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Socket event listeners
    socket.on('connect', () => console.log('Connected to Socket.IO server (BlogSection)'));
    socket.on('connect_error', (err) => {
      console.error('Socket connection error (BlogSection):', err.message);
      setError('Real-time updates unavailable. Posts still loaded.');
    });
    socket.on('newBlogPost', (post) => {
      setPosts((prev) => {
        const currentPosts = Array.isArray(prev) ? prev : [];
        return [post, ...currentPosts.filter((p) => p.id !== post.id)];
      });
    });

    // Fetch blog posts
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogPosts', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // For auth if needed
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.warn('Blog posts response is not an array:', data);
          setPosts([]);
        } else {
          setPosts(data);
        }
      } catch (err) {
        console.error('Blog posts fetch error:', err);
        setError(`Failed to load blog posts: ${err.message}`);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('newBlogPost');
      socket.disconnect();
    };
  }, []); // Single run on mount

  // Loading state
  if (loading) {
    return (
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-700">Loading blog posts...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Main render
  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-900 mb-8"
        >
          Travel News & Updates
        </motion.h2>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <motion.div
                key={post.id || Math.random()} // Fallback for missing id
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03 }} // Subtle hover effect
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={post.image || '/placeholder-blog.jpg'}
                    alt={post.title || 'Blog post image'}
                    fill
                    className="object-cover"
                    priority={posts.indexOf(post) < 3} // Preload first 3 images
                    onError={(e) => {
                      e.target.src = '/placeholder-blog.jpg';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {post.title || 'Untitled Post'}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {post.excerpt || (post.content ? `${post.content.slice(0, 100)}...` : 'No content available')}
                  </p>
                  <Link
                    href={post.link || `/blog/${post.id || ''}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More
                  </Link>
                  {(post.source || post.publishedAt) && (
                    <p className="text-gray-500 text-sm mt-2">
                      {post.source ? `Source: ${post.source}` : ''}{' '}
                      {post.publishedAt && post.source ? '|' : ''}{' '}
                      {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
