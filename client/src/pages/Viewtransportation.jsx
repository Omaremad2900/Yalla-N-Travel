import React, { useEffect, useState } from 'react';
import SideNav from '../components/TouristSideNav';

const ViewTransportation = ({ touristService }) => {
    const [bookedTransportations, setBookedTransportations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cancellingId, setCancellingId] = useState(null);
    const [error, setError] = useState(null);

    // Fetch all booked transportations
    useEffect(() => {
        const fetchBookedTransportations = async () => {
            setLoading(true);
            try {
                const response = await touristService.getBookedTransportations();
                console.log("Fetched Booked Transportations:", response); // Log the whole response
                if (response.data && response.data.tickets) {
                    setBookedTransportations(response.data.tickets); // Set the tickets data
                } else {
                    setError("No tickets available");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBookedTransportations();
    }, [touristService]);

    // Handle cancelling a transportation booking by its ID
    const handleCancelTransportation = async (id) => {
        setLoading(true);
        setCancellingId(id); // Show loading indicator for this ID
        try {
            await touristService.cancelTransportationBooking(id);
            alert('Booking cancelled successfully');

            // Update the list of booked transportations by removing the canceled one
            setBookedTransportations((prev) => prev.filter((ticket) => ticket._id !== id));
        } catch (error) {
            alert(`Failed to cancel transportation: ${error.message}`);
        } finally {
            setLoading(false);
            setCancellingId(null);
        }
    };

    return (
        <div className="flex bg-gray-50 ">
            {/* Sidebar */}    <SideNav />
           

            {/* Main Content */}
            <div className="flex-1 p-6 ">
                <h2 className="text-2xl font-bold mb-4">Booked Transportations</h2>
                {loading && <p>Loading booked transportations...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && bookedTransportations.length === 0 && (
                    <p>No booked transportations available at the moment.</p>
                )}

                <ul className="space-y-4">
                    {bookedTransportations.map((ticket) => {
                        const transportation = ticket.transportation; // Extract transportation details
                        return (
                            <li
                                key={ticket._id}
                                className="bg-white p-4 rounded shadow-md flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold">{transportation.name}</h3>
                                    <p><strong>From:</strong> {transportation.from}</p>
                                    <p><strong>To:</strong> {transportation.to}</p>
                                    <p><strong>Type:</strong> {transportation.type}</p>
                                    <p><strong>Departure Time:</strong> {new Date(transportation.departureTime).toLocaleString()}</p>
                                    <p><strong>Arrival Time:</strong> {new Date(transportation.arrivalTime).toLocaleString()}</p>
                                    <p><strong>Price:</strong> ${transportation.price}</p>
                                    <p><strong>Available Seats:</strong> {transportation.availableSeats}</p>
                                </div>
                                <button
                                    onClick={() => handleCancelTransportation(ticket._id)}
                                    className={`px-4 py-2 rounded text-white ${cancellingId === ticket._id
                                        ? 'bg-gray-400'
                                        : 'bg-red-500 hover:bg-red-600'
                                        }`}
                                    disabled={cancellingId === ticket._id}
                                >
                                    {cancellingId === ticket._id ? 'Cancelling...' : 'Cancel'}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default ViewTransportation;
