import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SideNav from '../components/TouristSideNav';

const RateAndCommentPageAC = ({ touristService }) => {
  const location = useLocation();
  const { activity } = location.state || {};

  // State for rating, comment, and feedback
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [commentSuccess, setCommentSuccess] = useState('');

  if (!activity) return <p>No Activity data available.</p>;

  // Handle rating submission
  const handleRateSubmit = async () => {
    try {
      setRatingError('');
      setRatingSuccess('');

      if (rating < 1 || rating > 5) {
        setRatingError('Please select a rating between 1 and 5 stars.');
        return;
      }

      await touristService.rateActivity(activity._id, rating);
      setRatingSuccess('Rating submitted successfully!');
      setRating(0); // Reset the stars
    } catch (error) {
      setRatingError(error.message || 'An error occurred while submitting the rating.');
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    try {
      setCommentError('');
      setCommentSuccess('');

      if (!comment.trim()) {
        setCommentError('Please enter a comment.');
        return;
      }

      await touristService.commentActivity(activity._id, comment);
      setCommentSuccess('Comment submitted successfully!');
      setComment(''); // Clear the comment box
    } catch (error) {
      setCommentError(error.message || 'An error occurred while submitting the comment.');
    }
  };

  return (
    <div className="flex bg-gray-50">
      <SideNav />
      <div className="flex-1 bg-gray-50 rounded-lg shadow-md"></div>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Rate and Comment on Activity</h1>

      {/* Activity Details */}
      <div className="border p-4 rounded shadow-sm mb-6">
        <h2 className="text-xl font-semibold">{activity.name}</h2>
        <p><strong>Date:</strong> {activity.dateTime}</p>
        <p><strong>Ratings:</strong> {activity.ratings}</p>
        
        
      </div>

      {/* Rating Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Rate This Activity</h3>
        <div className="flex space-x-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
        {ratingError && <p className="text-red-500">{ratingError}</p>}
        <button
          onClick={handleRateSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit Rating
        </button>
        {ratingSuccess && <p className="text-green-500 mt-2">{ratingSuccess}</p>}
      </div>

            {/* Existing Comments */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Existing Comments</h3>
        {activity.comments && activity.comments.length > 0 ? (
          <ul className="list-disc pl-6">
            {activity.comments.map((commentObj, index) => (
              <li key={index} className="mb-2">
                <p><strong>{commentObj.username}:</strong> {commentObj.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments available for this Activity.</p>
        )}
      </div>

      {/* Comment Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Leave a Comment</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          placeholder="Write your comment here..."
          className="w-full p-2 border border-gray-300 rounded mb-2"
        ></textarea>
        {commentError && <p className="text-red-500">{commentError}</p>}
        <button
          onClick={handleCommentSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit Comment
        </button>
        {commentSuccess && <p className="text-green-500 mt-2">{commentSuccess}</p>}
      </div>
    </div>
  </div>
  );
};

export default RateAndCommentPageAC;
