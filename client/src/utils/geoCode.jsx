const geocoder = new google.maps.Geocoder();
const infowindow = new google.maps.InfoWindow();

export async function reverseGeoCode(lat, lng) {
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
