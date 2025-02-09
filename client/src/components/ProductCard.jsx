import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../services/ProductService";

export default function ProductCard({ product, idx, loggedInUser, refreshProducts }) {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [productStatus, setProductStatus] = useState(product.productStatus);
    const[sales,setSales]=useState('');

    const sellerName = product.seller ? product.seller.name : 'Unknown Seller';

    const handleEditProduct = () => {
        navigate(`/sellerEditProduct/${product._id}`);
    };

    const handleArchiveProduct = async ( ) => {
        try {
            const response = await ProductService.archiveProduct(product._id);
            // setProductStatus(status);
            console.log(response);
            alert("product archived successfully!");
            refreshProducts();
           
            // console.log(`product ${product._id} is:`,productStatus);
            console.log(`product ${product._id} is archived:`,product.isArchived);
            setDropdownOpen(false);
        } catch (error) {
            console.error(`Failed to ${status} product`, error);
        }
    };

    const handleUnArchiveProduct = async (status) => {
        try {
            const response = await ProductService.unArchiveProduct(product._id);
            setProductStatus(status);
            alert("product unarchived successfully!");
             refreshProducts();
            console.log(response);
            // console.log(`product ${product._id} is:`,productStatus);
            console.log(`product ${product._id} is archived:`,product.isArchived);
            setDropdownOpen(false);
        } catch (error) {
            console.error(`Failed to ${status} product`, error);
        }
    };


    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    

    return (
        <div className="relative product-card">
            <div key={idx} className="max-w-sm bg-slate-200 border border-gray-200 rounded-lg shadow dark:bg-slate-200 dark:border-gray-700">
                
                {/* Dropdown button */}
                <div className="absolute top-2 right-2">
                    <button 
                        onClick={toggleDropdown} 
                        className="inline-flex items-center px-2 py-1 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                        ⋮
                    </button>
                    {dropdownOpen && (
                        <div className="absolute mt-2 w-24 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                                onClick={() => handleArchiveProduct('archived')}
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Archive
                            </button>
                            <button
                                onClick={() => handleUnArchiveProduct('unarchived')}
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Unarchive
                            </button>
                        </div>
                    )}
                </div>

                <a href="#">
                    <img className="rounded-t-lg" src={product.imageUrl} alt={product.name} />
                </a>
                <div className="p-5">
                    <a href="#">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-blue-800 dark:text-white">{product.name}</h5>
                    </a>
                    <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">{product.description}</p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Price: {product.price}</p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Available Quantity: {product.availableQuantity}</p>
                    {/* <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Seller: {sellerName}</p> */}
                    <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Reviews: {product.reviews.length} reviews</p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Rating: {product.rating}</p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Sales: {product.salesCount || 0}</p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">
                      Status: {product.isArchived ? "Archived" : "Unarchived"}
                     </p>

                    
                    {loggedInUser && loggedInUser.role === "Seller" && (
                        <button
                            onClick={handleEditProduct}
                            className="mt-4 mr-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-green-300"
                        >
                            Edit Product
                        </button>
                    )}

                    <div href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Read more
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </div>

                   
                </div>
            </div>
        </div>
    );
}
