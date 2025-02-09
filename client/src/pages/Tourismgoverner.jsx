import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const TourismGovernor = ({ tourismgovernorService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [places, setPlaces] = useState([]);
  const [placeDetails, setPlaceDetails] = useState({
    id: '',
    name: '',
    description: '',
    pictures: [],
    location: '',
    openingHours: '',
    ticketPrices: '',
    tags: [],
    start_date: '',
    end_date: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [showItineraries, setShowItineraries] = useState(false);
  const [showMuseums, setShowMuseums] = useState(false);
  const [showHistoricalPlaces, setShowHistoricalPlaces] = useState(false);

  // Fetch places when component mounts
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const fetchedPlaces = await tourismgovernorService.fetchPlaces();
        setPlaces(fetchedPlaces);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    loadPlaces();
  }, [tourismgovernorService]);

  // Handle input changes for place details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaceDetails({
      ...placeDetails,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = await Promise.all(files.map(uploadPicture)); // uploadPicture function needs to be defined
    setPlaceDetails((prevDetails) => ({
      ...prevDetails,
      pictures: [...prevDetails.pictures, ...uploadedUrls],
    }));
  };

  const uploadPicture = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await tourismgovernorService.uploadPicture(formData); // Ensure this function is defined in your service
      return response.data.url; // Adjust according to your API response
    } catch (error) {
      console.error('Error uploading picture:', error);
      return null; // Handle upload error
    }
  };

  // Manage tags
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput && !placeDetails.tags.includes(tagInput)) {
      setPlaceDetails((prevDetails) => ({
        ...prevDetails,
        tags: [...prevDetails.tags, tagInput],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setPlaceDetails((prevDetails) => ({
      ...prevDetails,
      tags: prevDetails.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Function to handle adding a new museum or historical place
  const handleAddPlace = async (e) => {
    e.preventDefault();
    try {
      const newPlace = await tourismgovernorService.addPlace(placeDetails);
      setPlaces([...places, newPlace]);
      resetPlaceDetails();
    } catch (error) {
      console.error('Error adding place:', error);
    }
  };

  // Function to handle deleting a place
  const handleDeletePlace = async (id) => {
    try {
      await tourismgovernorService.deletePlace(id);
      setPlaces(places.filter((place) => place.id !== id));
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  // Function to handle editing a place
  const handleEditPlace = (place) => {
    setPlaceDetails(place);
  };

  // Function to handle updating a place
  const handleUpdatePlace = async (e) => {
    e.preventDefault();
    try {
      const updatedPlace = await tourismgovernorService.editPlace(placeDetails.id, placeDetails);
      setPlaces(places.map((place) => (place.id === placeDetails.id ? updatedPlace : place)));
      resetPlaceDetails();
    } catch (error) {
      console.error('Error updating place:', error);
    }
  };

  // Reset place details
  const resetPlaceDetails = () => {
    setPlaceDetails({
      id: '',
      name: '',
      description: '',
      pictures: [],
      location: '',
      openingHours: '',
      ticketPrices: '',
      tags: [],
      start_date: '',
      end_date: ''
    });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-slate-200 p-4 h-screen">
        <h2 className="text-xl font-bold mb-4">Tourism Governor Dashboard</h2>
        <ul className="space-y-2">
          <li>
            <button
              className="w-full text-left p-2 rounded hover:bg-slate-300"
              onClick={() => setShowItineraries(!showItineraries)}
            >
              {showItineraries ? 'Hide Itineraries' : 'View Itineraries'}
            </button>
          </li>
          <li>
            <button
              className="w-full text-left p-2 rounded hover:bg-slate-300"
              onClick={() => setShowMuseums(!showMuseums)}
            >
              {showMuseums ? 'Hide Museums' : 'View Museums'}
            </button>
          </li>
          <li>
            <button
              className="w-full text-left p-2 rounded hover:bg-slate-300"
              onClick={() => setShowHistoricalPlaces(!showHistoricalPlaces)}
            >
              {showHistoricalPlaces ? 'Hide Historical Places' : 'View Historical Places'}
            </button>
          </li>
          <li>
            <button className="w-full text-left p-2 rounded hover:bg-slate-300">
              Manage Museums and Historical Places
            </button>
          </li>
        </ul>
      </aside>

      {/* Content Area */}
      <div className="w-3/4 p-4">
        {showItineraries && (
          <div>
            <h3 className="text-lg font-semibold">Itineraries</h3>
            <p>List of itineraries goes here...</p>
          </div>
        )}

        {showMuseums && (
          <div>
            <h3 className="text-lg font-semibold">Museums</h3>
            <p>List of museums goes here...</p>
          </div>
        )}

        {showHistoricalPlaces && (
          <div>
            <h3 className="text-lg font-semibold">Historical Places</h3>
            <ul className="list-disc pl-5 mt-4">
              {places.length === 0 ? (
                <p>No historical places available</p>
              ) : (
                places.map((place, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <strong>{place.name}</strong> - Location: {place.location}
                      <div>Description: {place.description}</div>
                      <div>Opening Hours: {place.openingHours}</div>
                      <div>Ticket Prices: {place.ticketPrices}</div>
                      <div>
                        Pictures:
                        {place.pictures.map((picture, i) => (
                          <img
                            key={i}
                            src={picture} // Use the URL directly from the state
                            alt="Place"
                            className="h-20 w-20 object-cover mr-2"
                          />
                        ))}
                      </div>
                      <div>Tags: {place.tags.join(', ')}</div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditPlace(place)}
                        className="text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlace(place.id)}
                        className="text-red-500 ml-2"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* Add or Edit Place Form */}
        <h3 className="text-lg font-semibold">{placeDetails.id ? 'Edit Place' : 'Add Place'}</h3>

        <form onSubmit={placeDetails.id ? handleUpdatePlace : handleAddPlace} className="mt-4">
          <input
            type="text"
            name="name"
            value={placeDetails.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="border border-slate-500 rounded-md p-2 mr-2"
            required
          />
          <input
            type="text"
            name="location"
            value={placeDetails.location}
            onChange={handleInputChange}
            placeholder="Location"
            className="border border-slate-500 rounded-md p-2 mr-2"
            required
          />
          <textarea
            name="description"
            value={placeDetails.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="border border-slate-500 rounded-md p-2 mr-2"
            required
          />
          <input
            type="text"
            name="openingHours"
            value={placeDetails.openingHours}
            onChange={handleInputChange}
            placeholder="Opening Hours"
            className="border border-slate-500 rounded-md p-2 mr-2"
            required
          />
          <input
            type="text"
            name="ticketPrices"
            value={placeDetails.ticketPrices}
            onChange={handleInputChange}
            placeholder="Ticket Prices"
            className="border border-slate-500 rounded-md p-2 mr-2"
            required
          />
          <input
            type="file"
            onChange={handleImageUpload}
            multiple
            accept="image/*"
            className="border border-slate-500 rounded-md p-2 mr-2"
          />
          <div>
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              placeholder="Add a tag"
              className="border border-slate-500 rounded-md p-2 mr-2"
            />
            <button type="button" onClick={handleAddTag} className="bg-blue-500 text-white p-2 rounded">
              Add Tag
            </button>
          </div>
          <div className="mt-2">
            {placeDetails.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700 mr-2">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 text-red-500">
                  &times;
                </button>
              </span>
            ))}
          </div>
          <button type="submit" className="bg-green-500 text-white p-2 rounded mt-4">
            {placeDetails.id ? 'Update Place' : 'Add Place'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TourismGovernor;
