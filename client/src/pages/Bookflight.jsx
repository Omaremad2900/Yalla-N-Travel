import React, { useState } from 'react';
import SideNav from '../components/TouristSideNav';

const FlightBookingPage = ({ bookingService }) => {
    const [originCode, setOriginCode] = useState('');
    const [destinationCode, setDestinationCode] = useState('');
    const [dateOfDeparture, setDateOfDeparture] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [flights, setFlights] = useState([]);
    const [confirmedFlight, setConfirmedFlight] = useState(null); // State to store the confirmed flight
    const [error, setError] = useState('');

    const handleSearchFlights = async () => {
        try {
            if (!originCode || !destinationCode || !dateOfDeparture) {
                throw new Error("Please fill in all mandatory fields: Origin, Destination, and Departure Date.");
            }

            const params = {
                originCode,
                destinationCode,
                dateOfDeparture,
            };

            if (returnDate && returnDate.trim()) {
                params.returnDate = returnDate.trim();
            }

            const flightOffers = await bookingService.searchFlights(params);
            if (Array.isArray(flightOffers.data)) {
                setFlights(flightOffers.data);
                setError(''); // Clear previous errors
            } else {
                throw new Error('Unexpected response from flight search. Please try again.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleConfirmFlightPrice = async (flight) => {
        try {
            const response = await bookingService.confirmFlightPrice({ data: { flightOffers: [flight] } });
            alert('Flight price confirmed: ');
            console.log('Flight price confirmed:', response);
            setConfirmedFlight(response.data.flightOffers[0]); // Adjust index based on your response structure
        } catch (error) {
            setError(error.message);
        }
    };

    const handleBookFlight = async () => {
        try {
            if (!confirmedFlight) {
                throw new Error("No confirmed flight to book. Please confirm a flight price first.");
            }
            const response = await bookingService.bookFlight(confirmedFlight);
            alert('Flight booked successfully: ');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <SideNav />

            {/* Main Content */}
            <div className="flex-1 bg-white p-8 overflow-y-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Flight Booking</h1>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="Origin Code"
                            value={originCode}
                            onChange={(e) => setOriginCode(e.target.value)}
                            className="border border-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Destination Code"
                            value={destinationCode}
                            onChange={(e) => setDestinationCode(e.target.value)}
                            className="border border-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <input
                            type="date"
                            value={dateOfDeparture}
                            onChange={(e) => setDateOfDeparture(e.target.value)}
                            className="border border-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="border border-gray-300 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            onClick={handleSearchFlights}
                            className="bg-blue-600 text-white py-3 px-6 rounded-md w-full md:w-auto hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Search Flights
                        </button>
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mt-6">Available Flights</h2>
                        {flights.length > 0 ? flights.map((flight) => (
                            <div key={flight.id} className="border border-gray-300 rounded-md p-4 mb-4">
                                <h3 className="text-lg font-semibold">Flight ID: {flight.id}</h3>
                                <p>Price: {flight.price.total} {flight.price.currency}</p>
                                <div className="mt-2">
                                    {flight.itineraries.map((itinerary, index) => (
                                        <div key={index}>
                                            <p>Duration: {itinerary.duration}</p>
                                            {itinerary.segments.map((segment, segIndex) => (
                                                <div key={segIndex} className="mt-1">
                                                    <p>
                                                        {segment.departure.iataCode} to {segment.arrival.iataCode}<br />
                                                        Departure: {new Date(segment.departure.at).toLocaleString()}<br />
                                                        Arrival: {new Date(segment.arrival.at).toLocaleString()}<br />
                                                        Carrier: {segment.carrierCode} Flight {segment.number}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleConfirmFlightPrice(flight)}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2"
                                >
                                    Confirm Price
                                </button>
                                <button
                                    onClick={handleBookFlight}
                                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    Book Flight
                                </button>
                            </div>
                        )) : (
                            <p>No flights available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightBookingPage;
