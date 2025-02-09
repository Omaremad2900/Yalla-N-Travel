import { useState, useEffect } from 'react';

const Advertiserview = ({ advertiserService }) => {
  const [activities, setActivities] = useState([]);
  const [showActivities, setShowActivities] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch advertiser's activities
  const fetchActivities = async (page) => {
    try {
      const response = await advertiserService.getMyActivities(page); // Assuming this method accepts a page parameter
      console.log(response); // Debugging

      if (response && response.docs && Array.isArray(response.docs)) {
        const formattedActivities = response.docs.map(activity => ({
          name: activity.name,
          description: activity.description || 'N/A', // Providing default value if description is missing
          category: activity.category?.name || 'N/A',
          location: Array.isArray(activity.location.coordinates) ? activity.location.coordinates.join(", ") : 'N/A', // Ensure coordinates is an array
          price: activity.price || 'N/A',
          priceRange: activity.priceRange || 'N/A',
          tags: Array.isArray(activity.tags) ? activity.tags.map(tag => ({ id: tag._id, name: tag.name })) : [], // Store both id and name for tags
          availableDates: Array.isArray(activity.availableDates) ? activity.availableDates.map(date => new Date(date).toLocaleDateString()).join(", ") : 'N/A',
          duration: activity.duration || 'N/A',
          isBookingOpen: activity.isBookingOpen ? 'Yes' : 'No', // Display whether booking is open
        }));
        
        setActivities(formattedActivities);
        setTotalPages(response.totalPages || 1); // Set total pages from the response
      } else {
        console.error("API response data is not an array", response);
        setActivities([]);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error.message);
      setActivities([]);
    }
  };

  useEffect(() => {
    fetchActivities(currentPage);
  }, [currentPage]); // Fetch activities whenever currentPage changes

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">My Activities</h1>

        {/* Activities Section */}
        <section className="mb-8">
          <button
            onClick={() => setShowActivities(!showActivities)}
            className="bg-slate-700 text-white p-2 rounded mb-4"
          >
            {showActivities ? 'Hide Activities' : 'Show Activities'}
          </button>

          {showActivities && (
            <>
              {activities.length === 0 ? (
                <p>No activities found.</p>
              ) : (
                <ul className="grid grid-cols-1 gap-4">
                  {activities.map((activity, index) => (
                    <li key={index} className="border p-4 rounded shadow-md">
                      <h3 className="text-lg font-bold mb-2">{activity.name}</h3>
                      <p><strong>Description:</strong> {activity.description}</p>
                      <p><strong>Category:</strong> {activity.category}</p>
                      <p><strong>Location:</strong> {activity.location}</p>
                      <p><strong>Price:</strong> ${activity.price}</p>
                      <p><strong>Price Range:</strong> {activity.priceRange}</p>
                      <p><strong>Tags:</strong> {activity.tags.length > 0 ? activity.tags.map(tag => tag.name).join(", ") : 'No tags'}</p> {/* Display tag names */}
                      <p><strong>Available Dates:</strong> {activity.availableDates}</p>
                      <p><strong>Duration:</strong> {activity.duration} hours</p>
                      <p><strong>Booking Open:</strong> {activity.isBookingOpen}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

        {/* Pagination Controls */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-slate-700 text-white p-2 rounded"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-slate-700 text-white p-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Advertiserview;
