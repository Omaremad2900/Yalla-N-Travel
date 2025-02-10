import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../services/ProductService";
import { FaStar } from "react-icons/fa";
import {FaHeart } from "react-icons/fa"; // Import the heart icon
import touristService from "../services/touristService";

export default function ProductCard({ product, idx, loggedInUser, currency }) {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [productStatus, setProductStatus] = useState(product.productStatus);
    const [review, setReview] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false);
    const [quantity, setQuantity] = useState(0); // Initialize quantity state with 0
    const [wishlistHover, setWishlistHover] = useState(false); // Wishlist hover state
    const [isWishlistAdded, setIsWishlistAdded] = useState(false); // State to track if the product is in the wishlist

    const sellerName = product.seller ? product.seller.username : 'Unknown Seller';

    const handleEditProduct = () => {
        navigate(`/sellerEditProduct/${product._id}`);
    };

    const handleArchiveProduct = async (status) => {
        try {
            const response = await ProductService.archiveProduct(product._id);
            setProductStatus(status);
            setDropdownOpen(false);
        } catch (error) {
            console.error(`Failed to ${status} product`, error);
        }
    };

    const handleUnArchiveProduct = async (status) => {
        try {
            const response = await ProductService.unArchiveProduct(product._id);
            setProductStatus(status);
            setDropdownOpen(false);
        } catch (error) {
            console.error(`Failed to ${status} product`, error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleAddToCart = async () => {
        try {
            const response = await touristService.addItemToCart(product._id, quantity );
            console.log(`adding to cart : ${product._id}`);
            console.log(response);
            alert("Successfully added to cart");
        } catch (error) {
            console.error(`Failed to add to cart  ${product._id}`, error);
            alert("failed to add to cart")
        }
    };

    const handleAddToWishlist = async( ) => {
        // console.log("Added to wishlist:", product.name);
        try{
            const response= await touristService.addProductToMyWishList(product._id );
            //setIsWishlistAdded((prev) => !prev); // Toggle the wishlist state
            console.log(`adding to wishlist : ${product._id}`)
        } catch(error){
            console.error(`Failed to add to wishlist  ${product._id}`, error)
        }
    };


    const handleIncreaseQuantity = async () => {
        if (quantity < product.availableQuantity) {
            const newQuantity=quantity+1;
            setQuantity(newQuantity);
        }
        console.log(quantity);
       
    };
   

    const handleDecreaseQuantity = async () => {
        if (quantity > 0) {
            const newQuantity=quantity-1;
            setQuantity(newQuantity);
        }
        console.log(quantity);
       
    };


    const toggleComments = () => {
        setShowAllComments(!showAllComments);
    };

    useEffect(() => {
        const getReview = async () => {
            try {
                const response = await ProductService.getReview(product._id);
                if (response.success) {
                    setReview(response.data);
                }
            } catch (error) {
                console.error("Failed to get product's review ", error);
            }
        };
        getReview();
    }, [product._id]);

    const StarRating = ({ rating }) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, index) => (
                    <FaStar
                        key={index}
                        color={index < rating ? "#FFD700" : "#e4e5e9"}
                        size={20}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="relative product-card">
            <div key={idx} className="max-w-sm bg-slate-200 border border-gray-200 rounded-lg shadow dark:bg-slate-200 dark:border-gray-
-700">
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

 {/* Wishlist Icon */}
 <div
                className="absolute top-2 left-2 text-gray-500 hover:text-red-500 cursor-pointer"
                onMouseEnter={() => setWishlistHover(true)}
                onMouseLeave={() => setWishlistHover(false)}
                onClick={() => {
                    setIsWishlistAdded((prev) => !prev); // Toggle the wishlist state
                    handleAddToWishlist(); // Call the wishlist function
                }}
            >
                 <FaHeart
        size={20}
        color={isWishlistAdded ? "red" : "gray"} // Change color based on isWishlistAdded
    />
    {wishlistHover && !isWishlistAdded && (
        <div className="absolute top-full left-0 mt-1 text-xs bg-white text-black py-1 px-2 rounded shadow-lg">
            Add to wishlist
        </div>
    )}
    {wishlistHover && isWishlistAdded && (
        <div className="absolute top-full left-0 mt-1 text-xs bg-white text-black py-1 px-2 rounded shadow-lg">
            Remove from wishlist
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
    <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Price: {product.price} {currency}</p>
    <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Available Quantity: {product.availableQuantity}</p>
    <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Seller: {sellerName}</p>
    
    {/* Star rating */}
    <div className="mb-3">
        <span className="font-normal text-gray-700 dark:text-slate-500">Rating: </span>
        <StarRating rating={product.rating} />
    </div>

    {/* Reviews */}
    <div className="mb-3 font-normal text-gray-700 dark:text-slate-500">
        <span>Reviews:</span>
        {review.slice(0, showAllComments ? review.length : 3).map((review, index) => (
            <p key={index} className="mt-1 text-gray-600 border-b pb-1">
                {review.comment}
            </p>
        ))}
        {review.length > 3 && (
            <button
                onClick={toggleComments}
                className="text-blue-500 text-sm mt-2"
            >
                {showAllComments ? "Show Less" : "Show More"}
            </button>
        )}
    </div>

    {/* Quantity Controls */}
    <div className="flex items-center mb-3">
                        <button
                            onClick={handleDecreaseQuantity}
                            disabled={quantity === 0}
                            className={`px-3 py-1 bg-gray-600 text-white rounded-l ${
                                quantity === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-400"
                            }`}
                        >
                            -
                        </button>
                        <span className="px-4 py-1 bg-gray-200 text-gray-800">{quantity}</span>
                        <button
                            onClick={handleIncreaseQuantity}
                            disabled={quantity === product.availableQuantity}
                            className={`px-3 py-1 bg-gray-600 text-white rounded-r ${
                                quantity === product.availableQuantity
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-green-400"
                            }`}
                        >
                            +
                        </button>
                    </div>

    <button
        onClick={handleAddToCart}
        className="mt-4 mr-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-green-300"
    >
        Add to cart
    </button>

    <a
        href="#"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
        Read more
        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
        </svg>
    </a>
</div>
</div>
</div>
);
}
