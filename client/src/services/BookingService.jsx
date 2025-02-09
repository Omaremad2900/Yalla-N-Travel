import axiosInstance from '../axios';

const bookingService = {
    // Flight APIs
    searchFlights: async (params) => {
        try {
            const response = await axiosInstance.get('/api/flights/search', { params });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to search flights');
        }
    },

    saveBookingDetails: async (bookingData) => {
        try {
            const response = await axiosInstance.post('/api/flights/save-tourist-booking-details', bookingData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to save booking details');
        }
    },

    confirmFlightPrice: async (flightData) => {
        try {
            const response = await axiosInstance.post('/api/flights/confirm-price', flightData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to confirm flight price');
        }
    },

    bookFlight: async (flightOrderData) => {
        try {
            const response = await axiosInstance.post('/api/flights/book', flightOrderData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to book the flight');
        }
    },

    checkIfBookingDetailsSaved: async () => {
        try {
            const response = await axiosInstance.get('/api/flights/check-booking-details-saved');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to check booking details');
        }
    },

    // Hotel APIs
    searchHotels: async (params) => {
        try {
            const response = await axiosInstance.get('/api/hotels/search', { params });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to search hotels');
        }
    },

    getHotelsByCity: async (params) => {
        try {
            const response = await axiosInstance.get('/api/hotels/search', {
                params: {
                    cityCode: params.cityCode,
                    radius: params.radius || 10,
                    ratings: params.ratings || 5,
                    amenities: params.amenities || 'SWIMMING_POOL,SPA,FITNESS_CENTER,SAUNA',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to retrieve hotels by city');
        }
    },


    async getHotelOffers(hotelIds, adults = 1) {
        try {
            console.log('Requesting hotel offers with params:', { hotelIds, adults }); // Add this line to log the parameters
            const response = await axiosInstance.get('/api/hotels/offers', {
                params: {
                    hotelIds,
                    adults,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching hotel offers:', error); // Log the actual error
            throw new Error(error.response?.data?.message || 'Failed to retrieve hotel offers');
        }
    },

    saveHotelBookingDetails: async (bookingData) => {
        try {
            const response = await axiosInstance.post('/api/hotels/save-tourist-booking-details', bookingData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to save hotel booking details');
        }
    },

    createHotelOrder: async (orderData) => {
        try {
            const response = await axiosInstance.post('/api/hotels/create-hotel-order', orderData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create hotel order');
        }
    },

    checkIfHotelBookingDetailsSaved: async () => {
        try {
            const response = await axiosInstance.get('/api/hotels/check-booking-details-saved');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to check if hotel booking details are saved');
        }
    },
};

export default bookingService;
