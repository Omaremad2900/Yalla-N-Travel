import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import CartCard from "../components/CartCard";
// import TouristSideNav1 from '../components/TouristSideNav1';
import TouristSideNav from '../components/TouristSideNav';
import { ProSidebarProvider } from 'react-pro-sidebar';

const Cart = ({ touristService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [cartProducts, setCartProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [touristService]);

  const fetchProducts = async () => {
    try {
      const response = await touristService.getProductsInMyCart();
      console.log(response);
      
      // Check if the response has a successful status and expected data structure
      if (response) {
        const orders = response.products; // Access the products array
        // Set the purchased products and pagination info
        setCartProducts(orders);
      }
    } catch (error) {
      console.error("Failed to fetch products in cart", error);
    }
  };

  const refreshCart = () => {
    fetchProducts();
  };

  // Handle proceed to checkout button click
  const handleProceedToCheckout = () => {
    // Navigate to the checkout page
    navigate('/PayCart');  // Change this to your actual checkout route
  };

  return (
    <ProSidebarProvider>
      <div className="flex bg-slate-100 min-h-screen">
        <TouristSideNav/>
        <div className="w-3/4 p-6 ml-auto relative">
          {/* Proceed to Checkout Button */}
          <button 
            onClick={handleProceedToCheckout} 
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 absolute top-6 right-6"
          >
            Proceed to Checkout
          </button>

          <h3 className="text-3xl font-semibold text-slate-700 mb-6">My Cart</h3>

          {cartProducts.length === 0 ? (
            <p className="text-slate-600">No products in cart</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartProducts.map((cartProduct, idx) => (
                <CartCard 
                  key={idx} 
                  cartProduct={cartProduct} 
                  loggedInUser={loggedInUser} 
                  refreshCart={refreshCart} // Pass refreshCart as a prop
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </ProSidebarProvider>
  );
};

export default Cart;