import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaPen, FaPlus, FaUserPlus, FaChartLine } from 'react-icons/fa';
import { ProSidebarProvider } from 'react-pro-sidebar';

const SellerHome = () => {
  return (
    <ProSidebarProvider>
      <div className="flex bg-slate-200 min-h-screen">
        {/* Sidebar */}

        {/* Main Content */}
        <div className="flex-1">
          {/* Hero Section */}
          <div
            className="relative bg-cover bg-center h-120"
            style={{ backgroundImage: 'url("/images/seller-bg.jpg")' }}
          >
            <div className="bg-slate-200 text-slate-700 py-16 flex items-center justify-center">
              <h1 className="text-slate-700 text-5xl font-bold">Grow Your Business with Us!</h1>
            </div>
          </div>

          {/* Introduction Section */}
          <section className="py-12 bg-slate-200">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-700">Expand Your Reach</h2>
                <p className="text-slate-500">
                  Sell more products, reach new customers, and build your brand globally!
                </p>
              </div>

              {/* Main Button Section */}
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  to="/SellerProducts"
                  className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600"
                >
                  <FaStore size={15} className="mr-2" />
                  <span>Manage Store</span>
                </Link>

                <Link
                  to="/sellerAddProduct"
                  className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600"
                >
                  <FaPlus size={15} color={'white'} className="mr-2" />
                  <span>Add to Store</span>
                </Link>

                
                <Link
                  to="/SellerCreate"
                  className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600"
                >
                  <FaUserPlus size={15} color={'white'} className="mr-2" />
                  <span>Create New Seller</span>
                </Link>

                {/* View Revenue Button */}
                <Link
                  to="/Sellerrevenue"
                  className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600"
                >
                  <FaChartLine size={15} color={'white'} className="mr-2" />
                  <span>View Revenue</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Recent Sales Section */}
          <section className="py-12 bg-slate-200">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-slate-700 mb-6">Your Recent Sales</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Example of sales */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">Leather Backpack</h3>
                  <p className="text-slate-500 mb-4">Premium leather crafted with care and precision.</p>
                  <p className="text-black">
                    <strong>Date Sold:</strong> October 12, 2024
                  </p>
                  <p className="text-black">
                    <strong>Buyer Location:</strong> New York, USA
                  </p>
                </div>
                {/* Additional sales can be mapped here */}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-slate-700 text-white py-6">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <p>&copy; 2024 Yalla n'Sell. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </ProSidebarProvider>
  );
};

export default SellerHome;
