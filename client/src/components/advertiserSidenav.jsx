import React, { useState, useRef, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { FaBars, FaBriefcase, FaEye, FaHome, FaCar, FaDollarSign,FaChartLine  } from "react-icons/fa"; // Added FaDollarSign for revenue
import { useNavigate } from "react-router-dom";

const AdvertiserSideNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser?.username || "Guest");
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Close sidebar if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (event.target.closest("form")) {
          return;
        }
        setIsCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex bg-gray-50">
      <div ref={sidebarRef}>
        <Sidebar collapsed={isCollapsed} style={{ height: "100vh" }}>
          <Menu>
            <MenuItem
              icon={<FaBars />}
              onClick={handleCollapseToggle}
              style={{ textAlign: "center" }}
            >
              <h2>{currentUser}</h2>
            </MenuItem>

            <MenuItem icon={<FaBriefcase />} onClick={() => navigate("/Createactivity")}>
              Launch New Activity
            </MenuItem>
            <MenuItem icon={<FaEye />} onClick={() => navigate("/Manageactivities")}>
              View Activities
            </MenuItem>
            <MenuItem icon={<FaCar />} onClick={() => navigate("/Createtransportation")}>
              Create Transportation
            </MenuItem>
            <MenuItem icon={<FaHome />} onClick={() => navigate("/AdvertiserHome")}>
              Home
            </MenuItem>

            {/* View Revenue Button */}
            <MenuItem icon={<FaDollarSign />} onClick={() => navigate("/AdvertiserRevenue")}>
              View Revenue
            </MenuItem>
           
            <MenuItem icon={<FaChartLine  />} onClick={() => navigate("/AdvertiserViewTouristStatistics")}>
              View Tourist Statistics
            </MenuItem>

          </Menu>
        </Sidebar>
      </div>

      <div className="flex-1 bg-gray-50 rounded-lg shadow-md">
        {/* Placeholder for main content */}
      </div>
    </div>
  );
};

export default AdvertiserSideNav;
