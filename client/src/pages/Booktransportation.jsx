import React, { useEffect, useState } from 'react';
import SideNav from '../components/TouristSideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const BookTransportation = ({ touristService }) => {
    const [transportations, setTransportations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bookingMessage, setBookingMessage] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(5); // Define the number of items per page

    const fetchTransportations = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await touristService.getAllTransportation(page, limit);
            console.log("Fetched transportations data:", data);

            if (data.success && Array.isArray(data.data)) {
                setTransportations(data.data);
            } else {
                throw new Error('Unexpected data format for transportations');
            }
        } catch (error) {
            setError(error.message || 'Failed to load transportations');
        } finally {
            setLoading(false);
        }
    };

    const handleBookTransportation = async (transportationId) => {
        try {
            setBookingMessage('');
            await touristService.bookTransportation(transportationId);
            setBookingMessage(`Successfully booked transportation`);
        } catch (error) {
            setBookingMessage(`Failed to book transportation: ${error.message}`);
        }
    };

    const handleNextPage = () => setPage(prevPage => prevPage + 1);
    const handlePreviousPage = () => setPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));

    useEffect(() => {
        fetchTransportations();
    }, [page]);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <SideNav />

            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-50">
                <h4 className="text-2xl font-semibold mb-4">Available Transportations</h4>
                {loading && <p>Loading transportations...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {bookingMessage && <p className="text-green-500">{bookingMessage}</p>}

                <ul className="space-y-4">
                    {transportations.map((transportation) => (
                        <li key={transportation._id} className="border-b pb-4">
                            <p><strong>Name:</strong> {transportation.name}</p>
                            <p><strong>From:</strong> {transportation.from}</p>
                            <p><strong>To:</strong> {transportation.to}</p>
                            <p><strong>Price:</strong> ${transportation.price}</p>
                            <p><strong>Departure:</strong> {new Date(transportation.departureTime).toLocaleString()}</p>
                            <p><strong>Arrival:</strong> {new Date(transportation.arrivalTime).toLocaleString()}</p>
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={() => handleBookTransportation(transportation._id)}
                                    className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
                                >
                                    Book Now <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="pagination flex justify-center space-x-4 mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    >
                        Previous
                    </button>
                    <span className="font-semibold">Page {page}</span>
                    <button
                        onClick={handleNextPage}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookTransportation;
