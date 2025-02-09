import React, { useState } from 'react';
import AdminService from '../services/adminService'; // Adjust the import path accordingly
import { useSelector } from 'react-redux'; // Assuming the current logged-in user is fetched from Redux
import SideNav from '../components/adminSidenav';

const CreateAdmin = () => {
  const loggedInUser = useSelector((state) => state.user.currentUser); // Get the logged-in user from Redux state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [currentAdminPassword, setCurrentAdminPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState(null); // For feedback messages

  // Handler for creating a new admin account
  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    // Prepare the request data to be sent
    const requestData = {
      adminId: loggedInUser._id, // Assuming the logged-in user's ID is needed
      username: adminUsername,
      password: adminPassword,
      email: adminEmail,
      adminPassword: currentAdminPassword, // The current admin's password for validation
    };

    try {
      // Make API call to create an admin
      const response = await AdminService.addAdmin(requestData);
      console.log(response);
      if (response.success) {
        // Reset form fields after successful creation
        setAdminUsername('');
        setAdminPassword('');
        setAdminEmail('');
        setCurrentAdminPassword('');
        setResponseMessage('Admin account created successfully!');
      } else {
        console.error('Unexpected Create Admin Response:', response);
        setResponseMessage('Failed to create admin due to an unexpected response.');
      }
    } catch (error) {
      // Handle errors
      console.error('Error creating admin:', error.response ? error.response.data : error.message);
      setResponseMessage(
        'Failed to create admin: ' +
        (error.response && error.response.data.message
          ? error.response.data.message
          : error.message)
      );
    }
  };

  return (
    <div className="flex">
      {/* <AdminSideNav /> */}
      <SideNav />

      <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h3 className="text-lg font-bold mb-4 text-gray-800 text-center">Create Admin Account</h3>
          {/* Admin creation form */}
          <form onSubmit={handleCreateAdmin} className="mt-6">
            <div className="mb-4">
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full border p-2 rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full border p-2 rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full border p-2 rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                value={currentAdminPassword}
                onChange={(e) => setCurrentAdminPassword(e.target.value)}
                placeholder="Current Admin Password"
                required
                className="w-full border p-2 rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-700 text-white border-2 border-slate-700 py-2 px-6 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 focus:outline-none w-full"
              >
              Create Admin
            </button>
          </form>

          {responseMessage && (
            <div className="mt-4 text-center text-gray-700">
              {responseMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
