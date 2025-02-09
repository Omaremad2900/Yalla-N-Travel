import React, { useState, useEffect } from 'react';
import TouristSideNav from '../components/TouristSideNav';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'; // Icon for Edit button
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'; // Icon for Delete button

const MyAddress = ({ touristService }) => {
    const [addresses, setAddresses] = useState([]);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formValues, setFormValues] = useState({ street: '', city: '', state: '', zipCode: '' });
    const [defaultAddressId, setDefaultAddressId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await touristService.getMyAddresses();
                const data = response.data || [];
                setAddresses(data);
                const defaultAddr = data.find((addr) => addr.defaultAddress);
                if (defaultAddr) setDefaultAddressId(defaultAddr._id);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchAddresses();
    }, []);

    const handleDelete = async (addressId) => {
        try {
            await touristService.deleteAddress(addressId);
            setAddresses(addresses.filter((addr) => addr._id !== addressId));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setFormValues({
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
        });
    };

    const handleUpdate = async () => {
        try {
            const updatedData = { ...formValues };
            await touristService.updateAddress(editingAddress._id, updatedData);
            setAddresses((prev) =>
                prev.map((addr) => (addr._id === editingAddress._id ? { ...addr, ...updatedData } : addr))
            );
            setEditingAddress(null);
            setFormValues({ street: '', city: '', state: '', zipCode: '' });
        } catch (error) {
            setError(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSetDefault = async (addressId) => {
        try {
            await touristService.setDefaultAddress(addressId);
            setDefaultAddressId(addressId);
            setAddresses((prev) =>
                prev.map((addr) => (addr._id === addressId ? { ...addr, defaultAddress: true } : { ...addr, defaultAddress: false }))
            );
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex">
            {/* Side Navigation */}
            <TouristSideNav />

            {/* Main Content */}
            <div className="flex-1 max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">My Addresses</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="space-y-4">
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center"
                        >
                            <div>
                                <p><strong>Street:</strong> {address.street}</p>
                                <p><strong>City:</strong> {address.city}</p>
                                <p><strong>State:</strong> {address.state}</p>
                                <p><strong>ZIP Code:</strong> {address.zipCode}</p>
                                <p><strong>Country:</strong> {address.country}</p>
                            </div>
                            <div className="space-x-2 flex items-center">
                                <input
                                    type="checkbox"
                                    checked={defaultAddressId === address._id}
                                    onChange={() => handleSetDefault(address._id)}
                                    className="h-5 w-5 text-blue-600"
                                />
                                <label className="text-sm text-gray-600">
                                    Default Address
                                </label>
                                <button
                                    onClick={() => handleEdit(address)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-400"
                                >
                                    <EditOutlinedIcon fontSize="small" className="mr-1" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(address._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center hover:bg-red-400"
                                >
                                    <DeleteOutlinedIcon fontSize="small" className="mr-1" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {editingAddress && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Edit Address</h2>
                        <input
                            type="text"
                            name="street"
                            value={formValues.street}
                            onChange={handleInputChange}
                            placeholder="Street"
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            name="city"
                            value={formValues.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            name="state"
                            value={formValues.state}
                            onChange={handleInputChange}
                            placeholder="State"
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            name="zipCode"
                            value={formValues.zipCode}
                            onChange={handleInputChange}
                            placeholder="ZIP Code"
                            className="w-full p-2 border rounded-lg"
                        />
                        <div className="space-x-2 mt-4">
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditingAddress(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAddress;
