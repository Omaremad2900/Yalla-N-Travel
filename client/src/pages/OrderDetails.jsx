import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TouristSideNav from '../components/TouristSideNav';

const OrderDetails = ({ touristService }) => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await touristService.getOrderDetails(orderId);
        console.log('Full Response:', response);
        setOrder(response?.orderDetails.orderDetails || {}); // Bind response.orderDetails
      } catch (err) {
        console.error('Error fetching order details:', err.message);
        setError('Failed to fetch order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, touristService]);

  return (
<div className="flex bg-gray-50 min-h-screen">
  <TouristSideNav /> {/* Sidebar */}
  <div className="flex-1 bg-gray-50 rounded-lg shadow-md">
    <div className="bg-gray-50 max-w-4xl mx-auto mt-10">
      <h3 className="text-2xl font-bold mb-4 text-slate-700">Order Details</h3>
      {loading ? (
        <p className="text-center text-slate-500">Loading order details...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        order && (
          <div className="bg-white shadow-md rounded-md p-6">
            <h4 className="text-lg font-bold mb-4 text-slate-700">Order Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p><strong>Order Date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
            </div>
          </div>
        )
      )}
    </div>
  </div>
</div>


  );
};

export default OrderDetails;
