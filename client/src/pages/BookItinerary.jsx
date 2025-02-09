import { useLocation, Link,useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SideNav from '../components/TouristSideNav';

const BookItineraryPage = ({ touristService, PaymentService }) => {
  const location = useLocation();
  const itinerary = location.state?.itinerary;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [ticketCount, setTicketCount] = useState(1);
  const [availableTickets, setAvailableTickets] = useState(0);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [ticketIds, setTicketIds] = useState([]);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (itinerary && itinerary.availableTickets !== undefined) {
      setAvailableTickets(itinerary.availableTickets);
    }
  }, [itinerary]);

  const handleBooking = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (ticketCount > availableTickets) {
      setError(`Only ${availableTickets} tickets available.`);
      setLoading(false);
      return;
    }

    try {
      const ticketArray = [];
      for (let i = 0; i < ticketCount; i++) {
        const response = await touristService.bookItinerary(itinerary.id);
        ticketArray.push(response.data._id);
      }
      setTicketIds(ticketArray);
      setSuccessMessage(`Successfully booked ${ticketCount} ticket(s)!`);
      setAvailableTickets((prev) => prev - ticketCount);
      setBookingComplete(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithWallet = async () => {
    try {
      await PaymentService.PaywithWallet(ticketIds, promoCode);
      setSuccessMessage('Payment with wallet successful!');
      navigate('/PaymentSuccess');
    } catch (error) {
      setError(error.message || 'Wallet payment failed. Please try again.');
    } finally {
      setShowPaymentOptions(false);
    }
  };

  if (!itinerary) {
    return <p className="text-red-500 text-center">No itinerary data found.</p>;
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Book Itinerary</h1>

          <div className="mb-4">
            <h2 className="text-xl font-semibold">{itinerary.name}</h2>
            <p><strong>Activities:</strong> {itinerary.activities}</p>
            <p><strong>Budget:</strong> ${itinerary.budget}</p>
            <p><strong>Date:</strong> {itinerary.date}</p>
            <p><strong>Rating:</strong> {itinerary.rating} / 5</p>
            <p><strong>Tags:</strong> {itinerary.tags}</p>
            <p><strong>Available Tickets:</strong> {availableTickets}</p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Number of Tickets</label>
            <input
              type="number"
              min="1"
              max={availableTickets}
              value={ticketCount}
              onChange={(e) => setTicketCount(Number(e.target.value))}
              className="border rounded-md p-2 w-full"
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

          {!bookingComplete ? (
            <button
              onClick={handleBooking}
              disabled={loading || availableTickets === 0}
              className={`w-full p-2 text-white font-semibold rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {loading ? 'Booking...' : 'Book Now'}
            </button>
          ) : (
            <button
              onClick={() => setShowPaymentOptions(true)}
              className="w-full p-2 text-center bg-green-500 text-white font-semibold rounded block mt-4 hover:bg-green-600"
            >
              Pay Now
            </button>
          )}

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
        </div>
      </div>
    </div>
  );
};

export default BookItineraryPage;
  