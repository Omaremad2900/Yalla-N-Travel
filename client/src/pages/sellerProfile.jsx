import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SellerSideNav from '../components/SellerSideNav';
import { ProSidebarProvider } from 'react-pro-sidebar';
import sellerService from '../services/sellerService';

const sellerProfile = ({  }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: 0,
    available: true,
    sellerId: loggedInUser.id,
  });
  const [sellerInfo, setSellerInfo] = useState({
    name: loggedInUser.username || '',
    email: loggedInUser.email || '',
    phone: loggedInUser.mobile || '',
    address: loggedInUser.address || '',
    image:loggedInUser.image || '',
  });


  // Fetch existing products on component mount
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const existingProducts = await sellerService.getProducts(loggedInUser.id);
  //       setProducts(existingProducts);
  //     } catch (error) {
  //       console.error('Error fetching products:', error.message);
  //     }
  //   };

  //   fetchProducts();
  // }, [loggedInUser.id, sellerService]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateSellerInfo = async (e) => {
    e.preventDefault();
    try {
      const updatedSeller = await sellerService.updateSellerInfo(loggedInUser.id, sellerInfo);
      setSellerInfo(updatedSeller);
      console.log('Seller profile updated successfully');
    } catch (error) {
      console.error('Error updating seller info:', error.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = await sellerService.addProduct(productDetails);
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      // Reset form after successful submission
      setProductDetails({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: 0,
        available: true,
        sellerId: loggedInUser.id,
      });
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const success = await sellerService.deleteProduct(id);
      if (success) {
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };
  const handleProfilePicChange= async ()=>{
    try{

    }
    catch{

    }
  };

  return (
   

<div className="flex min-h-screen bg-slate-100">
  <ProSidebarProvider>
    <SellerSideNav /> {/* Sidebar Component */}
  </ProSidebarProvider>

  <div className="flex-1 flex items-center justify-center">
    <div className="bg-slate-200 p-8 rounded-lg shadow-md max-w-lg w-full mt-10">
      <h2 className="text-2xl font-bold text-slate-700 mb-6 text-center">
        Seller Profile
      </h2>

      {/* Seller Information Update Form */}
      <form onSubmit={handleUpdateSellerInfo} className="space-y-4">
        <div>
          <label className="block text-blue-800 font-bold mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={sellerInfo.username}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="border-2 border-slate-600 rounded-md p-3 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-blue-800 font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={sellerInfo.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="border-2 border-slate-600 rounded-md p-3 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-blue-800 font-bold mb-2" htmlFor="phone">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={sellerInfo.mobile}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="border-2 border-slate-600 rounded-md p-3 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-blue-800 font-bold mb-2" htmlFor="address">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={sellerInfo.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="border-2 border-slate-600 rounded-md p-3 w-full"
            required
          />
        </div>

        {/* Profile Picture Section */}
        <div>
          <label className="block text-blue-800 font-bold mb-2">
            Profile Picture
          </label>
          {sellerInfo.image ? (
            <img
              src={sellerInfo.image}
              alt="Profile Preview"
              className="mt-2 h-40 w-40 object-cover rounded-full mx-auto"
            />
          ) : (
            <p className="mt-2 text-slate-500 text-center">No profile picture uploaded</p>
          )}
          
          <input
            type="file"
            name="profilePic"
            onChange={handleProfilePicChange}
            className="border-2 border-slate-600 rounded-md p-3 w-full mt-4"
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-700 text-white p-3 rounded-md hover:bg-slate-600 transition duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  </div>
</div>


  );
};

export default sellerProfile;
