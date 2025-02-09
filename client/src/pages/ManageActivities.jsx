import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import advertiserService from '../services/advertiserService';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import AdvertiserSideNav from "../components/advertiserSidenav";

const ManageActivities = () => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [activities, setActivities] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [formDetails, setFormDetails] = useState({
    name: '',
    dateTime: '',
    location: { type: 'Point', coordinates: [0, 0] },
    price: 0,
    category: '',
    tags: [],
    specialDiscounts: '',
    isBookingOpen: false,
    ratings: 0,
    availableTickets: 0,
    pictures: [],
  });
  const [preview, setPreview] = useState([]);

  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await advertiserService.getMyActivities(pagination.page, pagination.limit);
        setActivities(response.docs || []);
      } catch (error) {
        console.error('Error fetching activities:', error.message);
      }
    };

    const fetchTagsAndCategories = async () => {
      try {
        const [tagsData, categoriesData] = await Promise.all([
          advertiserService.getAllPreferenceTags(),
          advertiserService.getAllCategories(),
        ]);
        setAvailableTags(tagsData.tags);
        setAvailableCategories(categoriesData.data);
      } catch (error) {
        console.error('Error fetching tags or categories:', error.message);
      }
    };

    fetchActivities();
    fetchTagsAndCategories();
  }, [pagination]);

  const handleDeleteActivity = async (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await advertiserService.deleteActivity(id);
        setActivities((prev) => prev.filter((activity) => activity._id !== id));
      } catch (error) {
        console.error('Error deleting activity:', error.message);
      }
    }
  };
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  const handleInputChange = (e) => {
    const { name,  type,value ,checked} = e.target;
    if (name === 'tags') {
      const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
      setFormDetails((prev) => ({ ...prev, tags: selectedTags }));
    } else {
      setFormDetails((prevDetails) => ({
        ...prevDetails,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };
  const handleEditClick = (activity) => {
    setCurrentActivity(activity);
    setFormDetails({
      name: activity.name || '',
      dateTime: activity.dateTime || '',
      location: activity.location || { type: 'Point', coordinates: [0, 0] },
      price: activity.price || 0,
      category: activity.category.name || '',
      tags: activity.tags.map(tag => tag.name) || [],
      specialDiscounts: activity.specialDiscounts || '',
      isBookingOpen: activity.isBookingOpen || false,
      ratings: activity.ratings || 0,
      availableTickets: activity.availableTickets || 0,
      pictures: [],  // Clear out the pictures field for new uploads
    });
    setPreview(activity.pictures || []);  // Set preview to existing pictures
    setIsEditing(true);
  };
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFormDetails((prevDetails) => ({
        ...prevDetails,
        pictures: selectedFiles,  // Only include new files for upload
      }));
  
      // Generate previews for the new files
      const filePreviews = selectedFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            resolve(reader.result);
          };
        });
      });
  
      Promise.all(filePreviews).then((results) => {
        setPreview((prevPreview) => [...prevPreview, ...results]);  // Add new previews to existing previews
      });
    }
  };
  
  const handleUpdateActivity = async (e) => {
    e.preventDefault();
    try {
      let imageUrls = [];
      
      // Upload only if there are new pictures to be added
      if (formDetails.pictures.length > 0) {
        const uploadFormData = new FormData();
        formDetails.pictures.forEach((file) => {
          uploadFormData.append('activity-picture', file);
        });
  
        // Assume `uploadPictures` returns an array of URLs for the uploaded pictures
        imageUrls = await advertiserService.uploadPictures(uploadFormData);
      }
  
      console.log(formDetails);
      const updatedActivity = await advertiserService.updateActivity(currentActivity._id, {
        ...formDetails,
        pictures: [...preview, ...imageUrls],  // Combine existing and new image URLs
      });
  
      setActivities((prev) => prev.map((activity) => activity._id === updatedActivity._id ? updatedActivity : activity));
      setIsEditing(false);
      setCurrentActivity(null);
      resetForm();
    } catch (error) {
      console.error('Error updating activity:', error.message);
    }
  };
  
  const resetForm = () => {
    setFormDetails({
      name: '',
      dateTime: '',
      location: { type: 'Point', coordinates: [0, 0] },
      price: 0,
      category: '',
      tags: [],
      specialDiscounts: '',
      isBookingOpen: false,
      ratings: 0,
      availableTickets: 0,
      pictures: [],
    });
    setPreview([]);
  };
  
  const handleNextPage = () => setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
  const handlePreviousPage = () => setPagination((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }));

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <AdvertiserSideNav className="w-1/4 bg-white p-4 shadow-lg" />

      {/* Main Content */}
      <div className="flex-1 flex justify-center pt-10 px-4 bg-gray-100">
        <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-2xl text-slate-700 font-semibold mb-6 border-b-2 pb-2">My Activities</h3>

          {isEditing && (
            <form onSubmit={handleUpdateActivity} className="mb-6 p-4 border rounded-md">
              <h4 className="text-lg font-semibold mb-2">Edit Activity</h4>
            <input
              type="text"
              name="name"
              value={formDetails.name}
              onChange={handleInputChange}
              placeholder="Activity Name"
              required
              className="border p-2 w-full mb-2"
            />
            <input
              type="datetime-local"
              name="dateTime"
              value={formatDateTime(formDetails.dateTime)}
              onChange={handleInputChange}
              required
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              name="price"
              value={formDetails.price}
              onChange={handleInputChange}
              placeholder="Price"
              required
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              name="availableTickets"
              value={formDetails.availableTickets}
              onChange={handleInputChange}
              placeholder="Available Tickets"
              className="border p-2 w-full mb-2"
            />
            <select
              name="category"
              value={formDetails.category}
              onChange={handleInputChange}
              className="border p-2 w-full mb-2"
              required
            >
              <option value="" disabled>Select Category</option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              name="tags"
              multiple
              value={formDetails.tags}
              onChange={handleInputChange}
              className="border p-2 w-full mb-2"
            >
              {availableTags.map((tag) => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
            <textarea
              name="specialDiscounts"
              value={formDetails.specialDiscounts}
              onChange={handleInputChange}
              placeholder="Special Discounts"
              className="border p-2 w-full mb-2"
            />
            <label className="block text-sm font-medium text-gray-700">Is Booking Open?</label>
            <input
              type="checkbox"
              name="isBookingOpen"
              checked={formDetails.isBookingOpen}
              onChange={handleInputChange}
              className="mt-1"
            />
            
            <label className="block text-sm font-medium text-gray-700">Upload Pictures:</label>
            <input
              type="file"
              name="pictures"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="mt-2 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            />
            
            {preview.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-4">
                {preview.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-40 w-full object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            )}

            <div className="flex space-x-4 mt-4">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                Update Activity
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">
                Cancel
              </button>
            </div>
          </form>
        )}

<ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity._id} className="bg-white p-4 rounded-lg shadow">
                <div className="font-bold text-lg text-blue-800">{activity.name}</div>
                <div className="mt-2 flex space-x-4">
                  <button
                    onClick={() => handleEditClick(activity)}
                    className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    <FaEdit className="mr-2" /> Edit Activity
                  </button>
                  <button
                    onClick={() => handleDeleteActivity(activity._id)}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                  >
                     Delete Activity
                  </button>
                </div>
              </li>
            ))}
          </ul>

        
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePreviousPage}
              className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
              disabled={pagination.page <= 1}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageActivities;
