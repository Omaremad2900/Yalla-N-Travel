import React, { useState, useRef, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaLandmark, FaMonument, FaHome, FaBars } from "react-icons/fa"; // Updated icon imports

const TourismSidenav = () => {
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
        setIsCollapsed(true); // Collapse the sidebar when clicking outside
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
              <div className="flex items-center justify-center">
                <h2>{currentUser}</h2>
              </div>
            </MenuItem>

            <MenuItem icon={<FaHome />} onClick={() => navigate("/TourismgovernerHome")}>
              Home
            </MenuItem>
            <MenuItem icon={<FaLandmark />} onClick={() => navigate("/museums")}>
              Museums
            </MenuItem>
            <MenuItem icon={<FaMonument />} onClick={() => navigate("/historical-places")}>
              Historical Places
            </MenuItem>
            <MenuItem icon={<FaLandmark />} onClick={() => navigate("/Createmuseum")}>
              Host Museum Event
            </MenuItem>
            <MenuItem icon={<FaMonument />} onClick={() => navigate("/add-place")}>
              Host Historical Event
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

export default TourismSidenav;
