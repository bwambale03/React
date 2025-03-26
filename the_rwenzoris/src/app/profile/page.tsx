'use client'; // Mark as a Client Component

import UserProfile from '../../components/UserProfile';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Your Profile</h1>
      <UserProfile />
    </div>
  );
}