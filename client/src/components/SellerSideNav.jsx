import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StoreMallDirectoryOutlinedIcon from "@mui/icons-material/StoreMallDirectoryOutlined";
import ArchiveIcon from "@mui/icons-material/Archive";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined"; // Icon for View Revenue
import { useProSidebar } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Use useNavigate for programmatic navigation

const SellerSideNav = () => {
  const { collapseSidebar } = useProSidebar();
  const currentUser = useSelector((state) => state.user.currentUser?.username || "Seller");
  const navigate = useNavigate();

  return (
    <Sidebar className="h-screen">
      <Menu>
        <MenuItem
          icon={<MenuOutlinedIcon />}
          onClick={() => {
            collapseSidebar();
          }}
          style={{ textAlign: "center" }}
        >
          <h2>{currentUser}</h2>
        </MenuItem>

        {/* Home */}
        <MenuItem icon={<HomeOutlinedIcon />} onClick={() => navigate("/SellerHome")}>
          Home
        </MenuItem>

        {/* Manage Store */}
        <MenuItem icon={<StoreMallDirectoryOutlinedIcon />} onClick={() => navigate("/SellerProducts")}>
          Manage Store
        </MenuItem>

        {/* Manage Archived Products */}
        <MenuItem icon={<ArchiveIcon />} onClick={() => navigate("/ArchiveProduct")}>
          Manage Archived Products
        </MenuItem>

        {/* Add Product */}
        <MenuItem icon={<AddBoxOutlinedIcon />} onClick={() => navigate("/sellerAddProduct")}>
          Add Product
        </MenuItem>

         {/* Create new seller */}
         <MenuItem icon={<PersonAddIcon />} onClick={() => navigate("/SellerCreate")}>
         Create New Seller
        </MenuItem>

        {/* View Revenue */}
        <MenuItem icon={<HistoryOutlinedIcon />} onClick={() => navigate("/Sellerrevenue")}>
          View Revenue
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SellerSideNav;
