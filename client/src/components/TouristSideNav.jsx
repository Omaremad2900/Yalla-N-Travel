import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined"; // Icon for Bookings
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useProSidebar } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { FaComment, FaStar } from "react-icons/fa"; // Correct import for icons
import { Link } from "react-router-dom";
import { FaBusAlt } from "react-icons/fa";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined"; // Icon for Add Address
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined"; // Icon for My Addresses

const TouristSideNav = () => {
  const { collapseSidebar } = useProSidebar();
  const currentUser = useSelector((state) => state.user.currentUser?.username || "Guest");

  return (
    <Sidebar>
      <Menu>
        {/* Collapsible Sidebar Header */}
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
          icon={<HomeOutlinedIcon />}
          component={<Link to="/TouristHome" />}
        >
          Home
        </MenuItem>

        {/* Section: "You" */}
        <div style={{ marginTop: "16px" }}>
          <h3
            style={{
              marginLeft: "16px",
              color: "gray",
              textTransform: "uppercase",
              fontSize: "12px",
            }}
          >
            You
          </h3>
          <MenuItem
            icon={<HistoryOutlinedIcon />}
            component={<Link to="/GetHistory" />}
          >
            History of Booking
          </MenuItem>
          <MenuItem
            icon={<LibraryBooksOutlinedIcon />}
            component={<Link to="/GetBookings" />}
          >
            Bookings
          </MenuItem>
          <MenuItem
            icon={<FaBusAlt />}
            component={<Link to="/Viewtransportation" />}
          >
            Booked Transportation
          </MenuItem>
          <MenuItem
            icon={<ViewModuleOutlinedIcon />}
            component={<Link to="/PurchasedProducts" />}
          >
            My Products
          </MenuItem><MenuItem
            icon={<ShoppingCartOutlinedIcon />}
            component={<Link to="/ViewOrders" />}
          >
            My Orders
          </MenuItem>
          <MenuItem
            icon={<ShoppingCartIcon />}
            component={<Link to="/Cart" />}
          >
            My Cart
          </MenuItem>

          <MenuItem
            icon={<FavoriteBorderIcon />}
            component={<Link to="/MyWishList" />}
          >
            My WishList
          </MenuItem>
          <MenuItem
            icon={<ReportProblemOutlinedIcon />}
            component={<Link to="/ComplaintsList" />}
          >
            My Complaints
          </MenuItem>
        </div>


        {/* My Addresses Button */}
        <MenuItem
          icon={<LocationOnOutlinedIcon />}
          component={<Link to="/myAddress" />}
        >
          My Addresses
        </MenuItem>

        {/* View Bookmarked Button */}
        <MenuItem
          icon={<FaStar />}
          component={<Link to="/Viewbookmarks" />}
        >
          View Bookmarked
        </MenuItem>

        {/* Section: "More For You" */}
        <div style={{ marginTop: "24px" }}>
          <h3
            style={{
              marginLeft: "16px",
              color: "gray",
              textTransform: "uppercase",
              fontSize: "12px",
            }}
          >
            More For You
          </h3>
          <MenuItem
            icon={<StorefrontOutlinedIcon />}
            component={<Link to="/TouristProducts" />}
          >
            Browse Products
          </MenuItem>
          <MenuItem
            icon={<TuneOutlinedIcon />}
            component={<Link to="/TouristChoosePreferences" />}
          >
            Set Preferences
          </MenuItem>
          
        {/* Add an Address Button */}
        <MenuItem
          icon={<AddLocationAltOutlinedIcon />}
          component={<Link to="/Createaddress" />}
        >
          Add an Address
        </MenuItem>
          <MenuItem
            icon={<FaComment />}
            component={<Link to="/TouristComplaint" />}
          >
            File Complaint
          </MenuItem>
          <MenuItem
            icon={<HelpOutlineOutlinedIcon />}
            component={<Link to="/help" />}
          >
            Help
          </MenuItem>
        </div>
      </Menu>
    </Sidebar>
  );
};

export default TouristSideNav;
