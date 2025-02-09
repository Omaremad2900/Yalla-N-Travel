import React from 'react';
import { Link } from 'react-router-dom';
import { Add } from '@mui/icons-material';  // MUI equivalent of PlusIcon
import SideNav from '../components/adminSidenav';

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

const AdminCreate = () => {
  return (
    <div className="flex  bg-slate-100">
      {/* Sidebar Section */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="relative bg-cover bg-center h-120" style={{ backgroundImage: 'url("/images/create-bg.jpg")' }}>
          <div className="bg-slate-200 text-slate-700 py-16 flex items-center justify-center">
            <h1 className="text-slate-700 text-5xl font-bold">Admin Create</h1>
          </div>
        </div>

        {/* Button Section */}
        <section className="flex-grow py-24 bg-slate-100 my-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-700 mb-12">Create New Items</h2>
            {/* Flexbox container to center buttons */}
            <div className="flex justify-center gap-8">
              <Link to="/CreateAdmin" className="flex items-center justify-center bg-slate-700 text-white px-8 py-6 rounded-lg hover:bg-slate-600 text-lg">
              <AddBusinessIcon className="w-6 h-6 mr-3" />  {/* MUI AddBusiness Icon */}
              <span>Create Admin Account</span>
              </Link>

              <Link to="/CreatePromo" className="flex items-center justify-center bg-slate-700 text-white px-8 py-6 rounded-lg hover:bg-slate-600 text-lg">
              <CardGiftcardIcon className="w-6 h-6 mr-3" />  {/* MUI Add Icon */}
              <span>Create Promo Code</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminCreate;
