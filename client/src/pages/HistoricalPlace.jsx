import React, { useEffect, useState } from 'react';
import TourismSidenav from '../components/TourismSidenav';

const HistoricalPlaces = ({ tourismgovernorService }) => {
  const [places, setPlaces] = useState([]);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    location: '',
    openingHours: '',
    ticketPrices: '',
    start_date: '',
    end_date: '',
    pictures: []
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const response = await tourismgovernorService.fetchPlaces(page, 10);
        console.log("API Response:", response);
        if (response.success) {
          setPlaces(response.data.docs);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching historical places:', error);
      }
    };

    fetchHistoricalPlaces();
  }, [tourismgovernorService, page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleEditPlace = async (id) => {
    try {
      const response = await tourismgovernorService.editHistoricalPlace(id, formValues);
      if (response.success) {
        setPlaces(places.map((place) => (place._id === id ? { ...place, ...formValues } : place)));
        setEditingPlace(null);
      }
    } catch (error) {
      console.error('Error updating place:', error);
    }
  };

  const startEditing = (place) => {
    setEditingPlace(place._id);
    setFormValues({
      name: place.name,
      description: place.description,
      location: place.location,
      openingHours: place.openingHours,
      ticketPrices: place.ticketPrices,
      start_date: place.start_date,
      end_date: place.end_date,
      pictures: place.pictures
    });
  };

  const handleDeletePlace = async (id) => {
    try {
      const response = await tourismgovernorService.deletePlace(id);
      if (response.success) {
        setPlaces(places.filter((place) => place._id !== id));
      }
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  const handlePagination = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex">
      <TourismSidenav />
      <div className="p-8 flex-1 font-sans">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Historical Places</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.length > 0 ? (
            places.map((place) => (
              <div key={place._id} className="border border-gray-300 rounded-lg p-6 bg-gray-50 shadow-md">
                {editingPlace === place._id ? (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formValues.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      className="w-full p-3 mb-4 border border-gray-300 rounded"
                    />
                    <textarea
                      name="description"
                      value={formValues.description}
                      onChange={handleInputChange}
                      placeholder="Description"
                      className="w-full p-3 mb-4 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      name="location"
                      value={formValues.location}
                      onChange={handleInputChange}
                      placeholder="Location"
                      className="w-full p-3 mb-4 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      name="openingHours"
                      value={formValues.openingHours}
                      onChange={handleInputChange}
                      placeholder="Opening Hours"
                      className="w-full p-3 mb-4 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      name="ticketPrices"
                      value={formValues.ticketPrices}
                      onChange={handleInputChange}
                      placeholder="Ticket Prices"
                      className="w-full p-3 mb-4 border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => handleEditPlace(place._id)}
                      className="px-6 py-2 bg-green-500 text-white rounded-md mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPlace(null)}
                      className="px-6 py-2 bg-red-500 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                    <p className="mb-2">{place.description}</p>
                    <p className="mb-2"><strong>Location:</strong> {place.location}</p>
                    <p className="mb-2"><strong>Opening Hours:</strong> {place.openingHours}</p>
                    <p className="mb-2"><strong>Ticket Prices:</strong> ${place.ticketPrices}</p>
                    {place.pictures && place.pictures.length > 0 && (
                      <div className="mb-4">
                        <strong>Pictures:</strong>
                        <div className="mt-2">
                          {place.pictures.map((src, index) => (
                            <img
                              key={index}
                              src={src}
                              alt={`${place.name} picture ${index + 1}`}
                              className="w-full h-32 object-cover rounded-md mb-2"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="mb-2">
                      <strong>Event Dates:</strong>{' '}
                      {new Date(place.start_date).toLocaleDateString()} - {new Date(place.end_date).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => startEditing(place)}
                      className="px-4 py-2 bg-slate-700 text-white rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlace(place._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center col-span-full">No historical places found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePagination(page - 1)}
            className="px-4 py-2 bg-gray-300 text-white rounded-l-md"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-lg">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePagination(page + 1)}
            className="px-4 py-2 bg-gray-300 text-white rounded-r-md"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoricalPlaces;
