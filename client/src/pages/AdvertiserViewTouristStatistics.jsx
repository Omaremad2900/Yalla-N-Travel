import React, { useState } from 'react';
import AdvertiserSideNav from "../components/advertiserSidenav";

const AdvertiserViewTouristStatistics = ({ advertiserService }) => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [totalTourists, setTotalTourists] = useState(0);

  // Fetch data based on month and year
  const handleFetchStatistics = async () => {
    if (!month ) {
      setError('Please enter both month.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await advertiserService.viewTouristStatistics(month);
      const data = response;
  
      console.log(`Filtered Data for Month: ${month}`, data);
      setStatistics(data.activities|| []);
      setTotalTourists(data.totalTourists || 0); // Use totalTourists directly if available
    } catch (err) {
      console.error('Error fetching statistics:', err.message);
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='flex'>
      <AdvertiserSideNav />
      <div className="flex-1 p-3 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl text-center font-semibold text-slate-700 my-7">Tourist Statistics</h1>

        {/* Input Fields for Month and Year */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-4">
            <div>
              <label className="block text-slate-700 font-semibold">Month:</label>
              <input
                type="number"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="Enter Month"
                min="1"
                max="12"
                className="mt-1 px-3 py-2 border border-gray-300 rounded-lg w-full"
              />
            </div>
          </div>
          <button
            onClick={handleFetchStatistics}
            className="py-2 px-4 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition"
          >
            Fetch Statistics
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && <div className="text-center text-slate-700">Loading statistics...</div>}

        {/* Error Message */}
        {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</div>}

        {/* Total Tourists */}
        {!loading && !error && (
          <>
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">Total Tourists: {totalTourists}</h2>

        {/* Statistics Table */}
{statistics.length > 0 ? (
  <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
    <thead>
      <tr className="bg-slate-700 text-white">
        <th className="py-2 px-4 text-left">Activity name</th>
        <th className="py-2 px-4 text-left">Number of Tourists</th>
      </tr>
    </thead>
    <tbody>
      {statistics.map((stat, index) => (
        <tr key={index} className="hover:bg-gray-50">
          <td className="py-2 px-4">{stat.activityName}</td>
          <td className="py-2 px-4">{stat.touristCount}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p className="text-center text-slate-700">No tourist statistics available for the selected month and year.</p>
)}

          </>
        )}
      </div>
    </div>

  );
};

export default AdvertiserViewTouristStatistics;
