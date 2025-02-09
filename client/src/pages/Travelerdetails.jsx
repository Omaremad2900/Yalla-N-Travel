import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SideNav from '../components/TouristSideNav';

const Travelerdetails = ({ bookingService }) => {
    const navigate = useNavigate(); // Initialize navigate
    const [formData, setFormData] = useState({
        id: '1', // Hardcoded for now, can be generated dynamically
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        emailAddress: '',
        countryCallingCode: '',
        phoneNumber: '',
        deviceType: 'MOBILE', // Default value for device type
        documentType: '',
        birthPlace: '',
        issuanceLocation: '',
        issuanceDate: '',
        documentNumber: '',
        expiryDate: '',
        issuanceCountry: '',
        validityCountry: '',
        nationality: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Format the dates to "YYYY-MM-DD"
        const formattedDateOfBirth = formData.dateOfBirth;
        const formattedIssuanceDate = formData.issuanceDate;
        const formattedExpiryDate = formData.expiryDate;

        const payload = {
            travelers: [
                {
                    id: formData.id,
                    dateOfBirth: formattedDateOfBirth,
                    name: {
                        firstName: formData.firstName.toUpperCase(),
                        lastName: formData.lastName.toUpperCase()
                    },
                    gender: formData.gender.toUpperCase(),
                    contact: {
                        emailAddress: formData.emailAddress,
                        phones: [
                            {
                                deviceType: formData.deviceType,
                                countryCallingCode: formData.countryCallingCode,
                                number: formData.phoneNumber
                            }
                        ]
                    },
                    documents: [
                        {
                            documentType: formData.documentType.toUpperCase(),
                            birthPlace: formData.birthPlace,
                            issuanceLocation: formData.issuanceLocation,
                            issuanceDate: formattedIssuanceDate,
                            number: formData.documentNumber,
                            expiryDate: formattedExpiryDate,
                            issuanceCountry: formData.issuanceCountry,
                            validityCountry: formData.validityCountry,
                            nationality: formData.nationality,
                            holder: true
                        }
                    ]
                }
            ]
        };

        try {
            await bookingService.saveBookingDetails(payload);
            alert('Traveler details saved successfully!');
            navigate('/bookflight'); // Redirect to Bookflight
        } catch (error) {
            console.error('Error saving traveler details:', error);
            alert('Failed to save traveler details.');
        }
    };

    return (
        <div className="flex bg-slate-100 min-h-screen">
      {/* Side Navigation */}
      <SideNav />
        <div className=" flex-1 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Traveler Details</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    >
                        <option value="">Select</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email Address</label>
                    <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Country Calling Code</label>
                    <input
                        type="text"
                        name="countryCallingCode"
                        value={formData.countryCallingCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Document Type</label>
                    <input
                        type="text"
                        name="documentType"
                        value={formData.documentType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Birth Place</label>
                    <input
                        type="text"
                        name="birthPlace"
                        value={formData.birthPlace}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Issuance Location</label>
                    <input
                        type="text"
                        name="issuanceLocation"
                        value={formData.issuanceLocation}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Issuance Date</label>
                    <input
                        type="date"
                        name="issuanceDate"
                        value={formData.issuanceDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Document Number</label>
                    <input
                        type="text"
                        name="documentNumber"
                        value={formData.documentNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Expiry Date</label>
                    <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Issuance Country</label>
                    <input
                        type="text"
                        name="issuanceCountry"
                        value={formData.issuanceCountry}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Validity Country</label>
                    <input
                        type="text"
                        name="validityCountry"
                        value={formData.validityCountry}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Nationality</label>
                    <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Submit
                </button>
            </form>
        </div>
        </div>
    );
};

export default Travelerdetails;
