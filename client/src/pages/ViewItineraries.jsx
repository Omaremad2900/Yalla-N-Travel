import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Tourguideservice from '../services/Tourguideservice';
import { reverseGeoCode } from '../utils/geoCode';
import TourGuideSideNav from '../components/SidenavTourguide';

const ViewItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [locationAddresses, setLocationAddresses] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await Tourguideservice.getItineraries(currentPage);
        const { data, totalPages } = response;
        setItineraries(data);
        setTotalPages(totalPages);

        const addresses = {};
        await Promise.all(
          data.map(async (itinerary) => {
            addresses[itinerary._id] = await Promise.all(
              itinerary.locations.map(async (point) => {
                const addressData = await reverseGeoCode(point.coordinates[0], point.coordinates[1]);
                return addressData[0]?.formatted_address || 'Unknown location';
              })
            );
          })
        );
        // Remove first index from address
        Object.keys(addresses).forEach((key) => {
          addresses[key].shift();
        });
        setLocationAddresses(addresses);
      } catch (error) {
        console.error('Error fetching itineraries:', error.message);
      }
    };

    fetchItineraries();
  }, [currentPage]);

  const handleToggleStatus = async (id, currentStatus) => {
    // Determine the new status
    const newStatus = currentStatus === 'active' ? 'deactivated' : 'active';

    // Optimistically update the local state before the API call
    setItineraries((prevItineraries) => 
      prevItineraries.map(itinerary => 
        itinerary._id === id ? { ...itinerary, status: newStatus } : itinerary
      )
    );

    try {
      // Call the toggle itinerary status method with id and new status
      const updatedItinerary = await Tourguideservice.toggleItineraryStatus(id, newStatus);

      // Update the local state with the response from the backend if necessary
      setItineraries((prevItineraries) => 
        prevItineraries.map(itinerary => 
          itinerary._id === updatedItinerary._id ? updatedItinerary : itinerary
        )
      );

      console.log("Itinerary status updated:", updatedItinerary);
    } catch (error) {
      console.error("Error toggling itinerary status:", error.message);

      // If there's an error, revert the optimistic update
      setItineraries((prevItineraries) => 
        prevItineraries.map(itinerary => 
          itinerary._id === id ? { ...itinerary, status: currentStatus } : itinerary
        )
      );
    }
  };

  const handleDeleteItinerary = async (id) => {
    try {
      const success = await Tourguideservice.deleteItinerary(id);
      if (success) {
        setItineraries((prevItineraries) =>
          prevItineraries.filter((itinerary) => itinerary._id !== id)
        );
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error.message);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleEditItinerary = (id) => {
    navigate(`/edit-itinerary/${id}`);
  };

  return (
    <div className="flex bg-gray-50">
      <TourGuideSideNav /> {/* Include the side navigation component here */}
      <main className="flex-1 p-6 bg-gray-100 shadow-lg">
        <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl text-center font-bold mb-6 text-gray-800">Your Itineraries</h2>
          <ul className="space-y-4">
            {itineraries.map((itinerary) => (
              <li key={itinerary._id} className="border border-gray-300 rounded-md p-4 transition-shadow hover:shadow-lg bg-gray-50">
                <h5 className="text-lg font-bold mb-2 text-black-800">{itinerary.title}</h5>
                <p><span className="text-black-800 font-semibold">Pickup Location:</span> <span className="text-black">{itinerary.pickupLocation}</span></p>
                <p><span className="text-black-800 font-semibold">Drop Off Location:</span> <span className="text-black">{itinerary.dropOffLocation}</span></p>
                <p>
                  <span className="text-black-800 font-semibold">Locations:</span>
                  <ul className="list-disc pl-6 text-black">
                    {locationAddresses[itinerary._id]?.map((address, index) => (
                      <li key={index}>{address}</li>
                    )) || <li>Loading locations...</li>}
                  </ul>
                </p>
                <p><span className="text-black-800 font-semibold">Duration:</span> <span className="text-black">{itinerary.duration} minutes</span></p>
                <p><span className="text-black-800 font-semibold">Start Date:</span> <span className="text-black">{new Date(itinerary.start_date).toLocaleDateString()}</span></p>
                <p><span className="text-black-800 font-semibold">End Date:</span> <span className="text-black">{new Date(itinerary.end_date).toLocaleDateString()}</span></p>
                <p><span className="text-black-800 font-semibold">Price:</span> <span className="text-black">${itinerary.price}</span></p>

                <p className="mt-2 text-black-800 font-semibold">Activities:</p>
                <ul className="list-disc pl-6 text-black">
                  {itinerary.activities && itinerary.activities.length > 0 ? (
                    itinerary.activities.map((activity, index) => (
                      <li key={activity._id || index}>
                        {activity.name}
                      </li>
                    ))
                  ) : (
                    <li>No activities available</li>
                  )}
                </ul>

                <div className="flex space-x-4 mt-4">
                  <button
                  onClick={() => handleEditItinerary(itinerary._id)}
                  className="bg-slate-700 text-white rounded-lg px-6 py-3 hover:bg-slate-700 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-700">
                    Edit
                    </button>
                    <button
                    onClick={() => handleDeleteItinerary(itinerary._id)}
                    className="bg-red-600 text-white rounded-lg px-6 py-3 hover:bg-red-700 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400">Delete
                    </button>
                    <button
                    onClick={() => handleToggleStatus(itinerary._id, itinerary.status)}
                    className={`px-6 py-3 rounded-lg text-white ${itinerary.status === 'active' ? 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400' : 'bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-400'} transition duration-300 shadow-md hover:shadow-lg focus:outline-none`}>
                      {itinerary.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-white rounded-md ${currentPage === 1 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 transition duration-200'}`}
            >
              Previous
            </button>
            <span className="text-lg text-slate-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-white rounded-md ${currentPage === totalPages ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 transition duration-200'}`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewItineraries;
