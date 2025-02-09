import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdvertiserSideNav from '../components/advertiserSidenav';

const CreateTransportation = ({ advertiserService }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        from: '',
        to: '',
        price: 0,
        departureTime: '',
        arrivalTime: '',
        availableSeats: 0
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();  // To navigate after the form is successfully submitted

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const transportationData = {
                name: formData.name,
                type: formData.type,
                from: formData.from,
                to: formData.to,
                price: formData.price,
                departureTime: formData.departureTime,
                arrivalTime: formData.arrivalTime,
                availableSeats: formData.availableSeats
            };

            // Call the API to create the transportation
            const response = await advertiserService.createTransportation(transportationData);
            console.log('Transportation created successfully:', response);
            alert('Transportation created successfully!');
            setError('');
            // Optionally, redirect after success
            // navigate('/transportation-list'); 
        } catch (err) {
            alert('Failed to create transportation');
            setError('Failed to create transportation');
            setSuccess('');
            console.error(err);
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdvertiserSideNav />
            <div className="flex-1 p-6 bg-white rounded-lg shadow-md mx-4 my-4 max-w-full">
                <h2 className="text-2xl font-semibold text-center mb-6">Create Transportation</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && <div className="text-green-500 mb-4">{success}</div>}
                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    >
                        <option value="">Select a type</option>
                        <option value="bus">Bus</option>
                        <option value="train">Train</option>
                        <option value="flight">Flight</option>
                        <option value="ferry">Ferry</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
                    <input
                        type="text"
                        id="from"
                        name="from"
                        value={formData.from}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
                    <input
                        type="text"
                        id="to"
                        name="to"
                        value={formData.to}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700">Departure Time</label>
                    <input
                        type="datetime-local"
                        id="departureTime"
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700">Arrival Time</label>
                    <input
                        type="datetime-local"
                        id="arrivalTime"
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700">Available Seats</label>
                    <input
                        type="number"
                        id="availableSeats"
                        name="availableSeats"
                        value={formData.availableSeats}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    />
                </div>
                <div className="mb-4 text-center">
                        <button type="submit" className="bg-slate-700 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
                            Create Transportation
                        </button>
                    </div>
            </form>
        </div>
        </div>
    );
};

export default CreateTransportation;
