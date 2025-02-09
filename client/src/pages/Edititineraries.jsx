import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TourGuideSideNav from '../components/SidenavTourguide'; // Import the side nav component

const EditItinerary = ({ Tourguideservice }) => {
  const { id } = useParams(); // Get the itinerary ID from the URL
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null); // Initialize as null to handle loading state
  const [popup, setPopup] = useState({ type: '', content: '', visible: false }); // For success/error popups

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await Tourguideservice.getItineraryById(id);
        console.log(response)
        setItinerary(response); // Populate form with existing data
      } catch (error) {
        showPopup('error', 'Error fetching itinerary data. Please try again later.');
      }
    };

    fetchItinerary();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...itinerary,
        activities: itinerary.activities.map((activity) => activity._id), // Map to an array of IDs
      };
      await Tourguideservice.editItinerary(id, updateData);
      showPopup('success', 'Itinerary updated successfully!');
    } catch (error) {
      showPopup('error', 'Failed to update itinerary. Please try again later.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItinerary({ ...itinerary, [name]: value });
  };

  const handleActivitiesChange = (index, value) => {
    const updatedActivities = [...itinerary.activities];
    updatedActivities[index].name = value; // Change the activity name
    setItinerary({ ...itinerary, activities: updatedActivities });
  };

  const showPopup = (type, content) => {
    setPopup({ type, content, visible: true });
    setTimeout(() => {
      setPopup({ ...popup, visible: false });
    }, 3000); // Hide after 3 seconds
  };

  if (!itinerary) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <TourGuideSideNav /> {/* Add the side navigation */}
      <div className="flex-1 p-8 bg-white shadow-lg rounded-lg border border-gray-300 max-w-4xl mx-auto">
        <h4 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 pb-2">Edit Itinerary</h4>

        {/* Success/Error Popup */}
        {popup.visible && (
          <div
            className={`fixed inset-x-0 top-16 mx-auto max-w-md p-4 rounded-md text-white ${popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}
          >
            {popup.content}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
              <input
                type="text"
                name="pickupLocation"
                value={itinerary.pickupLocation || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Drop Off Location</label>
              <input
                type="text"
                name="dropOffLocation"
                value={itinerary.dropOffLocation || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={itinerary.duration || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={itinerary.start_date ? itinerary.start_date.split('T')[0] : ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="end_date"
                value={itinerary.end_date ? itinerary.end_date.split('T')[0] : ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                name="price"
                value={itinerary.price || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Available Tickets</label>
              <input
                type="number"
                name="availableTickets"
                value={itinerary.availableTickets || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Activities</label>
              {itinerary.activities.map((activity, index) => (
                <input
                  key={activity._id}
                  type="text"
                  value={activity.name || ''}
                  onChange={(e) => handleActivitiesChange(index, e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 mb-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              ))}
            </div>
            
            <div>
  <label className="block text-sm font-medium text-gray-700">Is Accessible</label>
  <select
    name="accessible"
    value={itinerary.accessible ? 'true' : 'false'}
    onChange={(e) => handleInputChange({
      target: {
        name: e.target.name,
        value: e.target.value === 'true'
      }
    })}
    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
    required
  >
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
</div>
        </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow-md transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItinerary;
