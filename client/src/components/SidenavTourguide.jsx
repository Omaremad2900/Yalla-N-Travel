import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeIcon from "@mui/icons-material/Home";
import { FaMapSigns,FaDollarSign, FaChartBar } from "react-icons/fa";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useProSidebar } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook

const TourGuideSideNav = () => {
  const { collapseSidebar } = useProSidebar();
  const currentUser = useSelector((state) => state.user.currentUser?.username || "Guest");
  const navigate = useNavigate(); // Using useNavigate hook

  return (
    <Sidebar className="h-screen">
      <Menu>
        {/* Sidebar Toggle */}
        <MenuItem
          icon={<MenuOutlinedIcon />}
          onClick={() => {
            collapseSidebar();
          }}
          style={{ textAlign: "center" }}
        >
          <h2>{currentUser}</h2>
        </MenuItem>

        {/* Home Button */}
        <MenuItem
          icon={<HomeIcon />}
          onClick={() => navigate("/Tourguidehomepage")} // Using navigate for routing
        >
          Home
        </MenuItem>

        {/* Create Itinerary Button */}
        <MenuItem
          icon={<FaMapSigns />}
          onClick={() => navigate("/CreateItinerary")} // Using navigate for routing
        >
          Create Itinerary
        </MenuItem>

        {/* View/Edit Itineraries Button */}
        <MenuItem
          icon={<ViewListIcon />}
          onClick={() => navigate("/view-itineraries")} // Using navigate for routing
        >
          View/Edit Itineraries
        </MenuItem>

        {/* View Revenue Button */}
        <MenuItem
          icon={<FaDollarSign />}
          onClick={() => navigate("/Tourguiderevenue")} 
        >
          View Revenue
        </MenuItem>

        {/* View Tourist Statistics Button */}
        <MenuItem
          icon={<FaChartBar />}
          onClick={() => navigate("/TourguideViewTouristStatistics")} 
        >
          View Tourist Statistics
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default TourGuideSideNav;
