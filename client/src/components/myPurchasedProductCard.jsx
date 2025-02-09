import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa"; // import star icons
import ProductService from "../services/ProductService";

export default function MyPurchasedProductCard({ purchasedProduct, idx, loggedInUser }) {
  // Initialize the rating state with the rating from purchasedProduct
  const [rating, setRating] = useState(purchasedProduct.rating || 0); // Default to 0 if no rating exists
  const [hoverRating, setHoverRating] = useState(0); // Store the hover rating (for visual feedback)
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState(purchasedProduct.reviews || []);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [showTextarea, setShowTextarea] = useState(false); // Track whether the textarea is visible

  const sellerName = purchasedProduct.seller ? purchasedProduct.seller.username : 'Unknown Seller';
  const dateString = purchasedProduct.createdAt;
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat('en-GB').format(date);
    console.log(purchasedProduct.rating)
    console.log("Product:", purchasedProduct); // Inspect product data

  // Handle mouse hover on the star rating
  const handleMouseEnter = (index) => {
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(0); // Reset hover rating when the mouse leaves
  };

  // Handle clicking on a star
  const handleClick = (index) => {
    setRating(index + 1);
    setShowTextarea(true); // Show the textarea when a star is clicked
    setRatingSubmitted(false); // Reset submitted state if rating is changed
  };

  // Submit review
  const handleSubmitReview = async () => {
    try {
      const reviewBody = {
        rating: rating,
        comment,
       };
       const response = await ProductService.createReview(purchasedProduct._id, reviewBody);

      // Optional: Update reviews with the new review
      // const updatedReviews = [...reviews, newReview];
      // setReviews(updatedReviews);

      setRating(0);
      setComment("");
      setRatingSubmitted(true);
      setShowTextarea(false); // Hide the textarea after submitting
    } catch (error) {
      console.error("Failed to submit review", error);
    }
  };

  return (
    <div className="relative myPurchasedProduct-card">
      <div key={idx} className="max-w-sm bg-slate-200 border border-gray-200 rounded-lg shadow dark:bg-slate-200 dark:border-gray-700">
        <a href="#">
          <img className="rounded-t-lg" src={purchasedProduct.imageUrl} alt={purchasedProduct.name} />
        </a>
        <div className="p-5">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-blue-800 dark:text-white">
              {purchasedProduct.name}
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Seller: {sellerName}</p>
          <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Price: {purchasedProduct.price}</p>
          <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Purchased At: {formattedDate}</p>
          
          
          {/* Rating Stars */}
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((index) => {
              let starType = FaRegStar; // Default to empty star
              if (hoverRating > index) {
                starType = FaStar; // Filled star when hovered
              } else if (rating > index) {
                starType = FaStar; // Filled star when clicked
              }

              return (
                <span
                  key={index}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(index)}
                  className="cursor-pointer text-yellow-500"
                >
                  {React.createElement(starType)}
                </span>
              );
            })}
          </div>

          {/* Show textarea as a popup when the star rating is clicked */}
          {showTextarea && (
            <div className="mt-4 p-4 bg-white shadow-lg rounded-md absolute top-0 left-0 right-0 bottom-0 z-50 bg-opacity-90">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
                className="w-full mt-2 p-2 border rounded"
              />
              <button
                onClick={handleSubmitReview}
                className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-600"
                 disabled={ratingSubmitted}
              >
                Submit Review
              </button>
              <button
                onClick={() => setShowTextarea(false)} // Hide the textarea if canceling
                className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-500 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
