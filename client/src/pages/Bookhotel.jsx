import React, { useEffect, useState } from 'react';
import TouristSideNav from '../components/TouristSideNav'; // Assuming the side nav is in components folder

const Bookhotel = ({ bookingService }) => {
  const [hotels, setHotels] = useState([]);
  const [offers, setOffers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(5);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  const fetchHotels = async () => {
    try {
      const response = await bookingService.getHotelsByCity({
        cityCode: 'PAR',
        radius: 10,
        ratings: 5,
        amenities: 'SWIMMING_POOL,SPA,FITNESS_CENTER,SAUNA',
      });
      console.log('Fetched Hotels:', response);
      if (response) {
        setHotels(response);
      } else {
        setError('No hotels found.');
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelOffers = async (hotelId) => {
    try {
      const response = await bookingService.getHotelOffers(hotelId, 1);
      console.log('Fetched Hotel Offers:', response);
      if (response) {
        setOffers((prevOffers) => ({
          ...prevOffers,
          [hotelId]: response[0]?.offers || [],
        }));
      }
    } catch (error) {
      console.error('Error fetching hotel offers:', error);
      setError('Failed to retrieve hotel offers');
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleHotelClick = (hotelId) => {
    setSelectedHotelId(hotelId);
    if (!offers[hotelId]) {
      fetchHotelOffers(hotelId);
    }
  };

  const handleBookHotel = async (hotelOfferId) => {
    const orderData = {
      data: {
        type: "hotel-order",
        guests: [
          {
            tid: 1,
            title: "MR",
            firstName: "BOB",
            lastName: "SMITH",
            phone: "+33679278416",
            email: "bob.smith@email.com"
          }
        ],
        travelAgent: {
          contact: {
            email: "bob.smith@email.com"
          }
        },
        roomAssociations: [
          {
            guestReferences: [
              { guestReference: "1" }
            ],
            hotelOfferId: hotelOfferId
          }
        ],
        payment: {
          method: "CREDIT_CARD",
          paymentCard: {
            paymentCardInfo: {
              vendorCode: "VI",
              cardNumber: "4151289722471370",
              expiryDate: "2026-08",
              holderName: "BOB SMITH"
            }
          }
        }
      }
    };

    try {
      console.log('Booking Order Data:', orderData);
      const response = await bookingService.createHotelOrder(orderData);
      console.log('Booking Response:', response);
      setOrderStatus("Booking successful!");
    } catch (error) {
      console.error('Error creating hotel order:', error);
      setOrderStatus("Failed to create hotel order.");
    }
  };

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center text-2xl text-red-500">Loading...</div>;
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">
      {/* Side Navigation */}
      <TouristSideNav />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Hotels in Paris</h1>

        {orderStatus && (
          <div
            className={`fixed top-0 left-0 right-0 p-4 text-center text-white font-bold transition-all duration-300 z-50 
                                ${orderStatus.includes("Failed") ? "bg-red-500" : "bg-green-500"}`}
            style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
          >
            {orderStatus}
          </div>
        )}

        {hotels.length === 0 ? (
          <p className="text-center text-xl text-gray-600">No hotels found.</p>
        ) : (
          <ul className="space-y-6">
            {currentHotels.map((hotel) => (
              <li
                key={hotel.hotelId}
                className="border border-gray-300 rounded-md p-6 mb-4 hover:bg-gray-50 transition duration-300 ease-in-out"
                onClick={() => handleHotelClick(hotel.hotelId)}
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-4">{hotel.name}</h3>
                <p><strong>Rating:</strong> {hotel.rating}</p>
                <p><strong>Amenities:</strong> {hotel.amenities ? hotel.amenities.join(', ') : 'No amenities listed'}</p>
                <p><strong>Address:</strong> {hotel.address?.countryCode || 'Country not available'}</p>
                <p><strong>Latitude:</strong> {hotel.geoCode?.latitude}</p>
                <p><strong>Longitude:</strong> {hotel.geoCode?.longitude}</p>
                <p><strong>Distance from city center:</strong> {hotel.distance?.value} {hotel.distance?.unit}</p>
                <p><strong>Last Updated:</strong> {new Date(hotel.lastUpdate).toLocaleString()}</p>

                {selectedHotelId === hotel.hotelId && (
                  offers[hotel.hotelId] && offers[hotel.hotelId].length > 0 ? (
                    offers[hotel.hotelId].map((offer) => (
                      <div key={offer.id} className="mt-2 border-b pb-2">
                        <p><strong>Offer ID:</strong> {offer.id}</p>
                        <p><strong>Check-in Date:</strong> {offer.checkInDate}</p>
                        <p><strong>Check-out Date:</strong> {offer.checkOutDate}</p>
                        <p><strong>Description:</strong> {offer.description?.text || 'No description available'}</p>
                        <p><strong>Guests:</strong> Adults - {offer.guests?.adults}</p>

                        {offer.price ? (
                          <>
                            <p><strong>Price:</strong> {offer.price.total} {offer.price.currency}</p>
                            <p><strong>Base Price:</strong> {offer.price.base}</p>
                          </>
                        ) : (
                          <p><strong>Price:</strong> Price unavailable</p>
                        )}

                        <button
                          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookHotel(offer.id);
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No offers available for this hotel.</p>
                  )
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center items-center mt-8">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md mr-4 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-lg">Page {currentPage}</span>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md ml-4 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastHotel >= hotels.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bookhotel;
