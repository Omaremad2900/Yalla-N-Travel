import React from 'react';
import { Link } from 'react-router-dom';
import { Visibility } from '@mui/icons-material';  // MUI Visibility Icon
import SideNav from '../components/adminSidenav';  // Ensure this path is correct

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddBusinessIcon from "@mui/icons-material/AddBusiness"; // Unique icon for Create Admin Account
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard"; // Unique icon for Create Promo Code
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"; // Unique icon for Manage Users
import ArchiveIcon from "@mui/icons-material/Archive"; // Unique icon for Manage Archived Products
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter"; // Unique icon for Manage Products
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary"; // Unique icon for Manage Governors
import LabelIcon from "@mui/icons-material/Label"; // Unique icon for Manage Preference Tags
import CategoryIcon from "@mui/icons-material/Category"; // Unique icon for Manage Activity Categories
import ReportIcon from "@mui/icons-material/Report"; // Unique icon for Manage Complaints
import DescriptionIcon from "@mui/icons-material/Description"; // Unique icon for View Itineraries
import VisibilityIcon from "@mui/icons-material/Visibility"; // Unique icon for View Activities
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Unique icon for View Revenue
import AnalyticsIcon from "@mui/icons-material/Analytics"; // Unique icon for View User Statistics

const AdminView = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 bg-slate-100">
        {/* Hero Section */}
        <div className="relative bg-cover bg-center h-120" style={{ backgroundImage: 'url("/images/view-bg.jpg")' }}>
          <div className="bg-slate-200 text-slate-700 py-16 flex items-center justify-center">
            <h1 className="text-slate-700 text-5xl font-bold">Admin View</h1>
          </div>
        </div>

        {/* Button Section */}
        <section className="flex-grow py-24 bg-slate-100 my-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-700 mb-12 text-center">View Platform Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link to="/AdminViewItineraries" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600 text-lg">
                <DescriptionIcon className="w-6 h-6 mr-3" />  {/* MUI Visibility Icon */}
                <span>View Itineraries</span>
              </Link>

              <Link to="/AdminViewActivities" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600 text-lg">
                <VisibilityIcon className="w-6 h-6 mr-3" />  {/* MUI Visibility Icon */}
                <span>View Activities</span>
              </Link>

              <Link to="/Adminrevenue" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600 text-lg">
                <AttachMoneyIcon className="w-6 h-6 mr-3" />  {/* MUI Visibility Icon */}
                <span>View Revenue</span>
              </Link>

              <Link to="/AdminViewUserStatistics" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600 text-lg">
                <AnalyticsIcon className="w-6 h-6 mr-3" />  {/* MUI Visibility Icon */}
                <span>View User Statistics</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminView;
