
import SideNav from '../components/TouristSideNav';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reverseGeoCode } from '../utils/geoCode';
import CurrencyConverter from '../utils/currencyConverter';
import Select from 'react-select';
import ShareModal from '../components/ShareModal';
import { FaStar, FaRegStar } from 'react-icons/fa';
const TouristDashboard = ({ touristService }) => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [convertedPrices, setConvertedPrices] = useState([]);
  const [prices, setPrices] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  // Filter states
  const [budget, setBudget] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [preferenceOptions, setPreferenceOptions] = useState([]);
  const [userPreferences, setUserPreferences] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [language, setLanguage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [email, setEmail] = useState('');
  // Sort state
  const [sortOption, setSortOption] = useState('');
  const options = [
    { value: 'Default', label: 'Default' },
    { value: `myPreferences`, label: 'My Preferences' },
    ...preferenceOptions.map(preference => ({ value: preference.name, label: preference.name })),
  ];
  const tagOptions = [
    { value: "Default", label: "Default" },
    ...tagsOptions.map(tag => ({ value: tag.name, label: tag.name }))
  ]

  // Pagination state for activities
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesTotalPages, setActivitiesTotalPages] = useState(1);
  // Pagination for itineraries
  const [itinerariesPage, setItinerariesPage] = useState(1);
  const [itinerariesTotalPages, setItinerariesTotalPages] = useState(1);
  // Pagination for museums
  const [museumsPage, setMuseumsPage] = useState(1);
  const [museumsTotalPages, setMuseumsTotalPages] = useState(1);
  // Pagination for historical places
  const [historicalPlacesPage, setHistoricalPlacesPage] = useState(1);
  const [historicalPlacesTotalPages, setHistoricalPlacesTotalPages] = useState(1);

  // State for location addresses
  const [locationAddresses, setLocationAddresses] = useState({});
  const [itineraryPrices, setItineraryPrices] = useState([]);
  const [museumTicketPrices, setMuseumTicketPrices] = useState([]);
  const [historicalPlacesTicketPrices, setHistoricalPlacesTicketPrices] = useState([]);
  const [activitiesPrices, setActivitiesPrices] = useState([]);
  useEffect(() => {
    // Store itinerary prices and museum ticket prices on mount
    const itineraryPrices = itineraries.map(itinerary => itinerary.budget);
    const museumPrices = museums.map(museum => museum.ticketPrices);
    const activitiesPrices = activities.map(activity => activity.budget);
    const historicalPlacesPrices = historicalPlaces.map(place => place.ticketPrices);
    setItineraryPrices(itineraryPrices);
    setMuseumTicketPrices(museumPrices);
    setHistoricalPlacesTicketPrices(historicalPlacesPrices);
    setActivitiesPrices(activitiesPrices);
  }, [itineraries, museums, historicalPlaces, activities]);


  // Fetch itineraries from API
  useEffect(() => {
    const fetchItineraries = async (page = 1, limit = 6) => {
      try {
        const response = await touristService.getAllItineraries(page, limit);
        console.log(response);

        if (response.data && Array.isArray(response.data)) {
          const formattedItineraries = response.data.map(itinerary => {
            const locations = Array.isArray(itinerary.locations) ? itinerary.locations : [];

            return {
              id: itinerary._id,
              Title: itinerary.title,
              timeline: itinerary.timeline,
              activities: itinerary.activities.map(activity => activity.name).join(", "),
              locations: locations, // Store locations as an array for use in fetchLocationAddresses
              budget: itinerary.price,
              rating: itinerary.ratings || 'N/A',
              tags: itinerary.activities.flatMap(activity => activity.tags.map(tag => tag.name)).join(", "),
              category: itinerary.activities.flatMap(activity => activity.category.name).join(", "),
              availableDates: itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(", "),
              pickupLocation: itinerary.pickupLocation,
              dropOffLocation: itinerary.dropOffLocation,
              language: itinerary.language,
              duration: itinerary.duration,
              availableTickets: itinerary.availableTickets,
              date: itinerary.start_date,
              accessible:itinerary.accessible
            };
          });

          setItineraries(formattedItineraries);
          setItinerariesTotalPages(response.totalPages); // Update total pages for pagination
          setItinerariesPage(page);
          setPrices(formattedItineraries.map(itinerary => itinerary.budget));
          // Fetching addresses for the locations
          await fetchLocationAddresses(formattedItineraries);
        } else {
          console.error("API response data is not an array", response.data);
          setItineraries([]);
        }
      } catch (error) {
        console.error("Failed to fetch itineraries:", error.message);
        setItineraries([]);
      }
    };


    const fetchLocationAddresses = async (itineraries) => {
      const addresses = {};

      try {
        await Promise.all(
          itineraries.map(async (itinerary) => {
            const locations = itinerary.locations;
            addresses[itinerary.id] = await Promise.all(
              locations.map(async (point) => {
                if (point.coordinates && point.coordinates.length === 2) {
                  try {
                    const addressData = await reverseGeoCode(point.coordinates[0], point.coordinates[1]);
                    return addressData[0]?.formatted_address || 'Unknown location';
                  } catch (error) {
                    console.error("Error fetching address:", error);
                    return 'Error fetching location';
                  }
                }
                return 'Invalid location data';
              })
            );
          })
        );
        Object.keys(addresses).forEach((key) => {
          addresses[key].shift();
        }
        );
        setLocationAddresses(addresses);
      } catch (error) {
        console.error('Error fetching location addresses:', error.message);
      }
    };

    fetchItineraries(itinerariesPage); // Fetch itineraries on page load
  }, [touristService, itinerariesPage]);


  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await touristService.getMyBookmarks();
        if (response && response.data) {
          setBookmarkedItems(response.data.map((bookmark) => bookmark.resourceId));
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error.message);
      }
    };

    fetchBookmarks();
  }, [touristService]);

  const toggleBookmark = async ({ itemId, type }) => {
    try {
      if (bookmarkedItems.includes(itemId)) {
        // Remove bookmark if already bookmarked
        await touristService.removeBookmark({ itemId, type }); // Pass both `itemId` and `type`
        setBookmarkedItems((prev) => prev.filter((id) => id !== itemId));
      } else {
        // Add bookmark
        await touristService.addBookmark({ itemId, type }); // Pass both `itemId` and `type`
        setBookmarkedItems((prev) => [...prev, itemId]);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error.message);
    }
  };



  const isBookmarked = (id) => bookmarkedItems.includes(id);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await touristService.getPreferences();
        console.log(response); // For debugging

        // Extract tags from the response object
        if (response.success && Array.isArray(response.tags)) {
          setPreferenceOptions(response.tags);
        } else {
          console.error("Failed to fetch preferences or incorrect format", response);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error.message);
      }
    };

    fetchPreferences();
  }, [touristService]);
  useEffect(() => {
    const fetchUserPreference = async () => {
      try {
        const response = await touristService.getUserPreference();
        console.log(response);
        if (response && response.preferences) {
          setUserPreferences(response.preferences);


        }
      } catch (error) {
        console.error("Error fetching user preference:", error.message);
      }
    };

    fetchUserPreference();
  }, [touristService]);
  //fetch category
  //fetch category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await touristService.getCategories();
        console.log(response); // For debugging
        // Extract categories from the response object
        if (response.success && Array.isArray(response.data)) {
          setCategoryOptions(response.data.map(category => ({
            name: category.name
          })));
        } else {
          console.error("Failed to fetch categories or incorrect format", response);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategories();
  }, [touristService]);
  //fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await touristService.getAllTags();
        console.log(response); // For debugging
        // Extract tags from the response object
        if (response) {
          setTagsOptions(response.data.map(tag => ({
            name: tag.name
          })));
        } else {
          console.error("Failed to fetch tags or incorrect format", response);
        }
      } catch (error) {
        console.error("Error fetching tags:", error.message);
      }
    };
    fetchTags();
  }, [touristService]);



  // Fetch museums from API
  useEffect(() => {
    const fetchMuseums = async (page = 1, limit = 6) => {
      try {
        const response = await touristService.getAllMuseums(page, limit);
        console.log(response);

        if (response.data && Array.isArray(response.data)) {
          const formattedMuseums = response.data.map(museum => ({
            id: museum._id,
            name: museum.name,
            description: museum.description,
            location: museum.location,
            openingHours: museum.openingHours,
            ticketPrices: museum.ticketPrices,
            tags: [...museum.tags.map(tag => tag.name), museum.preference || 'history'].join(", "),
            start_date: new Date(museum.start_date).toLocaleDateString(),
            end_date: new Date(museum.end_date).toLocaleDateString(),
            pictures: museum.pictures,
            category: 'historical sites' || museum.category
          }));

          setMuseums(formattedMuseums);
          setMuseumsTotalPages(response.totalPages); // Update total pages for pagination
          setMuseumsPage(museumsPage);
          setMuseumTicketPrices(museums.map(museum => museum.ticketPrices));

        } else {
          console.error("API response data is not an array", response.data);
          setMuseums([]);
        }
      } catch (error) {
        console.error("Failed to fetch museums:", error.message);
        setMuseums([]);
      }
    };

    fetchMuseums();
  }, [touristService, museumsPage]);

  // Fetch historical places from API
  useEffect(() => {
    const fetchHistoricalPlaces = async (page = 1, limit = 6) => {
      try {
        const response = await touristService.getAllHistoricalPlaces(page, limit);
        console.log(response);

        if (response.data && Array.isArray(response.data)) {
          const formattedHistoricalPlaces = response.data.map(place => ({
            id: place._id,
            name: place.name,
            tags: [...place.tags.map(tag => tag.name), place.preference || 'history'].join(", "),
            description: place.description,
            location: place.location,
            openingHours: place.openingHours,
            ticketPrices: place.ticketPrices,
            pictures: place.pictures,
            category: 'historical sites' || place.category
          }));

          setHistoricalPlaces(formattedHistoricalPlaces);
          setHistoricalPlacesTotalPages(response.totalPages); // Update total pages for pagination
          setHistoricalPlacesPage(historicalPlacesPage);
        } else {
          console.error("API response data is not an array", response.data);
          setHistoricalPlaces([]);
        }
      } catch (error) {
        console.error("Failed to fetch historical places:", error.message);
        setHistoricalPlaces([]);
      }
    };

    fetchHistoricalPlaces();
  }, [touristService, historicalPlacesPage]);

  // Fetch paginated activities from API
  useEffect(() => {
    const fetchActivities = async (page = 1, limit = 6) => {
      try {
        const response = await touristService.getAllActivities(page, limit);
        console.log(response);

        if (response.data && Array.isArray(response.data)) {
          const formattedActivities = response.data.map(activity => ({
            id: activity._id,
            name: activity.name,
            category: activity.category.name,
            tags: activity.tags.map(tag => tag.name).join(", "),
            budget: activity.price,
            availableTickets: activity.availableTickets,
            date: new Date(activity.dateTime).toLocaleDateString(),
            rating: activity.ratings || 'N/A',
            pictures: activity.pictures,
            isBookingOpen:activity.isBookingOpen
          }));
          setActivities(formattedActivities);
          setActivitiesTotalPages(response.totalPages); // Update total pages for pagination
        } else {
          console.error("API response data is not an array", response.data);
          setActivities([]);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error.message);
        setActivities([]);
      }
    };

    fetchActivities(activitiesPage); // Call the function for the current page
  }, [touristService, activitiesPage]);
  const handleShareClick = (itineraryId) => {
    setSelectedItineraryId(itineraryId); // Set the selected itinerary ID
    setSelectedResource("itinerary")
    setModalOpen(true); // Open the modal
    console.log("Share button clicked with the following parameters:");
    console.log("Itinerary ID:", itineraryId);  // Log the itinerary ID
    console.log("Resource Type: itinerary"); // Log the resource type
    console.log("Email:", email); // Log the email (this will be empty initially)
  };
  const handleMuseumShareClick = (museumId) => {
    setSelectedItineraryId(museumId); // Set the selected museum ID
    setSelectedResource("museum")
    setModalOpen(true); // Open the modal
    console.log("Share button clicked with the following parameters:");
    console.log("Museum ID:", museumId);  // Log the museum ID
    console.log("Resource Type: museum"); // Log the resource type
    console.log("Email:", email); // Log the email (this will be empty initially)
  };
  const handleActivityShareClick = (activityId) => {
    setSelectedItineraryId(activityId); // Set the selected activity ID
    setSelectedResource("activity")
    setModalOpen(true); // Open the modal
    console.log("Share button clicked with the following parameters:");
    console.log("Activity ID:", activityId);  // Log the activity ID
    console.log("Resource Type: activity"); // Log the resource type
    console.log("Email:", email); // Log the email (this will be empty initially)
  };
  const handleHistoricalPlaceShareClick = (historicalPlaceId) => {
    setSelectedItineraryId(historicalPlaceId); // Set the selected historical place ID
    setSelectedResource("historicalPlace")
    setModalOpen(true); // Open the modal
    console.log("Share button clicked with the following parameters:");
    console.log("Historical Place ID:", historicalPlaceId);  // Log the historical place ID
    console.log("Resource Type: historicalPlaces"); // Log the resource type
    console.log("Email:", email); // Log the email (this will be empty initially)
  };



  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  // Function to filter items based on search term
  const filterItems = (item) => {
    const term = searchTerm.toLowerCase();

    // Check if the term matches any of the relevant fields
    const matchesSearch =
      item.timeline?.toLowerCase().includes(term) ||
      item.activities?.toLowerCase().includes(term) ||
      item.tags?.toLowerCase().includes(term) ||
      (item.name && item.name.toLowerCase().includes(term)) || // For museums, historical places, and activities
      (item.category && item.category.toLowerCase().includes(term));

    const matchesBudget = budget ? item.budget <= budget : true;
    const matchesDate = date ? new Date(item.date) >= new Date(date) : true;
    const matchesCategory = category
      ? (item.activities && item.activities.toLowerCase().includes(category.toLowerCase())) ||
      (item.category && item.category.toLowerCase() === category.toLowerCase())
      : true;
    const matchesRating = rating ? item.rating >= rating : true;
    const matchesLanguage = language ? item.language?.toLowerCase() === language.toLowerCase() : true;
    const matchesPreferences = selectedPreferences.length === 0 || selectedPreferences.some(pref => item.tags?.includes(pref));
    const matchesTags = tags.length === 0 || tags.some(tag => item.tags?.toLowerCase().includes(tag.toLowerCase()));

    return matchesSearch && matchesBudget && matchesDate && matchesCategory && matchesRating && matchesLanguage && matchesPreferences && matchesTags;
  };

  // Sort the filtered items based on sort option (price or rating)
  const sortItems = (items) => {
    if (sortOption === 'price') {
      return [...items].sort((a, b) => a.budget - b.budget);
    } else if (sortOption === 'rating') {
      return [...items].sort((a, b) => b.rating - a.rating);
    }
    return items;
  };
  const handleCurrencyChange = (newCurrency, newConvertedPrices) => {
    setCurrency(newCurrency);
    setConvertedPrices(newConvertedPrices);  // Store the converted prices
  };

  return (
    <div className="flex bg-gray-50">
      <SideNav />
      {/* Main Content */}
      <main className="flex-1 rounded-lg shadow-md p-6 bg-gray-50 overflow-y-auto">
        <CurrencyConverter
          defaultCurrency={currency}
          prices={[...itineraryPrices, ...museumTicketPrices, ...historicalPlacesTicketPrices, ...activitiesPrices]}  // Pass both itinerary and museum prices
          onCurrencyChange={handleCurrencyChange}
        />


        {/* Search Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-slate-700 text-2xl font-bold text-center w-full mb-4">
            <h2>What are you looking for?</h2>
          </div>

          <div className="relative w-full mb-6">
            <input
              type="text"
              placeholder="Search by name, category, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-full p-3 pl-10 w-full shadow-sm focus:outline-none focus:border-blue-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 18a8 8 0 100-16 8 8 0 000 16zm21 21" />
            </svg>
          </div>
        </div>

        {/* Filters Section */}
        <h3 className="text-lg font-semibold mb-3 text-slate-700">Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Budget (Max)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter budget"
              className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Date (From)</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:outline-none focus:border-blue-500"
            >
              <option value="" >Select a category</option>

              {categoryOptions && categoryOptions.length > 0 ? (
                categoryOptions.map((categoryOption) => (
                  <option key={categoryOption.name} value={categoryOption.name}>
                    {categoryOption.name}
                  </option>
                ))
              ) : (
                <option value="">No categories available</option>
              )}
            </select>

          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Rating (Min)</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Enter rating"
              min="1"
              max="5"
              step="0.1"
              className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>



          <div>
            <label className="block text-sm text-gray-700 mb-1">Preferences</label>
            <Select
              isMulti
              value={options.filter(option => selectedPreferences.includes(option.value))}
              onChange={(selected) => {
                const selectedValues = selected.map(option => option.value);
                if (selectedValues.includes("Default")) {
                  setSelectedPreferences([]);
                } else if (selectedValues.includes("myPreferences")) {
                  setSelectedPreferences(userPreferences);
                }
                else {
                  setSelectedPreferences(selectedValues);
                }
              }}
              options={options}
              className="w-full"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Tags</label>
            <Select
              isMulti
              value={tagOptions.filter(option => tags.includes(option.value))}
              onChange={(selected) => {
                const selectedValues = selected.map(option => option.value);
                if (selectedValues.includes("Default")) {
                  setTags([]);
                } else {
                  setTags(selectedValues);
                }
              }}
              options={tagOptions}
              className="w-full"
              classNamePrefix="react-select"
            />
          </div>

          {/* Sorting Options */}
          <div className="col-span-full">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Sort By</h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Default</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>


        <h2 className="text-3xl font-bold mb-6 text-center text-slate-700">Explore Your Next Adventure</h2>

        <section>
          <h3 className="text-2xl font-semibold text-slate-500 mb-4">Upcoming Itineraries</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortItems(itineraries.filter(filterItems)).map((itinerary, index) => (
              <div key={index} className="relative border border-gray-300 rounded-lg p-4">
                {/* Bookmark Icon */}
                <div
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={() =>
                    toggleBookmark({
                      itemId: itinerary.id,
                      type: "itinerary",
                    })
                  } // Use the correct payload structure
                >
                  {isBookmarked(itinerary.id) ? (
                    <FaStar className="text-yellow-400" size={24} />
                  ) : (
                    <FaRegStar className="text-gray-400" size={24} />
                  )}
                </div>

                <h4 className="text-xl font-bold text-blue-900">{itinerary.Title}</h4>
                <p>Activities: {itinerary.activities}</p>
                <ul className="list-disc pl-6">
                  {locationAddresses[itinerary.id]?.length > 0
                    ? locationAddresses[itinerary.id].map((address, addrIndex) => (
                      <li key={addrIndex}>{address}</li>
                    ))
                    : <li>Loading locations...</li>}
                </ul>
                <p>Budget: {currency} {convertedPrices[index] ?? itinerary.budget}</p>
                <p>Rating: {itinerary.rating}</p>
                <p>Category: {itinerary.category}</p>
                <p>Tags: {itinerary.tags}</p>
                <p>Available Dates: {itinerary.availableDates}</p>
                <p>Pickup Location: {itinerary.pickupLocation}</p>
                <p>Drop-off Location: {itinerary.dropOffLocation}</p>
                <p>Language: {itinerary.language}</p>
                <p>Duration: {itinerary.duration} hours</p>
                <p>Date: {itinerary.date}</p>
                <p>Available Tickets: {itinerary.availableTickets}</p>

                {/* Share Button */}
                <button
                  onClick={() => handleShareClick(itinerary.id)} // Pass the itinerary's ID to the modal
                  className="bg-green-500 text-white p-2 mt-4 rounded"
                >
                  Share
                </button>

                {/* Book Now Button check if it's accessible or not*/}
                
                {/* Check if the itinerary is accessible */}
{itinerary.accessible ? (
  <Link
    to="/BookItinerary"
    state={{ itinerary }}
    className="bg-blue-500 text-white p-3 mt-4 rounded block text-center w-full sm:w-auto"
  >
    Book Now
  </Link>
) : (
  <button
    disabled
    className="bg-gray-300 text-gray-600 p-3 mt-4 rounded block text-center w-full sm:w-auto cursor-not-allowed"
  >
    Not Available
  </button>
)}
              </div>
            ))}
          </div>

          {/* Share Modal */}
          <ShareModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            resourceId={selectedItineraryId}
            resourceType={selectedResource}
            email={email}
            onEmailChange={handleEmailChange}
          />

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setItinerariesPage(itinerariesPage - 1)}
              disabled={itinerariesPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 mr-2"
            >
              Previous
            </button>
            <button
              onClick={() => setItinerariesPage(itinerariesPage + 1)}
              disabled={itinerariesPage === itinerariesTotalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 ml-2"
            >
              Next
            </button>
          </div>
        </section>




        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-slate-500 mb-4">Museums</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortItems(museums.filter(filterItems)).map((museum, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4">
                <h4 className="text-xl font-bold text-blue-800">{museum.name}</h4>
                <p>Description: {museum.description}</p>
                <p>Location: {museum.location}</p>
                <p>Opening Hours: {museum.openingHours}</p>
                <p>Ticket Prices: {currency} {convertedPrices[itineraries.length + index] ?? museum.ticketPrices}</p>
                <p>Tags: {museum.tags}</p>
                <p>Exhibition Dates: {museum.start_date} to {museum.end_date}</p>
                <p>Category: {museum.category}</p>
                <h5 className="font-semibold">Pictures:</h5>
                <div className="flex space-x-2">
                  {museum.pictures.map((picture, picIndex) => (
                    <img
                      key={picIndex}
                      src={picture}
                      alt={`Picture ${picIndex + 1}`}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  ))}
                </div>
                {/* Share button */}
                <button
                  onClick={() => handleMuseumShareClick(museum.id)} // Use the handleMuseumShareClick function
                  className="bg-green-500 text-white p-3 mt-4 rounded block w-full sm:w-auto"
                >
                  Share
                </button>


              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setMuseumsPage(museumsPage - 1)}
              disabled={museumsPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 mr-2"
            >
              Previous
            </button>
            <button
              onClick={() => setMuseumsPage(museumsPage + 1)}
              disabled={museumsPage === museumsTotalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 ml-2"
            >
              Next
            </button>
          </div><ShareModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            resourceId={selectedItineraryId} // Will be the museum or itinerary ID
            resourceType={selectedResource}  // Ensure this reflects the current resource type
            email={email}
            onEmailChange={handleEmailChange}
          />

        </section>


        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-slate-500 mb-4">Historical Places</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortItems(historicalPlaces.filter(filterItems)).map((place, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4">
                <h4 className="text-xl font-bold text-blue-800">{place.name}</h4>
                <p>Description: {place.description}</p>
                <p>Location: {place.location}</p>
                <p>Opening Hours: {place.openingHours}</p>
                <p>Ticket Prices: {currency} {convertedPrices[itineraries.length + index] ?? place.ticketPrices}</p>
                <p>Tags: {place.tags}</p>
                <p>Category: {place.category}</p>
                <div className="mt-2">
                  <h5 className="font-semibold">Pictures:</h5>
                  <div className="flex space-x-2">
                    {place.pictures.map((picture, picIndex) => (
                      <img
                        key={picIndex}
                        src={picture}
                        alt={`Picture ${picIndex + 1}`}
                        className="h-20 w-20 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
                {/* Share Button */}
                <button
                  onClick={() => handleHistoricalPlaceShareClick(place.id)} // Open the share modal for the selected historical place
                  className="bg-green-500 text-white p-3 mt-4 rounded block w-full sm:w-auto"
                >
                  Share
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setHistoricalPlacesPage(historicalPlacesPage - 1)}
              disabled={historicalPlacesPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 mr-2"
            >
              Previous
            </button>

            <button
              onClick={() => setHistoricalPlacesPage(historicalPlacesPage + 1)}
              disabled={historicalPlacesPage === historicalPlacesTotalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 ml-2"
            >
              Next
            </button>
          </div>

          {/* ShareModal */}
          <ShareModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            resourceId={selectedItineraryId} // This will be the historical place ID
            resourceType={selectedResource} // Set the resource type to historicalPlaces
            email={email}
            onEmailChange={handleEmailChange}
          />
        </section>



        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-slate-500 mb-4">Activities</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortItems(activities.filter(filterItems)).map((activity, index) => (
              <div key={index} className="relative border border-gray-300 rounded-lg p-4">
                {/* Bookmark Icon */}
                <div
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={() =>
                    toggleBookmark({
                      itemId: activity.id,
                      type: "activity",
                    })
                  } // Use the correct payload structure
                >
                  {isBookmarked(activity.id) ? (
                    <FaStar className="text-yellow-400" size={24} />
                  ) : (
                    <FaRegStar className="text-gray-400" size={24} />
                  )}
                </div>

                <h4 className="text-xl font-bold text-blue-800">{activity.name}</h4>
                <p>Category: {activity.category}</p>
                <p>Budget: {currency} {convertedPrices[itineraries.length + index] ?? activity.budget}</p>
                <p>Date: {activity.date}</p>
                <p>Rating: {activity.rating}</p>
                <p>Tags: {activity.tags}</p>
                <p>Available Tickets: {activity.availableTickets}</p>
                <div className="mt-2">
                  <h5 className="font-semibold">Pictures:</h5>
                  <div className="flex space-x-2">
                    {activity.pictures.map((picture, picIndex) => (
                      <img
                        key={picIndex}
                        src={picture}
                        alt={`Picture ${picIndex + 1}`}
                        className="h-20 w-20 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
                {/* Share Button */}
                <button
                  onClick={() => handleActivityShareClick(activity.id)} // Open the share modal for the selected activity
                  className="bg-green-500 text-white p-3 mt-4 rounded block w-full sm:w-auto"
                >
                  Share
                </button>
                {activity.isBookingOpen ? (
  <Link
    to="/BookActivity"
    state={{ activity }}
    className="bg-blue-500 text-white p-3 mt-4 rounded block text-center w-full sm:w-auto"
  >
    Book Now
  </Link>
) : (
  <button
    disabled
    className="bg-gray-300 text-gray-600 p-3 mt-4 rounded block text-center w-full sm:w-auto cursor-not-allowed"
  >
    Not Available
  </button>
)}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setActivitiesPage(activitiesPage - 1)}
              disabled={activitiesPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 mr-2"
            >
              Previous
            </button>
            <button
              onClick={() => setActivitiesPage(activitiesPage + 1)}
              disabled={activitiesPage === activitiesTotalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 ml-2"
            >
              Next
            </button>
          </div>
          {/* ShareModal */}
          <ShareModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            resourceId={selectedItineraryId} // This will be the historical place ID
            resourceType={selectedResource} // Set the resource type to historicalPlaces
            email={email}
            onEmailChange={handleEmailChange}
          />
        </section>


      </main>
    </div>
  );
};

export default TouristDashboard;
