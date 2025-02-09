import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AdminSideNav from '../components/adminSidenav'; // Import the AdminSideNav component

const AddTourismGovernorForm = ({ AdminService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser._id);
  const [formData, setFormData] = useState({
    adminId: loggedInUser,
    username: '',
    password: '',
    email: '',
    adminPassword: ''
  });

  const [responseMessage, setResponseMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Await the AdminService call
      console.log(formData);
      const response = await AdminService.addTourismGovernor(formData);
      console.log(response);
      setResponseMessage('Tourism governor created successfully!');
    } catch (error) {
      console.error('Error creating tourism governor:', error);
      setResponseMessage('Failed to create tourism governor');
    }
  };

  return (
    <div className="flex">
      <AdminSideNav /> {/* Add the AdminSideNav component here */}
      <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Add Tourism Governor
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Admin Password
            </label>
            <input
              type="password"
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-slate-700 text-white border-2 border-slate-700 py-2 px-6 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 focus:outline-none w-full"
            >
            Submit
          </button>

          {responseMessage && (
            <div className="mt-4 text-center text-gray-700">
              {responseMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddTourismGovernorForm;
