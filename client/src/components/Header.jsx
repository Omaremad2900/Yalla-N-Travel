import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from "../redux/user/userSlice";
import Logo from "./Logo";
import "../assets/styles.css";
import { FaBell, FaUserCircle, FaInfoCircle, FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { SocketContext } from "../utils/SocketContext"; // Import context

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false); // Separate state for notification dropdown
  const [isNewNotification, setIsNewNotification] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null); // Ref for notification dropdown

  const currentUser = useSelector((state) => state.user.currentUser);
  const { notifications } = useContext(SocketContext); // Get notifications from context

  // Mark notifications as "new" when they are received
  useEffect(() => {
    if (notifications.length > 0) {
      setIsNewNotification(true);
    }
  }, [notifications]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    };

    // Add event listener to detect outside clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      dispatch(signOutUserSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleProfileNavigation = () => {
    if (currentUser) {
      const role = currentUser.role;
      switch (role) {
        case "Advertiser":
          navigate(currentUser.isCompleted ? "/AdvertiserRead" : "/AdvertiserCreate");
          break;
        case "Seller":
          navigate(currentUser.isCompleted ? "/SellerRead" : "/SellerCreate");
          break;
        case "Tour Guide":
          navigate(currentUser.isCompleted ? "/TourguideRead" : "/TourguideCreate");
          break;
        case "Tourist":
          navigate("/TouristRead");
          break;
        case "Admin":
          navigate("/AdminRead");
          break;
        case "Tourism Governor":
          navigate("/TourismGovernorRead");
          break;
        default:
          navigate("/Profile");
      }
    }
  };

  const handleNotificationClick = () => {
    setNotificationDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };
  
  // Clear the notification alert when the dropdown is opened
  useEffect(() => {
    if (isNotificationDropdownOpen) {
      setIsNewNotification(false);
    }
  }, [isNotificationDropdownOpen]);
  
  return (
    <header className="header-bg shadow-md h-[90px] sm:h-[70px] py-[5px]">
      <div className="flex justify-between items-center max-w-6xl mx-auto h-full px-4">
        {/* Logo */}
        <div className="header-logo">
          <Logo />
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-2 text-sm sm:text-xs">
          {/* User Profile Icon */}
          {currentUser && (
            <FaUserCircle
              className="text-slate-500 hover:text-slate-700 cursor-pointer text-2xl"
              onClick={handleProfileNavigation}
            />
          )}

          <Link to="/about">
            <li className="p-1 text-slate-500 hover:text-slate-700">
              <FaInfoCircle className="text-xl" />
            </li>
          </Link>

          {currentUser ? (
            <li className="p-1 text-slate-500 hover:text-slate-700 cursor-pointer" onClick={handleSignOut}>
              <FaSignOutAlt className="text-xl" />
            </li>
          ) : (
            <>
              <Link to="/sign-in">
                <li className="p-1 text-slate-500 hover:text-slate-700">
                  <FaSignInAlt className="text-xl" />
                </li>
              </Link>

              <div className="relative inline-block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none"
                >
                  <FaUserPlus className="text-xl" />
                </button>
                {isDropdownOpen && (
                  <ul className="absolute right-0 w-48 bg-white border border-slate-300 rounded-md shadow-lg mt-2 py-2 z-20">
                    <Link to="/sign-up" onClick={handleDropdownClose}>
                      <li className="px-4 py-2 hover:bg-blue-50 text-slate-600 cursor-pointer">
                        As Tourist
                      </li>
                    </Link>
                    <Link to="/sign-up-guest" onClick={handleDropdownClose}>
                      <li className="px-4 py-2 hover:bg-green-50 text-slate-600 cursor-pointer">
                        As Tour guide/Advertiser/Seller
                      </li>
                    </Link>
                  </ul>
                )}
              </div>
            </>
          )}
        </ul>

        {/* Notification Icon */}
        <div className="flex items-center space-x-4 absolute top-5 right-12" ref={notificationRef}>
          {/* Bell Icon */}
          <FaBell
            className="text-slate-500 hover:text-slate-700 cursor-pointer text-xl"
            onClick={handleNotificationClick}
          />

          {/* Notification Alert */}
          {isNewNotification && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              !
            </span>
          )}

          {/* Dropdown for Notifications */}
          {isNotificationDropdownOpen && (
            <ul className="absolute top-full right-0 w-64 bg-white border border-slate-300 rounded-md shadow-lg mt-2 py-2 z-10 max-h-60 overflow-y-auto">
              {notifications.map((notification, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-blue-50 text-slate-600 cursor-pointer"
                  onClick={() => setNotificationDropdownOpen(false)} // Optional: Close dropdown on notification click
                >
                  {notification.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
