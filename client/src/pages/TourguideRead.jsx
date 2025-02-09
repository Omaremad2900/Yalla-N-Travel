import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import TourGuideSideNav from '../components/SidenavTourguide';
import TourguideService from '../services/Tourguideservice';
import axiosInstance from '../axios';

const TourguideRead = () => {
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [profile, setProfile] = useState({
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: '',
    user: {
      email: '',
      username: '',
    },
    profilePicture: '',
  });
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/tourGuide/getTourGuide');
        if (response.data) {
          setProfile(response.data.data);
          setIsProfileLoaded(true);
        }
      } catch (error) {
        alert('Profile not found');
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, [loggedInUser.id]);

  const handleEditProfile = () => {
    navigate('/tourguideupdate');
  };

  const handlePasswordChange = () => {
    navigate('/changepassword');
  };

  const handleAccountDeletion = async () => {
    if (
      window.confirm(
        'Are you sure you want to request account deletion? This action cannot be undone.'
      )
    ) {
      try {
        await TourguideService.requestAccountDeletion(loggedInUser.id);
        alert('Your account deletion request has been submitted.');
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Error requesting account deletion';
        console.error('Failed to request account deletion:', error.response?.data || error.message);
        alert(`Error requesting account deletion: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="flex bg-gray-50">
      <TourGuideSideNav />

      <div className="flex-1 flex items-start justify-center min-h-screen pt-10 px-4 bg-gray-100">
        <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-center mb-6">
            <img
              src={profile.profilePicture || 'default-profile-picture.png'}
             
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-lg"
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <h4 className="text-3xl font-semibold text-gray-800">Tour Guide Profile</h4>
            <button onClick={handleEditProfile} className="text-blue-600 hover:text-blue-800">
              <FontAwesomeIcon icon={faPen} size="lg" />
            </button>
          </div>

          {isProfileLoaded ? (
            <div className="space-y-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Mobile Number</span>
                <span className="text-gray-700">{profile.mobileNumber || 'Not provided'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Years of Experience</span>
                <span className="text-gray-700">{profile.yearsOfExperience || 'Not provided'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Previous Work</span>
                <p className="text-gray-700">{profile.previousWork || 'No previous work listed'}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Email</span>
                <span className="text-gray-700">{profile.user.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Username</span>
                <span className="text-gray-700">{profile.user.username}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Loading profile...</p>
          )}

          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4 w-full">
            <div className="w-full sm:max-w-xs">
              <button
                onClick={handlePasswordChange}
                className="bg-slate-700 text-white border-2 border-slate-700 py-2 px-6 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 focus:outline-none w-full"
              >
                Change Password
              </button>
            </div>

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

export default TourguideRead;
