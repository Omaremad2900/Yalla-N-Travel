import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';

const CheckoutFormOrder = ({ PaymentService }) => {
  const location = useLocation();
  const { orderId } = location.state || {};
  const { promoCode } = location.state || {};
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (orderId) {
      PaymentService.createPaymentIntentForOrder(orderId,promoCode)
        .then((data) => {
          setClientSecret(data.paymentIntent.clientSecret);
        })
        .catch((err) => {
          console.error("Failed to create payment intent:", err);
          setError("Failed to initialize payment. Please try again later.");
        });
    }
  }, [orderId, PaymentService]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe has not been initialized properly.");
      setProcessing(false);
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setSucceeded(true);
      setProcessing(false);
    }
  };

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-center">No Order to process for payment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full bg-white p-16 rounded-2xl shadow-2xl">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-800">Complete Your Payment</h2>
        <div className="mb-8">
          <CardElement className="p-4 border border-gray-400 rounded-lg text-xl" />
        </div>
        <button 
          className={`w-full bg-blue-700 text-white text-xl font-bold py-5 rounded-lg transition duration-300 ease-in-out hover:bg-blue-800 ${
            (processing || succeeded) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={processing || succeeded}>
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
        {error && <div className="text-red-600 text-center mt-6 text-lg">{error}</div>}
        {succeeded && <div className="text-green-600 text-center mt-6 text-lg">Payment succeeded!</div>}
      </form>
    </div>
  );
};

export default CheckoutFormOrder;
