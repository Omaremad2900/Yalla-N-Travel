import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GoogleMap, Marker } from '@react-google-maps/api';
import TourGuideSideNav from '../components/SidenavTourguide'; // Adjust the import path as necessary

const Tourguide = ({ Tourguideservice, ActivityService }) => {
  const [activities, setActivities] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
  const [itineraryDetails, setItineraryDetails] = useState({
    activities: [],
    locations: [{
      type: 'Point',
      coordinates: [0, 0],
    }],
    duration: '',
    language: '',
    price: 0,
    availableDates: [],
    accessible: false,
    pickupLocation: '',
    dropOffLocation: '',
    start_date: '',
    end_date: '',
    availableTickets: 0,
    title:''
  });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await ActivityService.getAllUpcomingActivities(currentPage);
        if (response && response.data) {
          setActivities(Array.isArray(response.data) ? response.data : []);
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        console.error('Error fetching activities:', error.message);
      }
    };

    fetchActivities();
  }, [currentPage, ActivityService]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItineraryDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleActivityChange = (selectedOptions) => {
    const activityIds = Array.from(selectedOptions).map(option => option.value);
    setItineraryDetails((prevDetails) => ({
      ...prevDetails,
      activities: activityIds,
    }));
  };

  const handleAddItinerary = async (e) => {
    e.preventDefault();
    try {
      console.log(itineraryDetails);
      const newItinerary = await Tourguideservice.addItinerary(itineraryDetails);
      console.log(newItinerary);
      alert("Itinerary added successfully!");
      resetForm();
    } catch (error) {
      console.error('Error creating itinerary:', error.message);
      alert("Failed to create itinerary.");
    }
  };

  const resetForm = () => {
    setItineraryDetails({
      activities: [],
      locations: [{
        type: 'Point',
        coordinates: [0, 0],
      }],
      duration: '',
      language: '',
      price: '',
      availableDates: [],
      accessible: false,
      pickupLocation: '',
      dropOffLocation: '',
      start_date: '',
      end_date: '',
      availableTickets: '',
      title:''
    });
    setSelectedLocation({ lat: 0, lng: 0 });
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const mapContainerStyle = { height: '400px', width: '100%' };

  const onMapClick = (event) => {
    setSelectedLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  const addLocation = () => {
    setItineraryDetails((prevDetails) => ({
      ...prevDetails,
      locations: [
        ...prevDetails.locations,
        {
          type: 'Point',
          coordinates: [selectedLocation.lng, selectedLocation.lat],
        },
      ],
    }));
    alert("Location added!");
  };

  return (
    <div className="flex">
      <TourGuideSideNav />
      <main className="flex-1 p-6 bg-gray-100 shadow-lg">
        <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl text-center font-bold mb-6 text-gray-800">Manage Itinerary</h2>
          <form onSubmit={handleAddItinerary} className="space-y-6" noValidate>
            {/* Select Activities */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">Select Activities:</label>
              <select
                multiple
                onChange={(e) => handleActivityChange(e.target.selectedOptions)}
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {activities.map((activity) => (
                  <option key={activity._id} value={activity._id}>
                    {activity.name}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-300 rounded-md p-2 hover:bg-gray-400"
              >
                Previous
              </button>
              <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-gray-300 rounded-md p-2 hover:bg-gray-400"
              >
                Next
              </button>
            </div>
  
            {/* Location Selection */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">Location:</label>
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
            </div>
  
            {/* Coordinates */}
            <div className="mt-4">
              <input
                type="text"
                name="locationCoordinates"
                value={`${selectedLocation.lng}, ${selectedLocation.lat}`}
                onChange={handleInputChange}
                placeholder="Location Coordinates (longitude, latitude)"
                required
                readOnly
                className="border border-gray-300 rounded-md p-4 w-full bg-gray-100 cursor-not-allowed"
              />
            </div>
            <button
              type="button"
              onClick={addLocation}
              className="w-full bg-slate-700 text-white p-3 rounded-md hover:bg-slate-800 transition mt-4"
            >
              Add Location
            </button>
  
            {/* Duration */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">Select Activities Duration:</label>
              <select
                name="duration"
                value={itineraryDetails.duration}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select duration</option>
                {[30, 60, 90, 120, 180].map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} {duration === 30 ? 'minutes' : 'minutes'}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Language */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">Language:</label>
              <input
                type="text"
                name="language"
                value={itineraryDetails.language}
                onChange={handleInputChange}
                placeholder="Language"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            {/* Price */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">Price:</label>
              <input
                type="number"
                name="price"
                value={itineraryDetails.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            {/* Date Inputs */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-2">Start Date:</label>
                <input
                  type="date"
                  name="start_date"
                  value={itineraryDetails.start_date}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-2">End Date:</label>
                <input
                  type="date"
                  name="end_date"
                  value={itineraryDetails.end_date}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
  
            {/* Available Dates */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">Available Dates (comma-separated):</label>
              <input
                type="text"
                name="availableDates"
                value={itineraryDetails.availableDates.join(', ')}
                onChange={(e) => 
                  setItineraryDetails((prevDetails) => ({
                    ...prevDetails,
                    availableDates: e.target.value.split(',').map(date => date.trim()),
                  }))
                }
                placeholder="Available Dates"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            {/* Accessible Checkbox */}
            <div className="flex items-center mb-6">
              <input
              type="checkbox"
              name="accessible"
              checked={itineraryDetails.accessible}
              onChange={handleInputChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 mr-3"/>
              <label className="text-lg font-semibold text-gray-800">Accessible</label>
              </div>
  
            {/* Pickup Location */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">Pickup Location:</label>
              <input
                type="text"
                name="pickupLocation"
                value={itineraryDetails.pickupLocation}
                onChange={handleInputChange}
                placeholder="Pickup Location"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            {/* Drop-off Location */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">Drop-off Location:</label>
              <input
                type="text"
                name="dropOffLocation"
                value={itineraryDetails.dropOffLocation}
                onChange={handleInputChange}
                placeholder="Drop-off Location"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            {/* Available Tickets */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">Available Tickets:</label>
              <input
                type="number"
                name="availableTickets"
                value={itineraryDetails.availableTickets}
                onChange={handleInputChange}
                placeholder="Available Tickets"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            {/* Title */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">Title:</label>
              <input
                type="text"
                name="title"
                value={itineraryDetails.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-slate-700 text-white p-3 rounded-md hover:bg-slate-800 transition"
            >
              Add Itinerary
            </button>
          </form>
        </div>
      </main>
    </div>
  );
  
};

export default Tourguide;
