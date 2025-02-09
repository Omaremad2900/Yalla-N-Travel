import React from 'react';
import { Link } from 'react-router-dom';
import { FaLandmark, FaMonument, FaCalendarAlt, FaBuilding } from 'react-icons/fa';

const TourismgovernerHome = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-120" style={{ backgroundImage: 'url("/images/explore-bg.jpg")' }}>
        <div className=" bg-slate-200 text-slate-700 py-16 flex items-center justify-center">
          <h1 className=" text-slate-700 text-5xl font-bold">Preserve and Promote Cultural Heritage!</h1>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-700">Manage Museums and Historical Sites</h2>
            <p className="text-slate-500"> Oversee cultural landmarks, update exhibits, and ensure their visibility to the public. Protect and promote history!</p>
          </div>

          {/* Main Button Section */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/museums" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600">
              <FaLandmark className="mr-2" />
              <span>Museums</span>
            </Link>
            <Link to="/historical-places" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600">
              <FaMonument className="mr-2" />
              <span>Historical Places</span>
            </Link>

            {/* New buttons for hosting events */}
            <Link to="/Createmuseum" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600">
              <FaBuilding className="mr-2" />
              <span>Host Museum Event</span>
            </Link>
            <Link to="/add-place" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600">
              <FaCalendarAlt className="mr-2" />
              <span>Host Historical Event</span>
            </Link>
          </div>

        </div>
      </section>

      {/* Placeholder for Additional Content */}
      <section className="py-12 bg-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-700 mb-6">Your Managed Museums & Sites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example of museums */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Ancient History Museum</h3>
              <p className="text-slate-500"><strong>Date:</strong> June 10, 2024</p>
              <p className="text-slate-500"><strong>Time:</strong> 9:00 AM</p>
              <p className="text-slate-500"><strong>Location:</strong> <a href="https://www.google.com/maps" className="text-blue-500 underline">Cairo, Egypt (Google Maps)</a></p>
              <p className="text-slate-500"><strong>Ticket Price:</strong> $20</p>
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

export default TourismgovernerHome;
