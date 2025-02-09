import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SideNav from '../components/TouristSideNav';

const AttendedHistoryPage = ({ touristService }) => {
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [itinerariesError, setItinerariesError] = useState('');
  const [activitiesError, setActivitiesError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await touristService.getAttendedItineraries(currentPage);
        const { data } = response;
        console.log(data);
        if (data && Array.isArray(data.itineraries)) {
          setItineraries(data.itineraries);
          setTotalPages(data.totalPages || 1);
        } else {
          setItinerariesError('Unexpected data format for itineraries.');
        }
      } catch (err) {
        if (err.response && err.response.status !== 404)
          setItinerariesError('An error occurred while fetching itineraries.');
        console.log(err);
      }
    };

    const fetchActivities = async () => {
      try {
        const response = await touristService.getAttendedActivities(currentPage);
        const { data } = response;
        if (data && Array.isArray(data.activities)) {
          setActivities(response.data.activities);
        } else {
          setActivitiesError('Unexpected data format for activities.');
        }
      } catch (err) {
        if (err.response && err.response.status !== 404)
          setActivitiesError(err.message);
      }
    };

    fetchItineraries();
    fetchActivities();
    setLoading(false);
  }, [touristService, currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) return <p>Loading history...</p>;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <SideNav className="w-64 h-full" />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Attended Itineraries and Activities</h1>

        {/* Itineraries Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Attended Itineraries</h2>
          {itinerariesError ? (
            <p className="text-red-500">{itinerariesError}</p>
          ) : (
            <>
              {itineraries.length === 0 ? (
                <p>No itineraries attended.</p>
              ) : (
                <ul className="space-y-4">
                  {itineraries.map((itinerary) => (
                    <li key={itinerary._id} className="border p-4 rounded shadow-sm">
                      <p><strong>Title:</strong> {itinerary.title}</p>
                      <p><strong>Budget:</strong> ${itinerary.price}</p>
                      <p><strong>Rating:</strong> {itinerary.ratings || 'N/A'}</p>
                      <p><strong>Available Dates:</strong> {itinerary.availableDates.map((date) => new Date(date).toLocaleDateString()).join(', ')}</p>
                      <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
                      <p><strong>Drop-off Location:</strong> {itinerary.dropOffLocation}</p>
                      <p><strong>Language:</strong> {itinerary.language}</p>
                      <p><strong>Duration:</strong> {itinerary.duration} hours</p>
                      <p><strong>Available Tickets:</strong> {itinerary.availableTickets}</p>
                      
                      <div className="flex flex-col space-y-2 mt-2">
                        <Link 
                          to="/rateAndCommentItinerary" 
                          state={{ itinerary }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md text-center "
                        >
                          Rate and Comment on Itinerary
                        </Link>

                        <Link
                          to="/rateAndCommentTourGuide"
                          state={{ tourGuideId: itinerary.tourGuideId }}
                          className="text-gray-500 px-4 py-2 rounded-md text-center border border-gray-300 hover:bg-gray-100 transition"
                        >
                          Rate Tour Guide
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

        {/* Pagination Controls for Itineraries */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-white rounded-md ${currentPage === 1 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Previous
            </button>
            <span className="text-lg">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-white rounded-md ${currentPage === totalPages ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Next
            </button>
          </div>
        )}

        {/* Activities Section */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Attended Activities</h2>
          {activitiesError ? (
            <p className="text-red-500">{activitiesError}</p>
          ) : (
            <>
              {activities.length === 0 ? (
                <p>No activities attended.</p>
              ) : (
                <ul className="space-y-4">
                  {activities.map((activity) => (
                    <li key={activity._id} className="border p-4 rounded shadow-sm">
                      <p><strong>Name:</strong> {activity.name}</p>
                      <p><strong>Date:</strong> {new Date(activity.dateTime).toLocaleDateString()}</p>
                      <div className="flex flex-col space-y-2 mt-2">
                      <Link 
                        to="/rateAndCommentActivity" 
                        state={{ activity }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 inline-block text-center"
                      >
                        Rate and Comment
                      </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default AttendedHistoryPage;
