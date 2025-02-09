import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ActivityPage = ({ ActivityService }) => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await ActivityService.getActivityById(id);
                setActivity(response);
            } catch (error) {
                setError('Failed to load activity.');
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [id, ActivityService]);

    if (loading) {
        return <p className="text-center text-gray-600">Loading activity...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!activity) {
        return <p className="text-center text-gray-500">No activity found.</p>;
    }

    return (
        <div className="p-8 flex-1 font-sans">
            <div className="border border-gray-300 bg-gray-50 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">{activity.name}</h2>

                {/* Date and Time */}
                <p className="mb-4">
                    <strong className="text-gray-700">Date & Time:</strong> {new Date(activity.dateTime).toLocaleString()}
                </p>

                {/* Location */}
                {activity.location && (
                    <p className="mb-4">
                        <strong className="text-gray-700">Location:</strong> {activity.location ? JSON.stringify(activity.location) : 'No location available'}
                    </p>
                )}

                {/* Price */}
                <p className="mb-4">
                    <strong className="text-gray-700">Price:</strong> ${activity.price}
                </p>

                {/* Price Range */}
                {activity.priceRange && (
                    <p className="mb-4">
                        <strong className="text-gray-700">Price Range:</strong> {activity.priceRange}
                    </p>
                )}



                {/* Tags */}
                {activity.tags && activity.tags.length > 0 && (
                    <p className="mb-4">
                        <strong className="text-gray-700">Tags:</strong> {activity.tags.join(', ')}
                    </p>
                )}

                {/* Special Discounts */}
                {activity.specialDiscounts && (
                    <p className="mb-4">
                        <strong className="text-gray-700">Special Discounts:</strong> {activity.specialDiscounts}
                    </p>
                )}

                {/* Booking Status */}
                <p className="mb-4">
                    <strong className="text-gray-700">Booking Open:</strong> {activity.isBookingOpen ? 'Yes' : 'No'}
                </p>

                {/* Ratings */}
                {activity.ratings && (
                    <p className="mb-4">
                        <strong className="text-gray-700">Ratings:</strong> {activity.ratings} / 5
                    </p>
                )}

                {/* Images (Optional) */}
                {activity.images && activity.images.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-4">
                        {activity.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${activity.name} image ${index + 1}`}
                                className="w-32 h-32 object-cover rounded-md shadow-md"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityPage;
