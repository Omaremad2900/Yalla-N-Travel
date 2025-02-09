import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MyPurchasedProductCard from "../components/myPurchasedProductCard"
// import TouristSideNav1 from '../components/TouristSideNav1';
import TouristSideNav from '../components/TouristSideNav';
import { ProSidebarProvider } from 'react-pro-sidebar';

const PurchasedProduct = ({ touristService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Change this as needed

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await touristService.getPurchasedProducts(currentPage, itemsPerPage);
        console.log(response);
        
        // Check if the response has a successful status and expected data structure
        if (response && response.data) {
          const orders = response.data.data; // Access the products array
          
          const pagination = response.pagination; // Access pagination details
    
          // Check if pagination details exist and bind them correctly
          const totalPages = pagination ? pagination.totalPages : 0;
    
          // Set the purchased products and pagination info
          setPurchasedProducts(orders);
          setTotalPages(totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch purchased products", error);
      }
    };
  
    fetchProducts();
  }, [touristService, currentPage, itemsPerPage]);
  

  

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <ProSidebarProvider>
      <div className="flex bg-slate-100 min-h-screen">
        <TouristSideNav/>
        <div className="w-3/4 p-6 ml-auto">
          <h3 className="text-3xl font-semibold text-slate-700 mb-6">Purchased Products</h3>

          

          {purchasedProducts.length === 0 ? (
            <p className="text-slate-600">No purchased products found</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedProducts.map((purchasedProduct, idx) => (
                <MyPurchasedProductCard key={idx} purchasedProduct={purchasedProduct} loggedInUser={loggedInUser} />
              ))}
            </ul>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-600 text-white rounded-l-lg hover:bg-slate-500"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-slate-200 text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-600 text-white rounded-r-lg hover:bg-slate-500"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </ProSidebarProvider>
  );
};

export default PurchasedProduct;
