import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MuseumPage = ({ tourismGovernorService }) => {
    const { id } = useParams(); // Get museum ID from route params
    const [museum, setMuseum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [use, setResponse] = useState(null); // Add this state for the response

    useEffect(() => {
        const fetchMuseum = async () => {
            try {
                const data = await tourismGovernorService.getMuseumById(id); // Call API to get museum by ID
                console.log("Museum data fetched:", data); // Log the fetched data
                setMuseum(data); // Set museum data in state
                setResponse(data); // Set the response to the 'use' state
            } catch (error) {
                setError(error.message || 'Failed to load museum details.');
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchMuseum();
    }, [id]);

    if (loading) return <p className="text-center text-gray-600">Loading museum details...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!museum) return <p className="text-center text-gray-500">Museum not found.</p>;

    return (
        <div className="p-8 font-sans">
            <div className="border border-gray-300 bg-gray-50 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">{use?.name || museum.name}</h2>

                {/* Category */}
                <p className="mb-4">
                    <strong className="text-gray-700">Category:</strong> {use.data.category}
                </p>

                {/* Description */}
                <p className="mb-4">
                    <strong className="text-gray-700">Description:</strong> {museum.data.description}
                </p>

                {/* Location */}
                <p className="mb-4">
                    <strong className="text-gray-700">Location:</strong> {museum.data.location}
                </p>

                {/* Opening Hours */}
                <p className="mb-4">
                    <strong className="text-gray-700">Opening Hours:</strong> {museum.data.openingHours}
                </p>

                {/* Ticket Prices */}
                <p className="mb-4">
                    <strong className="text-gray-700">Ticket Prices:</strong> ${museum.data.ticketPrices}
                </p>

                {/* Start and End Dates */}
                <p className="mb-4">
                    <strong className="text-gray-700">Start Date:</strong> {new Date(museum.data.start_date).toLocaleDateString()}
                </p>
                <p className="mb-4">
                    <strong className="text-gray-700">End Date:</strong> {new Date(museum.data.end_date).toLocaleDateString()}
                </p>

                {/* Preference */}
                <p className="mb-4">
                    <strong className="text-gray-700">Preference:</strong> {museum.data.preference}
                </p>

                {/* Pictures */}
                {museum.pictures?.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Museum Pictures</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {museum.pictures.map((pic, index) => (
                                <img
                                    key={index}
                                    src={pic}
                                    alt={`Museum picture ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {museum.tags?.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tags</h3>
                        <ul>
                            {museum.tags.map((tag, index) => (
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

export default MuseumPage;
