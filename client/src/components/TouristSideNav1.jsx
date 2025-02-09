import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined"; // Icon for History
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { useProSidebar } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Import Link for navigation

const TouristSideNav1 = () => {
  const { collapseSidebar } = useProSidebar();
  const currentUser = useSelector((state) => state.user.currentUser?.username || "Guest");

  return (
    <Sidebar className="fixed h-screen">
      <Menu className="overflow-y-auto h-full">
        <MenuItem
          icon={<MenuOutlinedIcon />}
          onClick={() => {
            collapseSidebar();
          }}
          style={{ textAlign: "center" }}
        >
          <h2>{currentUser}</h2>
        </MenuItem>

        {/* Wrap each MenuItem in Link */}
        <Link to="/TouristHome" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem icon={<HomeOutlinedIcon />}>Home</MenuItem>
        </Link>

        <Link to="/GetHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem icon={<HistoryOutlinedIcon />}>History of Booking</MenuItem>
        </Link>

        <Link to="/TouristProducts" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem icon={<StorefrontOutlinedIcon />}>Browse Products</MenuItem>
        </Link>

        <Link to="/PurchasedProduct" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem icon={<ViewModuleOutlinedIcon />}>My Products</MenuItem>
        </Link>

        <Link to="/ComplaintsList" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem icon={<ReportProblemOutlinedIcon />}>My Complaints</MenuItem>
        </Link>
      </Menu>
    </Sidebar>
  );
};

export default TouristSideNav1;
