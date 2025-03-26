'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { fetchDestinations, fetchReviews, fetchBlogPosts } from '../../utils/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('destinations');
  const [destinations, setDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    const loadData = async () => {
      try {
        const [destData, revData, blogData] = await Promise.all([
          fetchDestinations(),
          fetchReviews(),
          fetchBlogPosts(),
        ]);
        setDestinations(destData);
        setReviews(revData);
        setBlogPosts(blogData);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  const tabs = [
    { id: 'destinations', label: 'Destinations' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'blogPosts', label: 'Blog Posts' },
    { id: 'users', label: 'Users' },
  ];

  const handleDelete = async (type, id) => {
    if (!confirm(`Delete ${type} with ID ${id}?`)) return;
    try {
      await fetch(`http://localhost:5000/api/${type}/${id}`, { method: 'DELETE' });
      if (type === 'destinations') setDestinations(destinations.filter(d => d.id !== id));
      if (type === 'reviews') setReviews(reviews.filter(r => r.id !== id));
      if (type === 'blogPosts') setBlogPosts(blogPosts.filter(b => b.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const renderContent = () => {
    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    switch (activeTab) {
      case 'destinations':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <motion.div key={dest.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold">{dest.name}</h3>
                <p>{dest.description}</p>
                <button onClick={() => handleDelete('destinations', dest.id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </motion.div>
            ))}
          </div>
        );
      case 'reviews':
        return (
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div key={review.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-4 rounded-lg shadow-lg">
                <p className="font-semibold">{review.user} - {review.rating}/5</p>
                <p>{review.comment}</p>
                <button onClick={() => handleDelete('reviews', review.id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </motion.div>
            ))}
          </div>
        );
      case 'blogPosts':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p>{post.content?.slice(0, 100)}...</p>
                <button onClick={() => handleDelete('blogPosts', post.id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </motion.div>
            ))}
          </div>
        );
      case 'users':
        return <p className="text-gray-500">User management coming soon...</p>; // Placeholder for future expansion
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user.name}</span>
          <button onClick={logout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Logout</button>
        </div>
      </div>
      <div className="p-8">
        <div className="flex gap-4 mb-8 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-4 ${activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
