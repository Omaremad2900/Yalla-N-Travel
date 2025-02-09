import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminService from '../services/adminService';
import SideNav from '../components/adminSidenav';
import { FaEye } from 'react-icons/fa';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  
  const [sort, setSort] = useState("desc"); // Default sort order

  
  const [status, setStatus] = useState(""); // Default status (no filter)
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await AdminService.listComplaints(page, limit, sort, status);

        if (response && response.complaints) {
          setComplaints(response.complaints);
          setTotalPages(response.totalPages);
        } else {
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        alert("Complaints can't be found");
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, [page, limit, sort, status]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleViewComplaint = (complaintId) => {
    navigate(`/ComplaintDetails/${complaintId}`);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <div className="flex bg-gray-50">
      <SideNav />
      <div className="flex-1 bg-gray-50 rounded-lg shadow-md">
        <div className="bg-gray-50 max-w-4xl mx-auto mt-10">
          <h3 className="text-2xl font-bold mb-4 text-slate-700">Manage Complaints</h3>

          {/* Sorting and Filtering Controls */}
          <div className="mb-4 flex space-x-4">
            <div>
              <label className="text-slate-700 mr-2">Sort by Date:</label>
              <select value={sort} onChange={handleSortChange} className="px-2 py-1 rounded border">
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 mr-2">Filter by Status:</label>
              <select value={status} onChange={handleStatusChange} className="px-2 py-1 rounded border">
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {complaints.length === 0 ? (
            <p className="text-slate-500">No complaints found.</p>
          ) : (
            <>
              <table className="min-w-full bg-white shadow rounded mb-4 border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="py-2 px-4 border-b text-left text-blue-800">Title</th>
                    <th className="py-2 px-4 border-b text-left text-blue-800">Date</th>
                    <th className="py-2 px-4 border-b text-left text-blue-800">Status</th>
                    <th className="py-2 px-4 border-b text-left text-blue-800">View</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-slate-50">
                      <td className="py-2 px-4 border-b text-black">{complaint.title}</td>
                      <td className="py-2 px-4 border-b text-black">{new Date(complaint.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b text-black">{complaint.status}</td>
                      <td className="py-2 px-4 border-b text-black">
                        <button
                          onClick={() => handleViewComplaint(complaint._id)}
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          <FaEye className="mr-2" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  className="px-4 py-2 bg-slate-300 rounded disabled:opacity-50 hover:bg-slate-400"
                >
                  Previous
                </button>
                <span className="text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-slate-300 rounded disabled:opacity-50 hover:bg-slate-400"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageComplaints;
