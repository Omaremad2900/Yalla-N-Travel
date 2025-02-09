import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TourGuidePage = ({ TourguideService }) => {
    const { id } = useParams();
    const [tourGuide, setTourGuide] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [use, setResponse] = useState(null); // Add this state for the response

    useEffect(() => {
        const fetchTourGuideAndActivities = async () => {
            try {
                console.log("Fetching tour guide with ID:", id);
                const response = await TourguideService.getItineraryById(id); // Fetch tour guide by ID
                console.log("Tour guide fetched successfully:", response);
                setResponse(response); // Save the response in the response state
                setTourGuide(response); // Store the fetched tour guide

                if (response.activities) {
                    setActivities(response.activities); // Store activities if available
                }
            } catch (error) {
                console.error("Error fetching tour guide:", error);
                setError('Failed to load tour guide.'); // Set error message
            } finally {
                setLoading(false);
            }
        };

        fetchTourGuideAndActivities();
    }, [id, TourguideService]);

    if (loading) {
        return <p className="text-center text-gray-600">Loading tour guide...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!tourGuide) {
        return <p className="text-center text-gray-500">No tour guide found.</p>;
    }

    return (
        <div className="p-8 font-sans">
            <div className="border border-gray-300 bg-gray-50 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">{tourGuide.name}</h2>





                {/* Languages */}
                {tourGuide.languages && (
                    <p className="mb-4">
                        <strong className="text-gray-700">Languages:</strong> {tourGuide.languages.join(', ')}
                    </p>
                )}

                {/* Specialties */}
                {tourGuide.specialties && (
                    <p className="mb-4">
                        <strong className="text-gray-700">Specialties:</strong> {tourGuide.specialties.join(', ')}
                    </p>
                )}

                {/* Profile Picture */}
                {tourGuide.profilePicture && (
                    <div className="mt-4 flex justify-center">
                        <img
                            src={tourGuide.profilePicture}
                            alt={`${tourGuide.name}'s profile`}
                            className="w-32 h-32 object-cover rounded-full shadow-md"
                        />
                    </div>
                )}

                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Activities</h3>
                    {activities.length > 0 ? (
                        <ul>
                            {activities.map((activity, index) => (
                                <li key={index} className="mb-6 border-b border-gray-200 pb-4">
                                    <h4 className="text-lg font-semibold text-gray-800">{activity.name}</h4>

                                    {/* Locations */}
                                    {activity.locations && activity.locations.length > 0 && (
                                        <p><strong className="text-gray-700">Locations:</strong> {activity.locations.join(', ')}</p>
                                    )}

                                    {/* Duration */}
                                    <p><strong className="text-gray-700">Duration:</strong> {use.duration} minutes</p>

                                    {/* Language */}
                                    <p><strong className="text-gray-700">Language:</strong> {use.language}</p>

                                    {/* Price */}
                                    <p><strong className="text-gray-700">Price:</strong> ${use.price}</p>

                                    {/* Available Dates */}
                                    {activity.availableDates && activity.availableDates.length > 0 && (
                                        <p><strong className="text-gray-700">Available Dates:</strong> {activity.availableDates.join(', ')}</p>
                                    )}

                                    {/* Pickup and Drop-off Locations */}
                                    <p><strong className="text-gray-700">Pickup Location:</strong> {use.pickupLocation}</p>
                                    <p><strong className="text-gray-700">Drop-off Location:</strong> {use.dropOffLocation}</p>

                                    {/* Available Tickets */}
                                    <p><strong className="text-gray-700">Available Tickets:</strong> {use.availableTickets}</p>

                                    {/* Start and End Dates */}
                                    <p><strong className="text-gray-700">Start Date:</strong> {new Date(use.start_date).toLocaleDateString()}</p>
                                    <p><strong className="text-gray-700">End Date:</strong> {new Date(use.end_date).toLocaleDateString()}</p>

                                    {/* Ratings */}
                                    {activity.ratingsCount > 0 && (
                                        <p><strong className="text-gray-700">Ratings Count:</strong> {activity.ratingsCount}</p>
                                    )}

                                    {/* Comments */}
                                    {activity.comments && activity.comments.length > 0 && (
                                        <div>
                                            <strong className="text-gray-700">Comments:</strong>
                                            <ul>
                                                {activity.comments.map((comment, index) => (
                                                    <li key={index} className="text-gray-600">{comment}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No activities available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TourGuidePage;
