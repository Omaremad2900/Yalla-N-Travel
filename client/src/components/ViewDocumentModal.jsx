import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import AdminService from '../services/adminService';

const ViewDocumentModal = ({ userId, isOpen, onClose }) => {
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    if (userId && isOpen) {
      const fetchDocuments = async () => {
        try {
          const response = await AdminService.viewDocuments(userId);
          setDocuments(response); // Set the entire response object to access credentials and nationalId
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      };

      fetchDocuments();
    }
  }, [userId, isOpen]);

  const closeModal = () => {
    setDocuments(null); // Clear documents when closing modal
    onClose();
  };

  return (
    <ReactModal
  isOpen={isOpen}
  onRequestClose={closeModal}
  ariaHideApp={false}
  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
  overlayClassName="fixed inset-0 bg-grey bg-opacity-60 z-50"
>
<div className="bg-white p-6 relative flex flex-col space-y-6">
  <button
    onClick={closeModal}
    aria-label="Close"
    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition duration-200"
  >
    &times;
  </button>

  <div className="text-center mb-6">
    <h2 className="text-2xl font-semibold text-gray-800">User Documents</h2>
  </div>

  <div className="flex flex-wrap gap-8 justify-center">
    {documents ? (
      <>
        {documents.credentials && (
          <div className="flex flex-col items-center space-y-4">
            <span className="font-medium text-gray-700 text-lg">Credentials</span>
            <img
              src={documents.credentials}
              alt="Credentials Document"
              className="w-64 h-auto rounded-lg shadow-lg"
            />
          </div>
        )}
        {documents.nationalId && (
          <div className="flex flex-col items-center space-y-4">
            <span className="font-medium text-gray-700 text-lg">National ID</span>
            <img
              src={documents.nationalId}
              alt="National ID Document"
              className="w-64 h-auto rounded-lg shadow-lg"
            />
          </div>
        )}
      </>
    ) : (
      <p className="text-gray-600 text-lg">No documents found for this user.</p>
    )}
  </div>

  <button
    onClick={closeModal}
    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200"
  >
    Close
  </button>
</div>


     
    </ReactModal>
  );
};

export default ViewDocumentModal;
