import { useEffect, useState } from 'react';
import SideNav from '../components/adminSidenav';

const AdminViewUserStatistics = ({ AdminService }) => {
  const [totalUsers, setTotalUsers] = useState(0); // State for total users
  const [newUsersPerMonth, setNewUsersPerMonth] = useState([]); // State for new users per month
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true); // Start loading
        const response = await AdminService.getUserStatistics(); // Call the AdminService method
        console.log("Fetched Data:", response); // Log the response to inspect it
  
        // Ensure you're accessing the data inside the response object
        const { data } = response; // Destructure to get the 'data' object
  
        // Now set the states from the 'data' object
        setTotalUsers(data.totalUsers || 0); // Default to 0 if undefined
        setNewUsersPerMonth(data.newUsersPerMonth || []); // Default to empty array if undefined
  
        console.log("Total Users:", data.totalUsers); // Log total users
        console.log("New Users Per Month:", data.newUsersPerMonth); // Log new users per month
      } catch (error) {
        console.error("Error fetching user statistics:", error);
        setError(error.response?.data?.message || "Failed to fetch user statistics. Please try again.");
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    fetchUserStats();
  }, [AdminService]); // Empty dependency array ensures the effect runs only once on mount
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-slate-200 max-w-8xl mx-auto shadow-md">
        <h4 className="text-2xl font-semibold mb-6 border-b-2 border-gray-300 pb-2 text-slate-700">
          User Statistics
        </h4>
        
        {/* Display total users */}
        <div className="mb-4">
          <p className="text-lg font-semibold">Total Users: {totalUsers}</p>
        </div>

        {/* Display new users per month */}
        <h2 className="text-xl font-semibold mb-4">New Users Per Month</h2>
        {Array.isArray(newUsersPerMonth) && newUsersPerMonth.length > 0 ? (
          <table className="min-w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
            <thead>
              <tr>
                <th className="border-b py-2 px-4 text-left">Month</th>
                <th className="border-b py-2 px-4 text-left">New Users</th>
              </tr>
            </thead>
            <tbody>
              {newUsersPerMonth.map((entry, index) => (
                <tr key={index}> {/* Use index if month is not unique */}
                  <td className="border-b py-2 px-4">{getMonthName(entry.month)}</td>
                  <td className="border-b py-2 px-4">{entry.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available for new users per month.</p>
        )}
      </div>
    </div>
  );
};

// Format month names
const getMonthName = (monthNumber) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthNumber - 1] || "Unknown";
};

export default AdminViewUserStatistics;
