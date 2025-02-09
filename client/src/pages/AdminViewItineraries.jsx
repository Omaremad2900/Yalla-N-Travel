import { useEffect, useState } from 'react';
//import AdminService from '../services/AdminService';
import SideNav from '../components/adminSidenav';

const AdminViewItineraries = ({AdminService}) => {
  const [itineraries, setItineraries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await AdminService.getAllItineraries(currentPage);
        console.log(response);
        
        setItineraries(response.data); // Update itineraries from response
        setTotalPages(response.totalPages); // Set total pages based on response
      } catch (error) {
        console.error('Error fetching itineraries:', error.message);
      }
    };

    fetchItineraries();
  }, [currentPage]);

  const handleFlagItinerary = async (id) => {
    const confirmFlag = window.confirm('Are you sure you want to flag this itinerary as inappropriate?');
    if (!confirmFlag) return;

    try {
      const success = await AdminService.flagItinerary(id);
      if (success) {
        setItineraries((prevItineraries) =>
          prevItineraries.map((itinerary) =>
            itinerary.id === id ? { ...itinerary, isFlagged: true } : itinerary
          )
        );
        alert('Itinerary flagged successfully.');
      }
    } catch (error) {
      console.error('Error flagging itinerary:', error.message);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
            <SideNav />

      <div className="flex-1 p-8 bg-slate-200 max-w-8xl mx-auto shadow-md">
        <h4 className="text-2xl font-semibold mb-6 border-b-2 border-gray-300 pb-2 text-slate-700">
          Your Itineraries
        </h4>
        <ul className="space-y-4">
          {itineraries.map((itinerary) => (
            <li
              key={itinerary.id}
              className="border border-gray-300 rounded-md p-4 transition-shadow hover:shadow-lg bg-gray-50"
            >
              <h5 className="text-lg font-bold mb-2 text-blue-800">{itinerary.title}</h5>
              <p>
                <span className="text-blue-800 font-semibold">Pickup Location:</span> {itinerary.pickupLocation}
              </p>
              <p>
                <span className="text-blue-800 font-semibold">Drop Off Location:</span> {itinerary.dropOffLocation}
              </p>
              <p>
                <span className="text-blue-800 font-semibold">Duration:</span> {itinerary.duration} minutes
              </p>
              <p>
                <span className="text-blue-800 font-semibold">Start Date:</span> {new Date(itinerary.start_date).toLocaleDateString()}
              </p>
              <p>
                <span className="text-blue-800 font-semibold">End Date:</span> {new Date(itinerary.end_date).toLocaleDateString()}
              </p>
              <p>
                <span className="text-blue-800 font-semibold">Price:</span> ${itinerary.price}
              </p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleFlagItinerary(itinerary.id)}
                  disabled={itinerary.isFlagged}
                  className={`${
                    itinerary.isFlagged ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'
                  } text-white rounded-lg px-4 py-2 transition duration-200`}
                >
                  {itinerary.isFlagged ? 'Flagged' : 'Flag as Inappropriate'}
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white rounded-md ${
              currentPage === 1 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 transition duration-200'
            }`}
          >
            Previous
          </button>
          <span className="text-lg text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-white rounded-md ${
              currentPage === totalPages ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 transition duration-200'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminViewItineraries;
