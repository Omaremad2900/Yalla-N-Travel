import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminSideNav from '../components/adminSidenav'; // Import the AdminSideNav component

const AdminRead = ({ adminService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser); // Get the logged-in user from Redux
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null); // Initialize profile as null
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // Fetch admin profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (loggedInUser && loggedInUser._id) { // Ensure loggedInUser._id exists
        try {
          const response = await adminService.getAdminProfileById();
          console.log(response); // Log the full response for debugging
          if (response) {
            console.log(response.data._id);
            setProfile(response.data._id); // Set the entire response data
            setIsProfileLoaded(true);
          } else {
            console.error("No data found in response");
          }
        } catch (error) {
          alert("Profile not found");
          console.error('Failed to fetch profile:', error);
        }
      }
    };
    fetchProfile();
  }, [loggedInUser, adminService]);

  return (
    <div className="flex">
      <AdminSideNav /> {/* Add the AdminSideNav component */}
      <div className="flex-1 flex items-start justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mt-10">
          <div className="mb-4">
            <h4 className="text-2xl font-semibold text-gray-800">Admin Profile</h4>
          </div>
          {isProfileLoaded ? (
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">User ID</span>
                <span className="text-gray-700">{profile || 'Not available'}</span> {/* Display user ID */}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Loading profile...</p>
          )}

{/* Center-aligned Change Password Button */}
<div className="flex justify-center mt-6"> {/* Flex container to center-align */}
  <div className="w-full sm:max-w-xs">
    <button
      className="bg-slate-700 text-white border-2 border-slate-700 py-2 px-6 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 focus:outline-none w-full"
      onClick={() => navigate('/ChangePassword')}
    >
      Change Password
    </button>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default AdminRead;
