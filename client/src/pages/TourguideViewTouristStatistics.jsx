import React, { useState } from 'react';
import TourGuideSideNav from '../components/SidenavTourguide'; // Import the Sidebar
import TourguideService from '../services/Tourguideservice';

const TourguideViewTouristStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [month, setMonth] = useState('');
  const [totalTourists, setTotalTourists] = useState(0);

  const handleFetchStatistics = async () => {
    if (!month) {
      setError('Please enter a month.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await TourguideService.viewTouristStatistics(month);
      console.log(response);
     // const data = Array.isArray(response.data) ? response.data : []; // Ensure `data` is an array

      //console.log(`Filtered Data for Month: ${month}`, data);

      // Calculate total tourists
      setStatistics(response.data.itineraries);
      setTotalTourists(response.data.totalTourists);
    } catch (err) {
      console.error('Error fetching statistics:', err.message);
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <TourGuideSideNav />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 shadow-lg">
        <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl text-center font-bold mb-6 text-gray-800">Tourist Statistics</h2>

          {/* Input Fields for Month */}
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">Month:</label>
              <input
                type="number"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="Enter Month (1-12)"
                min="1"
                max="12"
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
              />
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
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Total Tourists: {totalTourists}</h3>

              {/* Statistics Table */}
              {statistics.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
                  <thead>
                    <tr className="bg-slate-700 text-white">
                      <th className="py-2 px-4 text-left">Itinerary Title</th>
                      <th className="py-2 px-4 text-left">Number of Tourists</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.map((stat) => (
                      <tr key={stat._id} className="hover:bg-gray-50">
                        <td className="py-2 px-4">{stat.itineraryName}</td>
                        <td className="py-2 px-4">{stat.touristCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-slate-700">No tourist statistics available for the selected month.</p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TourguideViewTouristStatistics;
