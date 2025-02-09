import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TouristSideNav from '../components/TouristSideNav';
import { ProSidebarProvider } from 'react-pro-sidebar';

const PayCart = ({ touristService, PaymentService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [orderId, setOrderId] = useState(null); // Track the created order ID
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAddresses();
    fetchCartItems();
  }, []);

  const fetchUserAddresses = async () => {
    try {
      const response = await touristService.getMyAddresses();
      setAddresses(response.data || []);
      console.log("Addresses fetched:", response.data);
    } catch (err) {
      setError('Failed to fetch addresses. Please try again.');
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await touristService.getProductsInMyCart();
      setCartItems(response.products || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cart items. Please try again.');
      setLoading(false);
    }
  };

  const handleOrderCreation = async () => {
    setError('');
    setSuccessMessage('');
    setOrderLoading(true);

    if (!selectedAddress || !paymentMethod) {
      setError('Please select a delivery address and payment method.');
      setOrderLoading(false);
      return;
    }

    try {
      const orderDetails = {
        paymentMethod,
        deliveryAddress: selectedAddress, // Send the full address object
      };

      const orderResponse = await touristService.createOrder(orderDetails);
      console.log("Order Created:", orderResponse);

      if (orderResponse?.order._id) {
        setOrderId(orderResponse.order._id);
        setSuccessMessage('Order created successfully! Proceed to payment.');
      } else {
        setError('Failed to create order. Please try again.');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  const handlePayment = async () => {
    setError('');
    setSuccessMessage('');
    setPaymentLoading(true);

    if (!orderId) {
      setError('Please create an order before proceeding to payment.');
      return;
    }
  
    
    if (!paymentMethod) {

      setError('Please select a payment method.');
      return;
    }
  
    try {
      if (paymentMethod === 'Wallet') {
        await PaymentService.PaywithWalletForOrder(orderId, promoCode);
        setSuccessMessage('Payment successful using Wallet!');
        navigate('/PaymentSuccess'); // Navigate to PaymentSuccess page
      } else if (paymentMethod === 'Cash') {
        await PaymentService.PaywithCashForOrder(orderId, promoCode);
        setSuccessMessage('Order placed successfully. Pay cash on delivery!');
        navigate('/PaymentSsuccess'); // Navigate to PaymentSuccess page
      } else if (paymentMethod === 'Visa') {
        // Redirect to CheckoutOrder for card payment
        navigate('/CheckoutOrder', { state: { orderId, promoCode } });
      }
    } catch (err) {
      console.error('Error during payment:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };
  

  if (loading) {
    return <p className="text-center text-slate-600">Loading...</p>;
  }

  return (
    <ProSidebarProvider>
      <div className="flex bg-slate-100 min-h-screen">
        <TouristSideNav />
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-slate-700 mb-6">Pay Cart</h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

          {/* Address Selection */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Select Delivery Address</h2>
            {addresses.length === 0 ? (
              <p className="text-slate-600">No addresses found. Please add an address in your profile.</p>
            ) : (
              <ul className="space-y-4">
                {addresses.map((address) => (
                  <li key={address._id} className="border rounded p-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddress?._id === address._id}
                        onChange={() => setSelectedAddress(address)}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-600">
                        {address.street}, {address.city}, {address.zipCode}, {address.country}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Payment Method Selection */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Select Payment Method</h2>
            <div className="space-y-4">
              {['Wallet', 'Visa', 'Cash'].map((method) => (
                <label key={method} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-600">Pay with {method}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Promo Code Input */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Apply Promo Code</h2>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code (optional)"
              className="w-full p-2 border rounded-md"
            />
          </section>

          {/* Cart Summary */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Cart Summary</h2>
            {cartItems.length === 0 ? (
              <p className="text-slate-600">No items in the cart.</p>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.productId} className="border rounded p-4">
                    <p className="text-slate-600">
                      <strong>{item.productName}</strong> - {item.quantity} x ${item.price}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Buttons */}
          <div className="flex space-x-4">
            {!orderId && (
              <button
                onClick={handleOrderCreation}
                className={`px-6 py-3 text-white rounded-lg ${orderLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={orderLoading}
              >
                {orderLoading ? 'Creating Order...' : 'Create Order'}
              </button>
            )}

            {orderId && (
              <button
                onClick={handlePayment}
                className={`px-6 py-3 text-white rounded-lg ${paymentLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Processing Payment...' : 'Proceed to Payment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </ProSidebarProvider>
  );
};

export default PayCart;
