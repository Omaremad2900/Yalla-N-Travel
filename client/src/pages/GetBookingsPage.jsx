import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SideNav from '../components/TouristSideNav';

const BookingsPage = ({ touristService, PaymentService }) => {
  const [itineraryTickets, setItineraryTickets] = useState([]);
  const [activityTickets, setActivityTickets] = useState([]);
  const [itinerariesError, setItinerariesError] = useState('');
  const [activitiesError, setActivitiesError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ticketIds, setTicketIds] = useState([]);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    const fetchBookedItineraries = async () => {
      try {
        const response = await touristService.getBookedItineraries(currentPage);
        const { data } = response;

        if (data && Array.isArray(data.tickets)) {
          setItineraryTickets(data.tickets);
          setTotalPages(data.totalPages || 1);
        } else {
          setItinerariesError('Unexpected data format for itineraries.');
        }
      } catch (err) {
        if (err.message !== "No itineraries found for this user") {
          setItinerariesError(err.message || 'An error occurred while fetching itineraries.');
        }
      }
    };

    const fetchBookedActivities = async () => {
      try {
        const response = await touristService.getBookedActivities(currentPage);
        const { data } = response;

        if (data && Array.isArray(data.tickets)) {
          setActivityTickets(data.tickets);
        } else {
          setActivitiesError('Unexpected data format for activities.');
        }
      } catch (err) {
        if (err.message !== "No activities found for this user") {
          setActivitiesError(err.message || 'An error occurred while fetching activities.');
        }
      }
    };

    fetchBookedItineraries();
    fetchBookedActivities();
    setLoading(false);
  }, [touristService, currentPage]);

  const handleCancelItineraryBooking = async (ticketId) => {
    try {
      await touristService.CancelbookingItinerary(ticketId);
      setItineraryTickets((prevTickets) => prevTickets.filter(ticket => ticket._id !== ticketId));
    } catch (error) {
      if (error.message.includes("Cannot delete ticket less than 48 hours before the itinerary starts")) {
        setItinerariesError("You cannot cancel this booking within 48 hours of its start time.");
      } else {
        setItinerariesError(error.message || 'An error occurred while canceling the itinerary booking.');
      }
    }
  };

  const handleCancelActivityBooking = async (ticketId) => {
    try {
      await touristService.CancelbookingActivity(ticketId);
      setActivityTickets((prevTickets) => prevTickets.filter(ticket => ticket._id !== ticketId));
    } catch (error) {
      if (error.message.includes("Cannot delete ticket less than 48 hours before the activity starts")) {
        setActivitiesError("You cannot cancel this booking within 48 hours of its start time.");
      } else {
        setActivitiesError(error.message || 'An error occurred while canceling the activity booking.');
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePayWithWallet = async () => {
    try {
      await PaymentService.PaywithWallet(ticketIds, promoCode);
      alert('Payment with wallet successful!');
    } catch (error) {
      alert(error.message || 'Wallet payment failed. Please try again.');
    } finally {
      setShowPaymentOptions(false);
    }
  };

  if (loading) return <p>Loading history...</p>;

  return (
    <div className="flex h-full">
      <SideNav className="w-64 h-full" />

      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Booked Itineraries and Activities</h1>

        {/* Booked Itineraries Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Booked Itineraries</h2>
          {itinerariesError ? (
            <p className="text-red-500">{itinerariesError}</p>
          ) : (
            <>
              {itineraryTickets.length === 0 ? (
                <p>No itineraries booked.</p>
              ) : (
                <ul className="space-y-4">
                  {itineraryTickets.map((ticket) => (
                    <li key={ticket._id} className="border p-4 rounded shadow-sm">
                      <p><strong>Title:</strong> {ticket.itinerary.title}</p>
                      <p><strong>Price:</strong> ${ticket.itinerary.price}</p>
                      <p><strong>Rating:</strong> {ticket.itinerary.ratings || 'N/A'}</p>
                      <p><strong>Available Dates:</strong> {ticket.itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ')}</p>
                      <p><strong>Pickup Location:</strong> {ticket.itinerary.pickupLocation}</p>
                      <p><strong>Drop-off Location:</strong> {ticket.itinerary.dropOffLocation}</p>
                      <p><strong>Language:</strong> {ticket.itinerary.language}</p>
                      <p><strong>Duration:</strong> {ticket.itinerary.duration} hours</p>
                      <p><strong>Available Tickets:</strong> {ticket.itinerary.availableTickets}</p>

                      <div className="flex space-x-4 mt-4">
                        {ticket.status === 'Pending' && (
                          <button
                            onClick={() => {
                              setTicketIds([ticket._id]);
                              setShowPaymentOptions(true);
                            }}
                            className="w-full p-2 text-center bg-green-500 text-white font-semibold rounded hover:bg-green-600"
                          >
                            Pay Now
                          </button>
                        )}
                        <button
                          onClick={() => handleCancelItineraryBooking(ticket._id)}
                          className="w-full p-2 text-center bg-red-500 text-white font-semibold rounded hover:bg-red-600"
                        >
                          Cancel Booking
                        </button>
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

        {/* Payment Options Modal */}
        {showPaymentOptions && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
              <h2 className="text-xl font-bold mb-4">Choose Payment Method</h2>
              <button
                onClick={() => setShowPaymentOptions(false)}
                className="absolute top-0 right-0 mt-2 mr-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              {/* Promo Code Input */}
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Promo Code (Optional)</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="flex flex-col space-y-4">
                <Link
                  to="/Checkout"
                  state={{ ticketIds, promoCode }}
                  className="p-3 text-center bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                >
                  Pay by Card
                </Link>
                <button
                  onClick={handlePayWithWallet}
                  className="p-3 text-center bg-green-500 text-white font-semibold rounded hover:bg-green-600"
                >
                  Pay with Wallet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booked Activities Section */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Booked Activities</h2>
          {activitiesError ? (
            <p className="text-red-500">{activitiesError}</p>
          ) : (
            <ul className="space-y-4">
              {activityTickets.map((ticket) => (
                <li key={ticket._id} className="border p-4 rounded shadow-sm">
                  <p><strong>Name:</strong> {ticket.activity.name}</p>
                  <p><strong>Price:</strong> {ticket.activity.price}</p>
                  <p><strong>Date:</strong> {ticket.activity.dateTime}</p>

                  <div className="flex space-x-4 mt-4">
                    {ticket.status === 'Pending' && (
                      <button
                        onClick={() => {
                          setTicketIds([ticket._id]);
                          setShowPaymentOptions(true);
                        }}
                        className="w-full p-2 text-center bg-green-500 text-white font-semibold rounded hover:bg-green-600"
                      >
                        Pay Now
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelActivityBooking(ticket._id)}
                      className="w-full p-2 text-center bg-red-500 text-white font-semibold rounded hover:bg-red-600"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default BookingsPage;
