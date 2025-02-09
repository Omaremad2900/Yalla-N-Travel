import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const HistoricalPlacePage = ({ tourismGovernorService }) => {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const response = await tourismGovernorService.getPlaceById(id);
                setPlace(response);
                console.log("Historical Place data fetched:", response);
            } catch (error) {
                setError(error.message || 'Failed to load historical place.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlace();
    }, [id, tourismGovernorService]);

    if (loading) return <p className="text-center text-gray-600">Loading historical place...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!place) return <p className="text-center text-gray-500">No historical place found.</p>;

    return (
        <div className="p-8 font-sans">
            <div className="border border-gray-300 bg-gray-50 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">

                {/* Name */}
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">{place.data.name}</h2>

                {/* Description */}
                <p className="mb-4">
                    <strong className="text-gray-700">Description:</strong> {place.data.description}
                </p>

                {/* Pictures */}
                {place.pictures && place.pictures.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Pictures</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {place.pictures.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${place.name} image ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-md"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Location */}
                <p className="mt-4">
                    <strong className="text-gray-700">Location:</strong> {place.data.location}
                </p>

                {/* Opening Hours */}
                <p className="mt-4">
                    <strong className="text-gray-700">Opening Hours:</strong> {place.data.openingHours}
                </p>

                {/* Ticket Prices */}
                <p className="mt-4">
                    <strong className="text-gray-700">Ticket Prices:</strong> ${place.data.ticketPrices}
                </p>

                {/* Tags */}
                {place.tags && place.tags.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tags</h3>
                        <ul className="list-disc list-inside">
                            {place.tags.map((tag, index) => (
                                <li key={index} className="text-gray-600">
                                    Tag ID: {tag}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoricalPlacePage;
