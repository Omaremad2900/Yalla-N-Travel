import React, { useState, useEffect } from "react";
import { FaRegStar, FaStar, FaTrashAlt } from "react-icons/fa";
import TouristSideNav from "../components/TouristSideNav";
import { useSelector } from "react-redux";

const ViewBookmarks = ({ touristService }) => {
    const [bookmarks, setBookmarks] = useState({ activities: [], itineraries: [] });
    const [error, setError] = useState("");
    const currentUser = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await touristService.getMyBookmarks();
                setBookmarks(response.data); // Structure includes `activities` and `itineraries`
            } catch (err) {
                setError(err.message || "Failed to fetch bookmarks");
            }
        };

        fetchBookmarks();
    }, []);

    // Remove a bookmark
    const removeBookmark = async (bookmarkId, type) => {
        try {
            console.log("Removing bookmark with data:", { itemId: bookmarkId, type }); // Debugging
            await touristService.removeBookmark({ itemId: bookmarkId, type }); // Send `itemId` and `type`

            // Update state after successful deletion
            setBookmarks((prev) => ({
                ...prev,
                [type === "activity" ? "activities" : "itineraries"]: prev[
                    type === "activity" ? "activities" : "itineraries"
                ].filter((item) => item._id !== bookmarkId),
            }));
        } catch (err) {
            setError(err.message || "Failed to remove bookmark");
        }
    };

    // Toggle interest
    const toggleInterest = async (bookmark) => {
        const isInterested = bookmark.interestedUsers?.includes(currentUser);
        const { _id: itemId, type } = bookmark;

        try {
            if (isInterested) {
                console.log("Removing interest:", { itemId, type }); // Debugging
                await touristService.removeInterest(itemId, type);
                setBookmarks((prev) => ({
                    ...prev,
                    [type === "activity" ? "activities" : "itineraries"]: prev[
                        type === "activity" ? "activities" : "itineraries"
                    ].map((item) =>
                        item._id === itemId
                            ? { ...item, interestedUsers: item.interestedUsers.filter((id) => id !== currentUser) }
                            : item
                    ),
                }));
            } else {
                console.log("Adding interest:", { itemId, type }); // Debugging
                await touristService.addInterest(itemId, type);
                setBookmarks((prev) => ({
                    ...prev,
                    [type === "activity" ? "activities" : "itineraries"]: prev[
                        type === "activity" ? "activities" : "itineraries"
                    ].map((item) =>
                        item._id === itemId
                            ? { ...item, interestedUsers: [...(item.interestedUsers || []), currentUser] }
                            : item
                    ),
                }));
            }
        } catch (err) {
            setError(err.message || "Failed to update interest");
        }
    };

    const renderItineraries = () => {
        if (!bookmarks.itineraries || !bookmarks.itineraries.length) {
            return <p>No itineraries bookmarked yet.</p>;
        }

        return bookmarks.itineraries.map((itinerary) => (
            <div key={itinerary._id} className="border border-gray-300 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-xl font-bold text-blue-900">{itinerary.title}</h4>
                    <div className="flex items-center gap-2">
                        {/* Toggle Interest */}
                        {itinerary.interestedUsers?.includes(currentUser) ? (
                            <FaStar
                                className="text-yellow-400 cursor-pointer"
                                size={20}
                                onClick={() =>
                                    toggleInterest({
                                        _id: itinerary._id,
                                        type: "itinerary",
                                        interestedUsers: itinerary.interestedUsers,
                                    })
                                }
                            />
                        ) : (
                            <FaRegStar
                                className="text-gray-400 cursor-pointer"
                                size={20}
                                onClick={() =>
                                    toggleInterest({
                                        _id: itinerary._id,
                                        type: "itinerary",
                                        interestedUsers: itinerary.interestedUsers,
                                    })
                                }
                            />
                        )}
                        {/* Remove Bookmark */}
                        <FaTrashAlt
                            className="text-red-500 cursor-pointer"
                            size={20}
                            onClick={() => removeBookmark(itinerary._id, "itinerary")}
                        />
                    </div>
                </div>
                <p>Duration: {itinerary.duration} minutes</p>
                <p>Language: {itinerary.language}</p>
                <p>Price: ${itinerary.price}</p>
                <p>Available Dates: {itinerary.availableDates.join(", ")}</p>
                <p>Pickup Location: {itinerary.pickupLocation}</p>
                <p>Drop-off Location: {itinerary.dropOffLocation}</p>
                <p>Accessible: {itinerary.accessible ? "Yes" : "No"}</p>
                <p>Available Tickets: {itinerary.availableTickets}</p>
            </div>
        ));
    };

    const renderActivities = () => {
        if (!bookmarks.activities || !bookmarks.activities.length) {
            return <p>No activities bookmarked yet.</p>;
        }

        return bookmarks.activities.map((activity) => (
            <div key={activity._id} className="border border-gray-300 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-xl font-bold text-blue-900">{activity.name}</h4>
                    <div className="flex items-center gap-2">
                        {/* Toggle Interest */}
                        {activity.interestedUsers?.includes(currentUser) ? (
                            <FaStar
                                className="text-yellow-400 cursor-pointer"
                                size={20}
                                onClick={() =>
                                    toggleInterest({
                                        _id: activity._id,
                                        type: "activity",
                                        interestedUsers: activity.interestedUsers,
                                    })
                                }
                            />
                        ) : (
                            <FaRegStar
                                className="text-gray-400 cursor-pointer"
                                size={20}
                                onClick={() =>
                                    toggleInterest({
                                        _id: activity._id,
                                        type: "activity",
                                        interestedUsers: activity.interestedUsers,
                                    })
                                }
                            />
                        )}
                        {/* Remove Bookmark */}
                        <FaTrashAlt
                            className="text-red-500 cursor-pointer"
                            size={20}
                            onClick={() => removeBookmark(activity._id, "activity")}
                        />
                    </div>
                </div>
                <p>Category: {activity.category}</p>
                <p>Price: ${activity.price}</p>
                <p>Tags: {activity.tags.join(", ")}</p>
                <p>Available Tickets: {activity.availableTickets}</p>
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
            </div>
        ));
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <TouristSideNav />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h2 className="text-3xl font-bold text-center text-slate-700 mb-6">
                    View Bookmarked Items
                </h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <section className="mb-8">
                    <h3 className="text-2xl font-semibold text-slate-500 mb-4">Itineraries</h3>
                    {renderItineraries()}
                </section>

                <section>
                    <h3 className="text-2xl font-semibold text-slate-500 mb-4">Activities</h3>
                    {renderActivities()}
                </section>
            </div>
        </div>
    );
};

export default ViewBookmarks;
