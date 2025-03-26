import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="space-y-4">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Preferences:</strong> {user?.preferences?.join(', ') || 'None'}</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
