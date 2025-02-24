
let geocoder;
let infowindow;

/**
 * Initialize Google Maps API
 */
function initGoogleMaps() {
    if (typeof google === "undefined" || !google.maps) {
        console.error("Google Maps API failed to load.");
        return;
    }

    console.log("Google Maps API Loaded Successfully!");
    geocoder = new google.maps.Geocoder();
    infowindow = new google.maps.InfoWindow();
}

/**
 * Retry Google Maps Initialization if API is not ready
 */
function waitForGoogleMaps(retries = 10) {
    if (typeof google !== "undefined" && google.maps) {
        initGoogleMaps();
    } else if (retries > 0) {
        console.warn("Waiting for Google Maps API...");
        setTimeout(() => waitForGoogleMaps(retries - 1), 500);
    } else {
        console.error("Google Maps API failed to load after retries.");
    }
}

/**
 * Reverse Geocoding: Convert Latitude/Longitude to Address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Array>} - Geocoded results
 */
export async function reverseGeoCode(lat, lng) {
    if (!geocoder) {
        console.error("Google Maps API is not initialized yet.");
        return [];
    }

    const latLng = { lat, lng };

    try {
        const response = await geocoder.geocode({ location: latLng });
        if (response.results[0]) {
            return response.results;
        } else {
            console.log("Not found");
            return [];
        }
    } catch (error) {
        console.log("Geocode error:", error);
        return [];
    }
}

// Ensure Google Maps API initializes when the page loads
window.initGoogleMaps = initGoogleMaps;
window.onload = () => waitForGoogleMaps(10);

// Disable Bootstrap's interference with Google Maps
window.__bootstrapDisableShadowDOM = true;
