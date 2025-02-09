import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Advertiser = () => {
  const loggedInUser = useSelector((state) => state.user.currentUser);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      <aside className="bg-gray-100 p-6 rounded-lg shadow-md h-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Advertiser Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <Link to="/Manageactivities" className="w-full text-left p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
              Manage Activities
            </Link>
          </li>
          <li>
            <Link to="/createActivity" className="w-full text-left p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
              Create Activity
            </Link>
          </li>
          <li>
            <Link to="/viewItineraries" className="w-full text-left p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
              View Itineraries
            </Link>
          </li>
          <li>
            <Link to="/AdvertiserCrud" className="w-full text-left p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
              Manage Profile
            </Link>
          </li>
        </ul>
      </aside>
      
      <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Welcome, {loggedInUser.username}!</h3>
        <p>Select an option from the sidebar to manage your activities.</p>
      </div>
    </div>
  );
};

export default Advertiser;
