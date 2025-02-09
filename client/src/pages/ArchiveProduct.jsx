import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from "../components/ProductCard";
import SellerSideNav from '../components/SellerSideNav';
import { ProSidebarProvider } from 'react-pro-sidebar';
import ProductService from '../services/ProductService';



const ArchiveProduct = ( ) => {
    const loggedInUser = useSelector((state) => state.user.currentUser);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productStatus,setProductStatus]= useState(products.productStatus);
    const itemsPerPage = 10; // Change this as needed
   // const [archivedProducts, setArchivedProducts]= useState([]);
    
   useEffect(() => {
    fetchProducts();
  }, [ProductService, currentPage,productStatus]);


     // View archived products
    
      const fetchProducts = async () => {
        try {
          const response = await ProductService.getAllProducts(currentPage, itemsPerPage,'archived');
          if (response.success) {
            console.log(response)
            setProducts(response.data.products.products || []);
          
            setTotalPages(response.data.products.pagination.totalPages);
          }
        } catch (error) {
          console.error("Failed to fetch products", error);
        }
      };
     

    //refresh list
    const refreshArchivedProducts = () => {
      fetchProducts();
    };

    const handlePageChange = (page) => {
      if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
      }
    };
  
    
    return(
        <ProSidebarProvider>
        <div className="flex bg-slate-100 min-h-screen">
            <SellerSideNav />
            <div className="w-3/4 p-6 ml-auto">
        <h3 className="text-3xl font-semibold text-slate-700 mb-6">Archived Products</h3>

        {products.length === 0 ? (
          <p className="text-slate-600">No products found</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <ProductCard key={idx} product={product} loggedInUser={loggedInUser} 
              refreshArchivedProducts={refreshArchivedProducts}/> 
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
export default ArchiveProduct;