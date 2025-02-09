import React, { useEffect, useState } from 'react';
import TourismSidenav from '../components/TourismSidenav';

const Museums = ({ tourismgovernorService }) => {
  const [museums, setMuseums] = useState([]);
  const [editingMuseum, setEditingMuseum] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch museums with pagination
  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const response = await tourismgovernorService.getMuseums({ page: currentPage, limit });
        if (response.success) {
          setMuseums(response.data.docs);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching museums:', error);
      }
    };

    fetchMuseums();
  }, [tourismgovernorService, currentPage, limit]);

  const handleDelete = async (id) => {
    try {
      await tourismgovernorService.deleteMuseum(id);
      setMuseums((prevMuseums) => prevMuseums.filter((museum) => museum._id !== id));
    } catch (error) {
      console.error('Error deleting museum:', error);
    }
  };

  const handleEditClick = (museum) => {
    setEditingMuseum(museum._id);
    setUpdatedDetails(museum);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await tourismgovernorService.editMuseum(editingMuseum, updatedDetails);
      setMuseums((prevMuseums) =>
        prevMuseums.map((museum) =>
          museum._id === editingMuseum ? updatedDetails : museum
        )
      );
      setEditingMuseum(null);
    } catch (error) {
      console.error('Error updating museum:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex">
      <TourismSidenav />
      <div className="p-8 flex-1 font-sans">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Museums</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {museums.length > 0 ? (
            museums.map((museum) => (
              <div key={museum._id} className="border border-gray-300 rounded-lg p-6 bg-gray-50 shadow-md h-full flex flex-col justify-between">
                {editingMuseum === museum._id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      value={updatedDetails.name || ''}
                      onChange={handleInputChange}
                      placeholder="Museum Name"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <textarea
                      name="description"
                      value={updatedDetails.description || ''}
                      onChange={handleInputChange}
                      placeholder="Description"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      name="location"
                      value={updatedDetails.location || ''}
                      onChange={handleInputChange}
                      placeholder="Location"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      name="openingHours"
                      value={updatedDetails.openingHours || ''}
                      onChange={handleInputChange}
                      placeholder="Opening Hours"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="number"
                      name="ticketPrices"
                      value={updatedDetails.ticketPrices || ''}
                      onChange={handleInputChange}
                      placeholder="Ticket Prices"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-500 text-white p-2 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMuseum(null)}
                      className="w-full bg-red-500 text-white p-2 rounded-md mt-4"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2">{museum.name}</h3>
                    <p className="mb-2">{museum.description}</p>
                    <p><strong>Location:</strong> {museum.location}</p>
                    <p><strong>Opening Hours:</strong> {museum.openingHours}</p>
                    <p><strong>Ticket Prices:</strong> ${museum.ticketPrices}</p>
                    {museum.pictures && museum.pictures.length > 0 && (
                      <div className="mt-4">
                        <strong>Pictures:</strong>
                        <img
                          src={museum.pictures[0]}
                          alt={museum.name}
                          className="w-full h-32 object-cover rounded-md mt-2"
                        />
                      </div>
                    )}
                    <div className="mt-4">
                      <button
                        onClick={() => handleEditClick(museum)}
                        className="bg-slate-700 text-white py-2 px-4 rounded-md mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(museum._id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-center col-span-full">No museums found.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-300 text-white px-6 py-2 rounded-md mr-4"
          >
            Previous
          </button>
          <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-white px-6 py-2 rounded-md ml-4"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Museums;
