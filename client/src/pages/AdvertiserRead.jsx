import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import AdvertiserSideNav from '../components/advertiserSidenav';

const AdvertiserRead = ({ advertiserService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    user_id: loggedInUser._id,
    website: '',
    hotline: '',
    company_profile: '',
    mobile: '',
    profilePicture: '' // Initial default value for profilePicture
  });
  
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await advertiserService.getAdvertiserProfileById(loggedInUser._id);
        if (response) {
          setProfile(response);
          setIsProfileLoaded(true);
        }
      } catch (error) {
        alert("Profile not found");
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, [loggedInUser._id, advertiserService]);

  const handleEditClick = () => {
    navigate('/AdvertiserUpdate');
  };
  
  const handleAccountDeletion = async () => {
    if (window.confirm("Are you sure you want to request account deletion? This action cannot be undone.")) {
      try {
        await advertiserService.requestAccountDeletion(loggedInUser.id);
        alert("Your account is deleted");
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error requesting account deletion';
        console.error("Failed to request account deletion:", error.response?.data || error.message);
        alert(`Error requesting account deletion: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}
      <AdvertiserSideNav />
  
      {/* Main content */}
      <div className="flex-1 flex items-start justify-center min-h-screen pt-10 px-4 bg-gray-100">
        <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <img
              src={profile.profilePicture || 'default-profile-picture.png'} // Fallback to default if no profile picture
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-lg"
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <h4 className="text-3xl font-semibold text-gray-800">Advertiser Profile</h4>
            <button onClick={handleEditClick} className="text-blue-600 hover:text-blue-800">
              <FontAwesomeIcon icon={faPen} size="lg" />
            </button>
          </div>

          {isProfileLoaded ? (
            <div className="space-y-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Website</span>
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                  {profile.website || 'Not provided'}
                </a>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Hotline</span>
                <span className="text-gray-700">{profile.hotline || 'Not provided'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Company Profile</span>
                <p className="text-gray-700">{profile.company_profile || 'No profile available'}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Mobile</span>
                <span className="text-gray-700">{profile.mobile || 'No mobile available'}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Loading profile...</p>
          )}

          {/* Buttons: Edit & Account Deletion */}
          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4 w-full">
            {/* Change Password Button */}
            <div className="w-full sm:max-w-xs">
              <Link to="/ChangePassword">
                <div className="bg-white p-4 rounded-lg shadow-sm w-full">
                <button className="bg-slate-700 text-white border-2 border-slate-700 py-2 px-6 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 focus:outline-none w-full">
                  Change Password
                  </button>

                </div>
              </Link>
            </div>

            {/* Delete Account Button */}
            <div className="w-full sm:max-w-xs">
              <button
                onClick={handleAccountDeletion}
                className="bg-white text-red-500 border-2 border-red-500 py-2 px-6 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 focus:outline-none w-full"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserRead;
