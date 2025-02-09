import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import AdminService from '../services/AdminService';
import SideNav from '../components/adminSidenav';


const AdminViewActivities = ({AdminService}) => {
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => { 
    const fetchActivities = async () => {
      try {
        const response = await AdminService.getActivities(currentPage);
        console.log(response);
        setActivities(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching activities:', error.message);
      }
    };

    fetchActivities();
  }, [currentPage]);

  const handleFlagActivity = async (id) => {
    const confirmFlag = window.confirm('Are you sure you want to flag this activity as inappropriate?');
    if (!confirmFlag) return;

    try {
      console.log(id)
      const success = await AdminService.flagActivity(id);
      if (success) {
        setActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity.id === id ? { ...activity, isFlagged: true } : activity
          )
        );
        alert('Activity flagged successfully.');
      }
    } catch (error) {
      console.error('Error flagging activity:', error.message);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
            <SideNav />

      <div className="flex-1 p-8 bg-slate-200 max-w-8xl mx-auto shadow-md">
        <h4 className="text-2xl font-semibold mb-6 border-b-2 border-gray-300 pb-2 text-slate-700">
          Activities
        </h4>
        <ul className="space-y-4">
  {activities.map((activity) => (
    <li
      key={activity._id} // Make sure to use the right key property, `_id` instead of `id` if `_id` is the identifier.
      className="border border-gray-300 rounded-md p-4 transition-shadow hover:shadow-lg bg-gray-50"
    >
      <h5 className="text-lg font-bold mb-2 text-blue-800">{activity.name}</h5>
      <p>
        <span className="text-blue-800 font-semibold">Location:</span>{' '}
        <span className="text-black">
          {activity.location.coordinates ? 
            `${activity.location.coordinates[1]}, ${activity.location.coordinates[0]}` 
            : 'Location unavailable'}
        </span>
      </p>
      <p>
        <span className="text-blue-800 font-semibold">Date:</span>{' '}
        <span className="text-black">{new Date(activity.dateTime).toLocaleDateString()}</span>
      </p>
      <p>
        <span className="text-blue-800 font-semibold">Description:</span>{' '}
        <span className="text-black">{activity.description || 'No description'}</span>
      </p>
      <p>
        <span className="text-blue-800 font-semibold">Price:</span>{' '}
        <span className="text-black">${activity.price || 'N/A'}</span>
      </p>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => handleFlagActivity(activity._id)}
          disabled={activity.isFlagged}
          className={`${
            activity.isFlagged ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
          } text-white rounded-lg px-4 py-2 transition duration-200`}
        >
          {activity.isFlagged ? 'Flagged' : 'Flag as Inappropriate'}
        </button>
      </div>
    </li>
  ))}
</ul>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white rounded-md ${
              currentPage === 1 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 transition duration-200'
            }`}
          >
            Previous
          </button>
          <span className="text-lg text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-white rounded-md ${
              currentPage === totalPages ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 transition duration-200'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminViewActivities;
