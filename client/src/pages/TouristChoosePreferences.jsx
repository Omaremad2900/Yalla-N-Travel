import { useState, useEffect } from "react";
import SideNav from "../components/TouristSideNav";

const TouristChoosePreferences = ({ touristService }) => {
  const [preferenceOptions, setPreferenceOptions] = useState([]); // Available preferences
  const [selectedPreferences, setSelectedPreferences] = useState([]); // User-selected preferences
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await touristService.getPreferences();
        if (response && response.tags) {
          setPreferenceOptions(response.tags); // Set available preferences
        } else {
          setError("Failed to fetch preferences.");
        }
      } catch (err) {
        setError("Error fetching preferences. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [touristService]);

  const handleCheckboxChange = (preference) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference) // Deselect if already selected
        : [...prev, preference] // Add to selected if not present
    );
  };

  const savePreferences = async () => {
    try {
      const response = await touristService.setPreferences(selectedPreferences);
      if (response) {
        alert("Preferences saved successfully!");
      } else {
        setError("Failed to save preferences. Please try again.");
      }
    } catch (err) {
      setError("Error saving preferences. Please try again later.");
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Choose Your Preferences
          </h1>

          {/* Loading or Error Message */}
          {loading && <p className="text-blue-500 text-center mb-4">Loading preferences...</p>}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Preferences Form */}
          {!loading && !error && (
            <form>
              <p className="text-lg font-medium text-gray-600 mb-4 text-center">
                Select your preferred options:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {preferenceOptions.map((preference) => (
                  <div
                    key={preference.id}
                    className="flex items-center bg-gray-100 p-4 rounded-md shadow-sm hover:bg-gray-200 transition"
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedPreferences.includes(preference.name)}
                      onChange={() => handleCheckboxChange(preference.name)}
                    />
                    <label className="ml-3 text-gray-700 font-medium">{preference.name}</label>
                  </div>
                ))}
              </div>
            </form>
          )}

          {/* Save Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={savePreferences}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristChoosePreferences;
