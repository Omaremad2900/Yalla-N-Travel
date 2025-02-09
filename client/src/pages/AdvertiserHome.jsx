import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaEye, FaCar, FaDollarSign, FaChartLine } from 'react-icons/fa';

const AdvertiserHome = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-120" style={{ backgroundImage: 'url("/images/explore-bg.jpg")' }}>
        <div className="bg-slate-200 text-slate-700 py-16 flex items-center justify-center">
          <h1 className="text-slate-700 text-5xl font-bold">Manage Your Activities with Ease!</h1>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-700">Create, Update, and Manage Your Activities</h2>
            <p className="text-slate-500">
              Take full control of your activities. Add new adventures, update existing ones, and track everything effortlessly!
            </p>
          </div>
          {/* Main Button Section */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/Createactivity" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600">
              <FaBriefcase className="mr-2" />
              <span>Launch New Activity</span>
            </Link>
            <Link to="/ManageActivities" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600">
              <FaEye className="mr-2" />
              <span>View Activities</span>
            </Link>
            {/* Create Transportation Button with FaCar Icon */}
            <Link to="/Createtransportation" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600">
              <FaCar className="mr-2" />
              <span>Create Transportation</span>
            </Link>
            {/* View Revenue Button */}
            <Link to="/Advertiserrevenue" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600">
              <FaDollarSign className="mr-2" />
              <span>View Revenue</span>
            </Link>
              {/* View Tourist Statistics Button with FaChartLine Icon */}
              <Link to="/AdvertiserViewTouristStatistics" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600">
              <FaChartLine className="mr-2" />
              <span>View Tourist Statistics</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Placeholder for Additional Content */}
      <section className="py-12 bg-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-700 mb-6">Your Recent Activities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example of bookings */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Cultural Exploration</h3>
              <p className="text-slate-500"><strong>Date:</strong> June 10, 2024</p>
              <p className="text-slate-500"><strong>Time:</strong> 3:00 PM</p>
              <p className="text-slate-500"><strong>Location:</strong> <a href="https://www.google.com/maps" className="text-blue-500 underline">Cairo, Egypt (Google Maps)</a></p>
              <p className="text-slate-500"><strong>Price:</strong> $50</p>
              <p className="text-slate-500"><strong>Category:</strong> Culture</p>
              <p className="text-slate-500"><strong>Tags:</strong> Culture, History, Sightseeing</p>
              <p className="text-slate-500"><strong>Special Discounts:</strong> 15% off for groups</p>
              <p className="text-slate-500"><strong>Booking Status:</strong> Open</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-700 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Yalla n'Travel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdvertiserHome;
