import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {  GoogleMap, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import AdvertiserSideNav from "../components/advertiserSidenav";
const CreateActivity = ({ advertiserService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [activities, setActivities] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [activityDetails, setActivityDetails] = useState({
    name: '',
    dateTime: '',
    location: {
      type: 'Point',
      coordinates: [0, 0],
    },
    price: 0,
    category: '',
    tags: [],
    specialDiscounts: '',
    isBookingOpen: false,
    ratings: 0,
    availableTickets: 0,
    pictures: []
  });

  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    const fetchTagsAndCategories = async () => {
      try {
        const [fetchedTags, fetchedCategories] = await Promise.all([
          advertiserService.getAllPreferenceTags(),
          advertiserService.getAllCategories(),
        ]);
        setAvailableTags(fetchedTags.tags);
        setAvailableCategories(fetchedCategories.data);
      } catch (error) {
        console.error('Error fetching tags or categories:', error.message);
      }
    };
    fetchTagsAndCategories();
  }, [advertiserService]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'tags') {
      const selectedTagIds = Array.from(e.target.selectedOptions).map(option => option.value);
      setActivityDetails((prev) => ({
        ...prev,
        tags: selectedTagIds,
      }));
    } else {
      setActivityDetails((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to array
    if (selectedFiles.length > 0) {
      setActivityDetails((prevDetails) => ({
        ...prevDetails,
        pictures: selectedFiles, // Store multiple files in the state
      }));
  
      // Generate previews for all selected files
      const filePreviews = selectedFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            resolve(reader.result); // Resolve the promise with the file result
          };
        });
      });
  
      // Wait until all file previews are generated
      Promise.all(filePreviews).then((results) => {
        setPreview(results); // Update preview with all generated file previews
      });
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const uploadFormData = new FormData();
      activityDetails.pictures.forEach((file) => {
        uploadFormData.append('activity-picture', file);
      });

      const imageUrls = await advertiserService.uploadPictures(uploadFormData);

      const newActivity = await advertiserService.createActivity({
        ...activityDetails,
        location: {
          ...activityDetails.location,
          coordinates: [selectedLocation.lng, selectedLocation.lat],
        },
        advertiser_id: loggedInUser.id,
        pictures: imageUrls
      });

      setActivities((prev) => [...prev, newActivity]);
      setActivityDetails({
        name: '',
        dateTime: '',
        location: { type: 'Point', coordinates: [0, 0] },
        price: 0,
        category: '',
        tags: [],
        specialDiscounts: '',
        isBookingOpen: false,
        ratings: 0,
        availableTickets: 0
      });
      setSelectedLocation({ lat: 0, lng: 0 });

      // Show success alert
      alert('Activity created successfully!');

      // Redirect to ManageActivities after successful creation
      navigate("/ManageActivities");
    } catch (error) {
      console.error('Error adding activity:', error.message);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }

      // Show error alert
      alert('Failed to create activity. Please try again.');
    }
  };

  const mapContainerStyle = { height: '400px', width: '100%' };

  const onMapClick = (event) => {
    setSelectedLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <AdvertiserSideNav />
      <div className="flex-1 p-6 bg-white rounded-lg shadow-md mx-4 my-4 max-w-full">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Activity</h3>
      <form onSubmit={handleAddActivity} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            value={activityDetails.name}
            onChange={handleInputChange}
            placeholder="Activity Name"
            required
            className="border border-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="datetime-local"
            name="dateTime"
            value={activityDetails.dateTime}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="w-full h-96 mt-6">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={selectedLocation}
              zoom={10}
              onClick={onMapClick}
            >
              <Marker position={selectedLocation} />
            </GoogleMap>

        </div>

        <div className="mt-4">
          <input
            type="text"
            name="locationCoordinates"
            value={`${selectedLocation.lng}, ${selectedLocation.lat}`}
            readOnly
            className="border border-gray-300 rounded-md p-4 w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <input
            type="number"
            name="price"
            value={activityDetails.price}
            onChange={handleInputChange}
            placeholder="Price"
            required
            className="border border-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <select
            name="category"
            value={activityDetails.category}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>Select Category</option>
            {availableCategories.map((category, index) => (
              <option key={category.id || `category-${index}`} value={category.id}>{category.name}</option>
            ))}
          </select>

          <select
            name="tags"
            multiple
            value={activityDetails.tags}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {availableTags.map((tag, index) => (
              <option key={tag.id || `tag-${index}`} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </div>

        <textarea
          name="specialDiscounts"
          value={activityDetails.specialDiscounts}
          onChange={handleInputChange}
          placeholder="Special Discounts"
          className="border border-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            name="isBookingOpen"
            checked={activityDetails.isBookingOpen}
            onChange={handleInputChange}
            className="mr-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-gray-700">Booking Open</span>
        </div>

        <input
          type="number"
          name="availableTickets"
          value={activityDetails.availableTickets}
          onChange={handleInputChange}
          placeholder="Available Tickets"
          required
          className="border border-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 mt-6"
        />
              <div>
        <label className="block text-sm font-medium text-gray-700">Upload Pictures:</label>
        <input
          type="file"
          name="pictures"
          onChange={handleFileChange}
          accept="image/*"
          multiple // Allow multiple file uploads
          className="mt-2 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
        />
  
        {/* Render multiple previews */}
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
      </div>
      <div className="mb-4 text-center">
        <button type="submit" className="bg-slate-700 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
          Create Activity
          </button>
      </div>

      </form>
    </div>
    </div>
  );
};

export default CreateActivity;
