import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tourismGovernorService from '../services/tourismgovernorService';
import TourismSidenav from '../components/TourismSidenav';

const TourismGovernorRead = () => {
  const [profile, setProfile] = useState({
    userId: '',
    username: '',
    email: '',
    profilePicture: '',
  });
  const [error, setError] = useState(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await tourismGovernorService.readTourismGovernor();
        setProfile(response.data);
        setIsProfileLoaded(true);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordChange = () => {
    navigate('/ChangePassword');
  };

  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;
  if (!isProfileLoaded) return <p className="text-gray-500 text-center">Loading profile...</p>;

  return (
    <div className="flex bg-gray-50">
      <TourismSidenav />

      <div className="flex-1 flex items-start justify-center min-h-screen pt-10 px-4 bg-gray-100">
        <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-center mb-6">
            <img
              src={profile.profilePicture || 'default-profile-picture.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-lg"
            />
          </div>

          <h4 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Tourism Governor Profile
          </h4>

          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">User ID</span>
              <span className="text-gray-700">{profile.userId}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Username</span>
              <span className="text-gray-700">{profile.username}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <span className="text-gray-700">{profile.email}</span>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handlePasswordChange}
              className="bg-slate-700 text-white border-2 border-slate-700 py-2 px-6 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 focus:outline-none w-full sm:max-w-xs"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourismGovernorRead;
