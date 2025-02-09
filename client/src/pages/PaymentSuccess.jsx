import React from "react";
import { useNavigate } from "react-router-dom";
import TouristSideNav from "../components/TouristSideNav"; // Import the TouristSideNav
import { ProSidebarProvider } from "react-pro-sidebar";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate("/TouristHome"); // Navigate to homepage
  };

  return (
    <ProSidebarProvider>
      <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Side Navigation */}
        <TouristSideNav />

        {/* Main Content */}
        <div className="flex-1 flex h-screen items-center justify-center p-6 ">
          <div className="bg-white rounded-lg shadow-lg p-10 max-w-md text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <svg
                className="w-24 h-24 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 26 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m0 9a9 9 0 110-18 9 9 0 010 18z"
                ></path>
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Your payment has been processed successfully. Thank you for your
              purchase!
            </p>

            {/* Return to Homepage Button */}
            <button
              onClick={handleReturnHome}
              className="px-6 py-3 bg-gray-700 text-white font-semibold text-lg rounded-lg shadow hover:bg-gray-600 transition duration-300"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    </ProSidebarProvider>
  );
};

export default PaymentSuccess;
