import axiosInstance from '../axios'; // Ensure the path is correct based on your project structure

const tourismGovernorService = {
    // Function to add a new museum or historical place
    addPlace: async (placeDetails) => {
        try {

            // const formData = new FormData();
            // formData.append('name', placeDetails.name);
            // formData.append('description', placeDetails.description);
            // formData.append('location', placeDetails.location);
            // formData.append('openingHours', placeDetails.openingHours);
            // formData.append('ticketPrices', Number(placeDetails.ticketPrices));
            // formData.append('start_date', placeDetails.start_date); // New field for start date
            // formData.append('end_date', placeDetails.end_date); // New field for end date

            // Append all pictures to the FormData object
            // placeDetails.pictures.forEach((picture) => formData.append('pictures', picture));
            console.log(placeDetails)
            // Append tags (converted to JSON string) to the FormData object
            const response = await axiosInstance.post('/api/historical-places', placeDetails);
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to add place');
        }
    },

    // Function to delete a place
    deletePlace: async (id) => {
        try {
            const response = await axiosInstance.delete(`/api/historical-places/${id}`);
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete place');
        }
    },

    // Function to edit a place
    editPlace: async (id, updatedDetails) => {
        try {
            const formData = new FormData();
            formData.append('name', updatedDetails.name);
            formData.append('description', updatedDetails.description);
            formData.append('location', updatedDetails.location);
            formData.append('openingHours', updatedDetails.openingHours);
            formData.append('ticketPrices', Number(updatedDetails.ticketPrices));
            formData.append('start_date', updatedDetails.start_date); // New field for start date
            formData.append('end_date', updatedDetails.end_date); // New field for end date

            // Append new pictures if any
            updatedDetails.pictures.forEach((picture) => formData.append('pictures', picture));

            // Append tags (converted to JSON string) to the FormData object
            formData.append('tags', JSON.stringify(updatedDetails.tags));

            const response = await axiosInstance.put(`/api/historical-places/${id}`, formData);
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update place');
        }
    },

    // Function to fetch all places
    fetchPlaces: async (page, limit) => {
        try {
            const response = await axiosInstance.get('/api/historical-places', { params: { page, limit } });
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch places');
        }
    },
    uploadPictures: async (formData) => {
        try {
            const response = await axiosInstance.post('/upload/multiple', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type to form-data
                },
            });
            return response.data.imageUrls; // Return the image URL from the backend
        } catch (error) {
            console.error('Error uploading product image:', error);
            throw error;
        }
    },
    // function to get museums
    getMuseums: async (page, limit) => {
        try {
            const response = await axiosInstance.get('/api/museums', { params: { page, limit } });
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch museums');
        }
    },
    getPlaceById: async (id) => {
        try {
            const response = await axiosInstance.get(`/api/historical-places/${id}`); // Use the id in the URL
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch place');
        }
    },

    readProfile: async () => {
        try {
            const response = await axiosInstance.get('/api/tourismGovernor/readProfile');
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
        }
    },



    getTagId: async (tagInput, tagType) => {
        try {
            const response = await axiosInstance.post('/api/tags/find-or-create', { name: tagInput, type: tagType });
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch tag ids');
        }

    },
    editMuseum: async (id, updatedDetails) => {
        try {
            const formData = new FormData();
            formData.append('name', updatedDetails.name);
            formData.append('description', updatedDetails.description);
            formData.append('location', updatedDetails.location);
            formData.append('openingHours', updatedDetails.openingHours);
            formData.append('ticketPrices', Number(updatedDetails.ticketPrices));
            formData.append('start_date', updatedDetails.start_date);
            formData.append('end_date', updatedDetails.end_date);

            // Append new pictures if any
            if (updatedDetails.pictures) {
                updatedDetails.pictures.forEach((picture) => formData.append('pictures', picture));
            }

            formData.append('tags', JSON.stringify(updatedDetails.tags));

            const response = await axiosInstance.patch(`/api/museums/${id}`, formData);
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update museum');
        }
    },

    // Function to delete a museum
    deleteMuseum: async (id) => {
        try {
            const response = await axiosInstance.delete(`/api/museums/${id}`);
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete museum');
        }
    },
    editHistoricalPlace: async (id, updatedDetails) => {
        try {
            const formData = new FormData();
            formData.append('name', updatedDetails.name);
            formData.append('description', updatedDetails.description);
            formData.append('location', updatedDetails.location);
            formData.append('openingHours', updatedDetails.openingHours);
            formData.append('ticketPrices', Number(updatedDetails.ticketPrices));
            formData.append('start_date', updatedDetails.start_date);
            formData.append('end_date', updatedDetails.end_date);

            if (updatedDetails.pictures) {
                updatedDetails.pictures.forEach((picture) => formData.append('pictures', picture));
            }

            formData.append('tags', JSON.stringify(updatedDetails.tags));

            const response = await axiosInstance.patch(`/api/historical-places/${id}`, formData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update historical place');
        }
    },

    deleteHistoricalPlace: async (id) => {
        try {
            const response = await axiosInstance.delete(`/api/historical-places/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete historical place');
        }
    },
    createMuseum: async (museumDetails) => {
        try {
            const response = await axiosInstance.post('/api/museums', museumDetails);
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create museum');
        }
    },
    getMuseumById: async (id) => {
        try {
            const response = await axiosInstance.get(`/api/museums/${id}`);
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch museum');
        }
    },
    //read tourim governor
    readTourismGovernor: async () => {
        try {
            const response = await axiosInstance.get('/api/tourismGovernor/readProfile');
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
        }
    },

};
export default tourismGovernorService;
