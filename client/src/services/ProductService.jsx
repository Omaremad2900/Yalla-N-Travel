import axiosInstance from '../axios';
const ProductService = {
    // Filter
    filterProductsByPrice: async (minPrice, maxPrice) => {
        try {
            const response = await axiosInstance.get('/api/products/filter', {
                params: { minPrice, maxPrice }
            });
            return response.data;
        } catch (error) {
            console.error("Error filtering products:", error);
            throw new Error(error.response?.data?.message || 'Failed to filter products');
        }
    },

    // Search
    searchProductsByName: async (name) => {
        try {
            const response = await axiosInstance.get('/api/products/search', {
                params: { name }
            });
            return response.data;
        } catch (error) {
            console.error("Error searching for products:", error);
            throw new Error(error.response?.data?.message || 'Failed to search products');
        }
    },

    // Sort
    sortByRatings: async (order) => {
        try {
            const response = await axiosInstance.get('/api/products/sort/rating', {
                params: { order }
            });
            return response.data;
        } catch (error) {
            console.error("Error sorting products:", error);
            throw new Error(error.response?.data?.message || 'Failed to sort products');
        }
    },

    // Get all
    getAllProducts: async (page,limit,productStatus='all') => {
        try {
            //add page and limit in query params
            const response = await axiosInstance.get('/api/products', {
                params: { page, limit },
                 headers: {'product-status':productStatus}
            },
        
    
    );
            return response.data;
        } catch (error) {
            console.error("Error fetching all products:", error);
            throw new Error(error.response?.data?.message || 'Failed to fetch products');
        }
    },

    // Create
    createProduct: async (productData) => {
        try {
            const response = await axiosInstance.post('/api/products', productData);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error(error.response?.data?.message || 'Failed to create product');
        }
    },

    // Edit
    editProduct: async (productId, productData) => {
        try {
            const response = await axiosInstance.put(`/api/products/${productId}`, productData);
            return response.data;
        } catch (error) {
            console.error("Error editing product:", error);
            throw new Error(error.response?.data?.message || 'Failed to edit product');
        }
    },

    archiveProduct: async (productId) => {
        try {
            const response = await axiosInstance.post(`/api/products/archive/${productId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all products:", error);
            throw new Error(error.response?.data?.message || 'Failed to archive products');
        }
    },

    unArchiveProduct:async (productId) => {
        try {
            const response = await axiosInstance.post(`/api/products/unarchive/${productId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all products:", error);
            throw new Error(error.response?.data?.message || 'Failed to unarchive products');
        }
    },

    placeOrder:async (productId) => {
        try {
            const orderBody= { "quantity" : 1}
            const response = await axiosInstance.post(`/api/products/order/${productId}`,orderBody);
            return response.data;
        } catch (error) {
            console.error("Error placing order:", error);
            throw new Error(error.response?.data?.message || 'Failed to place order products');
        }
    },

    createReview: async (productId,reviewBody)=>{
        try{
            const response= await axiosInstance.post(`/api/products/review/${productId}`, reviewBody);
            return response.data
        }
        catch(error){
            console.error("Error adding review:", error);
            throw new Error(error.response?.data?.message || 'Failed to add review');
        }
    },

    getReview: async (productId)=>{
        try{
            const response= await axiosInstance.get(`/api/products/review/${productId}`);
            return response.data
        }
        catch(error){
            console.error("Error getting review:", error);
            throw new Error(error.response?.data?.message || 'Failed to get review');
        }
    }
    



    
};

export default ProductService;
