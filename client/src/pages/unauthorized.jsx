// src/pages/Unauthorized.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/'); // Redirects to homepage or modify the path to login if needed
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">403</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-700">Unauthorized Access</h2>
        <p className="mt-2 text-lg text-gray-600">
          Sorry, you don't have permission to access this page.
        </p>

        <div className="mt-6">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          >
            Go Back to HomePage
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
