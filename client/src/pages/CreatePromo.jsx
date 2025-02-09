import React, { useState } from 'react';
import AdminService from '../services/adminService'; // Adjust the import path accordingly
import AdminSideNav from '../components/adminSidenav'; // Side navigation for admins

const CreatePromoCode = () => {
  const [promoCodeName, setPromoCodeName] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [responseMessage, setResponseMessage] = useState(null);

  // Handler for creating a promo code
  const handleCreatePromoCode = async (e) => {
    e.preventDefault();

    const requestData = {
      name: promoCodeName,
      discountPercentage: parseFloat(discountPercentage),
      expirationDate: expirationDate || null,
    };

    try {
      // Call the service to create a promo code
      const response = await AdminService.createPromoCode(requestData);
      console.log(response);
      alert('Promo code created successfully!');

      // Reset form fields
      setPromoCodeName('');
      setDiscountPercentage('');
      setExpirationDate('');
    } catch (error) {
      console.error('Error creating promo code:', error.response ? error.response.data : error.message);
     alert(
        'Failed to create promo code: ' +
        (error.response && error.response.data.message
          ? error.response.data.message
          : error.message)
      );
    }
  };

  return (
    <div className="flex">
      <AdminSideNav /> {/* Admin side navigation */}
      <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-12 max-w-xl w-full"> {/* Increased size */}
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center"> {/* Larger title */}
            Create Promo Code
          </h3>
          {/* Promo code creation form */}
          <form onSubmit={handleCreatePromoCode} className="mt-8">
            <div className="mb-6">
              <input
                type="text"
                value={promoCodeName}
                onChange={(e) => setPromoCodeName(e.target.value)}
                placeholder="Promo Code Name"
                required
                className="w-full border p-3 rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                placeholder="Discount Percentage"
                required
                min="1"
                max="100"
                step="0.1"
                className="w-full border p-3 rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                placeholder="Expiration Date"
                className="w-full border p-3 rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-700 text-white border-2 border-slate-700 py-3 px-8 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 focus:outline-none w-full"
            >
              Create Promo Code
            </button>
          </form>
  
          {responseMessage && (
            <div className="mt-6 text-center text-gray-700">
              {responseMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  };  
export default CreatePromoCode;
