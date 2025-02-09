import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardListIcon, PlusIcon, EyeIcon } from '@heroicons/react/outline';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-120" style={{ backgroundImage: 'url("/images/dashboard-bg.jpg")' }}>
        <div className="bg-slate-200 text-slate-700 py-16 flex items-center justify-center">
          <h1 className="text-slate-700 text-5xl font-bold">Admin Dashboard</h1>
        </div>
      </div>

      {/* Main Section */}
      <section className="flex-grow py-12 bg-slate-100 min-h-[50vh] my-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Buttons and Descriptions */}
          <div className="space-y-8">
            <div className="relative flex items-center">
              <div className="w-10 h-10 bg-slate-700 text-white rounded-full flex items-center justify-center">
                <ClipboardListIcon className="w-6 h-6" />
              </div>
              <div className="ml-6">
                <Link to="/AdminManage" className="text-xl font-bold text-slate-700">Manage</Link>
                <p className="text-slate-500 mt-2">Access the tools to manage users, governors, preference tags, activity categories, and more. Organize and control the platform effectively.</p>
              </div>
            </div>

            <div className="relative flex items-center">
              <div className="w-10 h-10 bg-slate-700 text-white rounded-full flex items-center justify-center">
                <PlusIcon className="w-6 h-6" />
              </div>
              <div className="ml-6">
                <Link to="/AdminCreate" className="text-xl font-bold text-slate-700">Create</Link>
                <p className="text-slate-500 mt-2">Create new admin accounts and promo codes. Control your platform's access and offer promotions to users effectively.</p>
              </div>
            </div>

            <div className="relative flex items-center">
              <div className="w-10 h-10 bg-slate-700 text-white rounded-full flex items-center justify-center">
                <EyeIcon className="w-6 h-6" />
              </div>
              <div className="ml-6">
                <Link to="/AdminView" className="text-xl font-bold text-slate-700">View</Link>
                <p className="text-slate-500 mt-2">View platform data such as user statistics, itineraries, activities, and more. Keep track of the overall performance and progress.</p>
              </div>
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

export default AdminDashboard;
