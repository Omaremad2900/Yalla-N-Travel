import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
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
import { useProSidebar } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SideNav = () => {
  const { collapseSidebar } = useProSidebar();
  const currentUser = useSelector((state) => state.user.currentUser?.username || "Guest");

  return (
    <Sidebar>
      <Menu>
        <MenuItem
          icon={<MenuOutlinedIcon />}
          onClick={() => collapseSidebar()}
          style={{ textAlign: "center" }}
        >
          <h2>{currentUser}</h2>
        </MenuItem>

        {/* Home Section */}
        <MenuItem icon={<HomeOutlinedIcon />} component={<Link to="/Admin" />}>
          Home
        </MenuItem>

        {/* Create Section */}
        <div className="border-t border-gray-300 mt-4 pt-4">
          <h3 className="text-slate-700 font-bold text-sm mb-2 ml-4">Create</h3>
          <MenuItem icon={<AddBusinessIcon />} component={<Link to="/CreateAdmin" />}>
            Create Admin Account
          </MenuItem>
          <MenuItem icon={<CardGiftcardIcon />} component={<Link to="/CreatePromo" />}>
            Create Promo Code
          </MenuItem>
        </div>

        {/* Manage Section */}
        <div className="border-t border-gray-300 mt-4 pt-4">
          <h3 className="text-slate-700 font-bold text-sm mb-2 ml-4">Manage</h3>
          <MenuItem icon={<ManageAccountsIcon />} component={<Link to="/Manageusers" />}>
            Manage Users
          </MenuItem>
          <MenuItem icon={<BusinessCenterIcon />} component={<Link to="/AdminProducts" />}>
            Manage Products
          </MenuItem>
          <MenuItem icon={<ArchiveIcon />} component={<Link to="/AdminArchivedProducts" />}>
            Manage Archived Products
          </MenuItem>
          <MenuItem icon={<LocalLibraryIcon />} component={<Link to="/Managegoverners" />}>
            Manage Governors
          </MenuItem>
          <MenuItem icon={<LabelIcon />} component={<Link to="/Managepreferencetags" />}>
            Manage Preference Tags
          </MenuItem>
          <MenuItem icon={<CategoryIcon />} component={<Link to="/Manageactivitycategories" />}>
            Manage Activity Categories
          </MenuItem>
          <MenuItem icon={<ReportIcon />} component={<Link to="/ManageComplaints" />}>
            Manage Complaints
          </MenuItem>
        </div>

        {/* View Section */}
        <div className="border-t border-gray-300 mt-4 pt-4">
          <h3 className="text-slate-700 font-bold text-sm mb-2 ml-4">View</h3>
          <MenuItem icon={<DescriptionIcon />} component={<Link to="/AdminViewItineraries" />}>
            View Itineraries
          </MenuItem>
          <MenuItem icon={<VisibilityIcon />} component={<Link to="/AdminViewActivities" />}>
            View Activities
          </MenuItem>
          <MenuItem icon={<AttachMoneyIcon />} component={<Link to="/AdminRevenue" />}>
            View Revenue
          </MenuItem>
          <MenuItem icon={<AnalyticsIcon />} component={<Link to="/AdminViewUserStatistics" />}>
            View User Statistics
          </MenuItem>
        </div>
      </Menu>
    </Sidebar>
  );
};

export default SideNav;
