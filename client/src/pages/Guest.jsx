import { useState, useEffect } from 'react';

const Guest = ({ touristService }) => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  

  // Filter states
  const [budget, setBudget] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [tags, setTags] = useState([]);
  const [language, setLanguage] = useState('');

  // Sort state
  const [sortOption, setSortOption] = useState('');

  // Pagination state for activities
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesTotalPages, setActivitiesTotalPages] = useState(1);

  // Preferences Options
  const preferenceOptions = [
    "Historic Areas",
    "Beaches",
    "Family-Friendly",
    "Shopping"
  ];

  // Fetch itineraries from API
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await touristService.getAllItineraries();
        console.log(response);

        if (response.data && Array.isArray(response.data)) {
          const formattedItineraries = response.data.map(itinerary => ({
            timeline: itinerary.timeline,
            activities: itinerary.activities.map(activity => activity.name).join(", "),
            locations: itinerary.locations.join(", "),
            budget: itinerary.price,
            rating: itinerary.ratings || 'N/A',
            tags: itinerary.tags.map(tag => tag.name).join(", "),
            availableDates: itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(", "),
            pickupLocation: itinerary.pickupLocation,
            dropOffLocation: itinerary.dropOffLocation,
            language: itinerary.language,
            duration: itinerary.duration,
          }));
          setItineraries(formattedItineraries);
        } else {
          console.error("API response data is not an array", response.data);
          setItineraries([]);
        }
      } catch (error) {
        console.error("Failed to fetch itineraries:", error.message);
        setItineraries([]);
      }
    };

    fetchItineraries();
  }, [touristService]);

  // Fetch museums from API
  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const response = await touristService.getAllMuseums();
        console.log(response);

        if (response.data && Array.isArray(response.data)) {
          const formattedMuseums = response.data.map(museum => ({
            name: museum.name,
            description: museum.description,
            location: museum.location,
            openingHours: museum.openingHours,
            ticketPrices: museum.ticketPrices,
            tags: museum.tags.map(tag => tag.name).join(", "),
            start_date: new Date(museum.start_date).toLocaleDateString(),
            end_date: new Date(museum.end_date).toLocaleDateString(),
          }));
          setMuseums(formattedMuseums);
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
  }, [touristService]);

  // Fetch historical places from API
  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const response = await touristService.getAllHistoricalPlaces();
        console.log(response);

        if (response.data && Array.isArray(response.data)) {
          const formattedHistoricalPlaces = response.data.map(place => ({
            id: place._id,
            name: place.name,
            category: place.category,
            tags: place.tags.map(tag => tag.name).join(", "),
          }));
          setHistoricalPlaces(formattedHistoricalPlaces);
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
  }, [touristService]);

  // Fetch paginated activities from API
  useEffect(() => {
    const fetchActivities = async (page = 1) => {
      try {
        const response = await touristService.getAllActivities({ page });
        console.log(response);

        if (response.data && Array.isArray(response.data)) {
          const formattedActivities = response.data.map(activity => ({
            id: activity._id,
            name: activity.name,
            category: activity.category,
            tags: activity.tags.map(tag => tag.name).join(", "),
            budget: activity.price,
            date: new Date(activity.dateTime).toLocaleDateString(),
            rating: activity.ratings || 'N/A',
          }));
          setActivities(formattedActivities);
          setActivitiesTotalPages(response.data.totalPages); // Update total pages for pagination
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

  // Function to filter items based on search term
  const filterItems = (item) => {
    
    
    // Check if the term matches any of the relevant fields
    

    const matchesBudget = budget ? item.budget <= budget : true;
    const matchesDate = date ? new Date(item.date) >= new Date(date) : true;
    const matchesCategory = category
      ? (item.activities && item.activities.toLowerCase().includes(category.toLowerCase())) || 
        (item.category && item.category.toLowerCase() === category.toLowerCase())
      : true;
    const matchesRating = rating ? item.rating >= rating : true;
    const matchesLanguage = language ? item.language?.toLowerCase() === language.toLowerCase() : true;
    const matchesPreferences = preferences.length === 0 || preferences.some(pref => item.activities?.toLowerCase().includes(pref.toLowerCase()) || item.tags?.toLowerCase().includes(pref.toLowerCase()));
    const matchesTags = tags.length === 0 || tags.some(tag => item.tags?.toLowerCase().includes(tag.toLowerCase()));

    return  matchesBudget && matchesDate && matchesCategory && matchesRating && matchesLanguage && matchesPreferences && matchesTags;
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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
<aside className="w-64 bg-slate-200 p-6 h-screen fixed top-0 left-0 shadow-lg overflow-y-auto">
  <div className="text-slate-700 text-2xl font-bold mb-6 text-center">
    <h2>What are you looking for?</h2>
  </div>

        {/* Filters Section */}
        <h3 className="text-xl font-semibold mb-3  text-slate-700">Filters</h3>

        <div className="mb-5">
          <label className="block text-sm text-gray-700 mb-1">Budget (Max)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter budget"
            className="border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm text-gray-700 mb-1">Date (From)</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-400 rounded-md p-2 w-full focus:outline-none focus
:border-blue-500"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm text-gray-700 mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            className="border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm text-gray-700 mb-1">Rating (Min)</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Enter rating"
            min="1"
            max="5"
            step="0.1"
            className="border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm text-gray-700 mb-1">Language</label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Enter language"
            className="border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm text-gray-700 mb-1">Preferences</label>
          <div className="grid grid-cols-2 gap-2">
            {preferenceOptions.map((preference, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={preference}
                  checked={preferences.includes(preference)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPreferences([...preferences, preference]);
                    } else {
                      setPreferences(preferences.filter(pref => pref !== preference));
                    }
                  }}
                  className="mr-2"
                />
                {preference}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            placeholder="Enter tags separated by commas"
            className="border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Sorting Options */}
        <h3 className="text-xl font-semibold mb-3 text-slate-700">Sort By</h3>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
        >
          <option value="">Default</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
      </aside>

      {/* Main Content */}
      <main className="w-4/5 ml-auto p-6 bg-gray-50 overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-700">Explore Your Next Adventure</h2>

        <section>
          <h3 className="text-2xl font-semibold text-slate-500 mb-4">Upcoming Itineraries</h3>
          {sortItems(itineraries.filter(filterItems)).map((itinerary, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
              <h4 className="text-xl font-bold text-blue-900">{itinerary.timeline}</h4>
              <p>Activities: {itinerary.activities}</p>
              <p>Locations: {itinerary.locations}</p>
              <p>Budget: ${itinerary.budget}</p>
              <p>Rating: {itinerary.rating}</p>
              <p>Tags: {itinerary.tags}</p>
              <p>Available Dates: {itinerary.availableDates}</p>
              <p>Pickup Location: {itinerary.pickupLocation}</p>
              <p>Drop-off Location: {itinerary.dropOffLocation}</p>
              <p>Language: {itinerary.language}</p>
              <p>Duration: {itinerary.duration} hours</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-slate-500 mb-4">Museums</h3>
          {sortItems(museums.filter(filterItems)).map((museum, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
              <h4 className="text-xl font-bold text-blue-800">{museum.name}</h4>
              <p>Description: {museum.description}</p>
              <p>Location: {museum.location}</p>
              <p>Opening Hours: {museum.openingHours}</p>
              <p>Ticket Prices: ${museum.ticketPrices}</p>
              <p>Tags: {museum.tags}</p>
              <p>Exhibition Dates: {museum.start_date} to {museum.end_date}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-slate-500 mb-4">Historical Places</h3>
          {sortItems(historicalPlaces.filter(filterItems)).map((place, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
              <h4 className="text-xl font-bold text-blue-800">{place.name}</h4>
              <p>Category: {place.category}</p>
              <p>Tags: {place.tags}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-slate-500 mb-4">Activities</h3>
          {sortItems(activities.filter(filterItems)).map((activity, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
              <h4 className="text-xl font-bold text-blue-800">{activity.name}</h4>
              <p>Category: {activity.category}</p>
              <p>Budget: ${activity.budget}</p>
              <p>Date: {activity.date}</p>
              <p>Rating: {activity.rating}</p>
              <p>Tags: {activity.tags}</p>
            </div>
          ))}
        </section>

        {/* Pagination */}
        {activitiesTotalPages > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setActivitiesPage(activitiesPage - 1)}
              disabled={activitiesPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 mr-2"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {activitiesPage} of {activitiesTotalPages}</span>
            <button
              onClick={() => setActivitiesPage(activitiesPage + 1)}
              disabled={activitiesPage === activitiesTotalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 ml-2"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Guest;
