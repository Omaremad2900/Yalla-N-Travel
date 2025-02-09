import React, { useState, useEffect } from 'react'; 
import AdminService from '../services/adminService'; // Adjust the import path accordingly
import SideNav from '../components/adminSidenav';
import { FaCheckCircle, FaTrashAlt, FaEye } from 'react-icons/fa'; // Add Eye icon for view link
import ViewDocumentModal from '../components/ViewDocumentModal'; // Import the modal component

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [selectedUserId, setSelectedUserId] = useState(null); // Track the selected user ID for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AdminService.getAllUsers(currentPage, itemsPerPage);
        console.log(response);
        if (response && response.data && Array.isArray(response.data)) {
          setUsers(response.data);
          setCurrentPage(response.currentPage);
          setTotalPages(response.totalPages);
          setTotalItems(response.totalItems);
        } else {
          console.error('Unexpected Users Response:', response);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await AdminService.deleteAccount(userId);
        if (response) {
          setUsers(users.filter((user) => user._id !== userId));
        } else {
          alert('Failed to delete user.');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleAcceptUser = async (userId) => {
    if (window.confirm('Are you sure you want to accept this user?')) {
      try {
        const response = await AdminService.acceptUser(userId);
        if (response) {
          alert('User accepted successfully');
          setUsers(users.map(user => user._id === userId ? { ...user, isAccepted: true } : user));
        } else {
          alert('Failed to accept user.');
        }
      } catch (error) {
        console.error('Error accepting user:', error);
      }
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDocuments = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  return (
    <div className="flex bg-gray-50">
      <SideNav />
      <div className="flex-1 bg-gray-50 rounded-lg shadow-md">
        <div className="bg-gray-50 max-w-4xl mx-auto mt-10">
          <h3 className="text-2xl font-bold mb-4 text-slate-700">Manage Users</h3>

          {users.length === 0 ? (
            <p className="text-slate-500">No users found.</p>
          ) : (
            <table className="min-w-full bg-white shadow rounded mb-4">
              <thead>
                <tr className="bg-slate-100">
                  <th className="py-2 px-4 border-b text-left text-blue-800">Username</th>
                  <th className="py-2 px-4 border-b text-left text-blue-800">Email</th>
                  <th className="py-2 px-4 border-b text-left text-blue-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="py-2 px-4 border-b text-black">{user.username}</td>
                    <td className="py-2 px-4 border-b text-black">{user.email}</td>
                    <td className="py-2 px-4 border-b flex space-x-4">
                      {!user.isAccepted && (
                        <button 
                          onClick={() => handleAcceptUser(user._id)} 
                          className="text-green-500 hover:underline flex items-center">
                          <FaCheckCircle className="mr-2" /> Accept
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteUser(user._id)} 
                        className="text-red-500 hover:underline flex items-center">
                        <FaTrashAlt className="mr-2" /> Delete
                      </button>
                      <button 
                        onClick={() => handleViewDocuments(user._id)} 
                        className="text-blue-500 hover:underline flex items-center">
                        <FaEye className="mr-2" /> View Documents
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-300 rounded disabled:opacity-50 hover:bg-slate-400"
            >
              Previous
            </button>
            <span className="text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-300 rounded disabled:opacity-50 hover:bg-slate-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add the modal here */}
      <ViewDocumentModal 
        userId={selectedUserId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default ManageUsers;
