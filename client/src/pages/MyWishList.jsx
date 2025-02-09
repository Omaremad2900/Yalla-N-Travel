import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProductCardTourist from "../components/ProductCardTourist"
import WishListCard from "../components/WishListCard"
import TouristSideNav from '../components/TouristSideNav';
import { ProSidebarProvider } from 'react-pro-sidebar';

const MyWishList = ({ touristService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [wishListProducts, setwishListProducts] = useState([]);
 
  const itemsPerPage = 10; // Change this as needed

  useEffect(() => {
    fetchProducts();
  }, [touristService]);

 
    const fetchProducts = async () => {
      try {
        const response = await touristService.getProductsInMyWishList( );
        console.log(response);
        // console.log(response.data);
        console.log(response.products);
        // console.log(response.data.data);
        // Check if the response has a successful status and expected data structure
        if (response && response.products) {
          const orders = response.products; // Access the products array
         
    
          
    
          // Set the purchased products and pagination info
          setwishListProducts(orders);
          console.log(wishListProducts);
          
        }
      } catch (error) {
        console.error("Failed to fetch products in cart", error);
      }
    };

  //implement refresh list
  const refreshWishList = () => {
    fetchProducts();
  };

  
  // Handle proceed to checkout button click
  const handleProceedToCheckout = () => {
    // Navigate to the checkout page
    navigate('/checkout');  // Change this to your actual checkout route
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

          <h3 className="text-3xl font-semibold text-slate-700 mb-6">My WishList</h3>

          {wishListProducts.length === 0 ? (
            <p className="text-slate-600">No products in wishlist</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishListProducts.map((wishListProduct, idx) => (
                <WishListCard key={idx} wishListProduct={wishListProduct} loggedInUser={loggedInUser} 
                refreshWishList={refreshWishList}
                />
              ))}
            </ul>
          )}

        
        </div>
      </div>
    </ProSidebarProvider>
  );
};

export default MyWishList;
