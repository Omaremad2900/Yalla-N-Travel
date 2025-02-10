import React, { useEffect, useState } from 'react';
import TouristSideNav from '../components/TouristSideNav';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ViewOrders = ({ touristService }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({});
    
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const response = await touristService.getAllMyOrders(page, limit);
          if (response?.orders?.data) {
            setOrders(response.orders.data);
            setPagination(response.orders.pagination || {});
          } else {
            setOrders([]);
            setPagination({});
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch orders. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }, [page, limit]);
  
    const handleNextPage = () => {
      if (page < pagination.totalPages) setPage(page + 1);
    };
  
    const handlePreviousPage = () => {
      if (page > 1) setPage(page - 1);
    };
  
    const handleViewOrder = (orderId) => {
      navigate(`/OrderDetails/${orderId}`);
    };
  
    const handleCancelOrder = async (orderId) => {
      try {
        const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
        if (!confirmCancel) return;
    
        // Call the service to cancel the order
        await touristService.cancelOrder(orderId);
    
        // Update the status of the canceled order in the state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: 'Cancelled' } : order
          )
        );
    
        alert('Order canceled successfully.');
      } catch (err) {
        console.error(err);
        alert('Failed to cancel the order. Please try again later.');
      }
    };
    
  
    return (
      <ProSidebarProvider>
        <div className="flex bg-slate-50">
          <TouristSideNav />
          <div className="flex-1 bg-gray-50 rounded-lg shadow-md">
            <div className="bg-gray-50 max-w-4xl mx-auto mt-10">
              <h3 className="text-2xl font-bold mb-4 text-slate-700">Your Orders</h3>
  
              {loading ? (
                <p>Loading orders...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : orders.length === 0 ? (
                <p className="text-slate-500">No orders found.</p>
              ) : (
                <>
                  <table className="min-w-full bg-white shadow rounded mb-4 border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="py-2 px-4 border-b text-left text-blue-800">Order ID</th>
                        <th className="py-2 px-4 border-b text-left text-blue-800">Status</th>
                        <th className="py-2 px-4 border-b text-left text-blue-800">Date</th>
                        <th className="py-2 px-4 border-b text-left text-blue-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-50">
                          <td className="py-2 px-4 border-b text-black">{order._id}</td>
                          <td className="py-2 px-4 border-b text-black">{order.orderStatus}</td>
                          <td className="py-2 px-4 border-b text-black">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-4 border-b text-black">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewOrder(order._id)}
                                className="text-blue-500 hover:underline flex items-center"
                              >
                                <FaEye className="mr-2" /> View
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="text-red-500 hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
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
                      Page {page} of {pagination.totalPages || 1}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={page === pagination.totalPages}
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
      </ProSidebarProvider>
    );
  };
  
  export default ViewOrders;
  