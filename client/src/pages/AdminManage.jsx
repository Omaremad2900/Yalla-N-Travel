import React from 'react';
import { Link } from 'react-router-dom';
import { ListAlt } from '@mui/icons-material';  // MUI equivalent of ClipboardCheckIcon
import { Comment, Tag } from '@mui/icons-material';  // MUI equivalent of FaComment and FaTags
import SideNav from '../components/adminSidenav'; // Ensure this path is correct

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

const AdminManage = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 bg-slate-100 min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-cover bg-center h-120" style={{ backgroundImage: 'url("/images/manage-bg.jpg")' }}>
          <div className="bg-slate-200 text-slate-700 py-16 flex items-center justify-center">
            <h1 className="text-slate-700 text-5xl font-bold">Admin Manage</h1>
          </div>
        </div>

        {/* Button Section */}
        <section className="flex-grow py-12 bg-slate-100 my-8">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-700 mb-8 text-center">Manage Platform Entities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link to="/Manageusers" className="flex items-center justify-center bg-slate-700 text-white px-8 py-6 rounded-lg hover:bg-slate-600 text-lg">
                <ManageAccountsIcon className="w-6 h-6 mr-3" />  {/* MUI ListAlt Icon */}
                <span>Manage Users</span>
              </Link>

              <Link to="/Managegoverners" className="flex items-center justify-center bg-slate-700 text-white px-8 py-6 rounded-lg hover:bg-slate-600 text-lg">
                <LocalLibraryIcon className="w-6 h-6 mr-3" />  {/* MUI ListAlt Icon */}
                <span>Manage Governors</span>
              </Link>

              <Link to="/Managepreferencetags" className="flex items-center justify-center bg-slate-700 text-white px-8 py-6 rounded-lg hover:bg-slate-600 text-lg">
                <LabelIcon className="w-6 h-6 mr-3" />  {/* MUI ListAlt Icon */}
                <span>Manage Preference Tags</span>
              </Link>

              <Link to="/Manageactivitycategories" className="flex items-center justify-center bg-slate-700 text-white px-8 py-6 rounded-lg hover:bg-slate-600 text-lg">
                <CategoryIcon className="w-6 h-6 mr-3" />  {/* MUI ListAlt Icon */}
                <span>Manage Activity Categories</span>
              </Link>

              <Link to="/ManageComplaints" className="flex items-center justify-center bg-slate-700 text-white px-8 py-6 rounded-lg hover:bg-slate-600 text-lg">
                <ReportIcon className="w-6 h-6 mr-3" />  {/* MUI ListAlt Icon */}
                <span>Manage Complaints</span>
              </Link>

              <Link to="/AdminProducts" className="flex items-center justify-center bg-slate-700 text-white px-8 py-6 rounded-lg hover:bg-slate-600 text-lg">
                <BusinessCenterIcon className="w-6 h-6 mr-3" />  {/* MUI ListAlt Icon */}
                <span>Manage Products</span>
              </Link>

              {/* New Button for AdminArchivedProducts */}
              <Link to="/AdminArchivedProducts" className="flex items-center justify-center bg-slate-700 text-white px-8 py-6 rounded-lg hover:bg-slate-600 text-lg">
                <ArchiveIcon className="w-6 h-6 mr-3" />  {/* MUI ListAlt Icon */}
                <span>Manage Archived Products</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminManage;
