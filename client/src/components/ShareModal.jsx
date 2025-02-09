import React from 'react';
import touristService from '../services/touristService';

const ShareModal = ({ isOpen, onClose, resourceId, resourceType, email, onEmailChange }) => {
    const handleShare = async () => {
        if (!email) {
            alert("Please enter an email address.");
            return;
        }

        try {
            await touristService.shareResource({
                resourceType,
                resourceId,
                email,
            });
            alert("Resource shared successfully!");
            onClose(); // Close the modal after sharing
        } catch (error) {
            alert(`Failed to share resource: ${error.message}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl transform transition-all duration-300 max-w-md w-full">
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-200 text-xl font-semibold"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Share this {resourceType}
                </h2>

                <input
                    type="email"
                    className="border border-gray-300 focus:border-blue-400 p-3 rounded w-full mb-6 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter recipient's email"
                    value={email}
                    onChange={onEmailChange}
                />

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleShare}
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-200 shadow"
                    >
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
