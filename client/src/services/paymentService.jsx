
import axiosInstance from '../axios'; // Import the Axios instance
const PaymentService={
    // create payment intent
    createPaymentIntent: async (ticketIds, promoCode = null) => {
        try {
            const requestBody = { ticketIds };
            if (promoCode) {
              requestBody.promoCode = promoCode;
            }
        
            const response = await axiosInstance.post(`api/payment/paymentintent`, requestBody);
            return response.data;
        } catch (error) {
            console.log('Error while creating payment intent: ', error);
        }

    },
    // create payment intent for order
    createPaymentIntentForOrder: async (orderId,promoCode = null) => {
        try {
            const requestBody = { orderId };
            if (promoCode) {
              requestBody.promoCode = promoCode;
            }
        
            const response = await axiosInstance.post(`api/payment/paymentintentOrder`, requestBody);
            return response.data;
        } catch (error) {
            console.log('Error while creating payment intent: ', error);
        }
    },


    PaywithWallet: async (ticketIds,promoCode) => {
        try {
            const requestBody = { ticketIds };
            if (promoCode) {
              requestBody.promoCode = promoCode;
            }
        
            const response = await axiosInstance.post(`api/payment/wallet`, requestBody);
            return response.data;
        } catch (error) {
            console.log('Error while Paying with wallet : ', error);
            throw new Error(error.response?.data?.message || 'Failed to pay with wallet');
        }

    },
    PaywithWalletForOrder: async (orderId,promoCode) => {
        try {
            const requestBody = { orderId };
            if (promoCode) {
              requestBody.promoCode = promoCode;
            }
        
            const response = await axiosInstance.post(`api/payment/walletOrder`, requestBody);
            return response.data;
        } catch (error) {
            console.log('Error while Paying with wallet : ', error);
            throw new Error(error.response?.data?.message || 'Failed to pay with wallet');
        }

    },
    PaywithCashForOrder: async (orderId,promoCode) => {
        try {
            const requestBody = { orderId };
            if (promoCode) {
              requestBody.promoCode = promoCode;
            }
        
            const response = await axiosInstance.post(`api/payment/cash`, requestBody);
            return response.data;
        } catch (error) {
            console.log('Error while accepting cash : ', error);
            throw new Error(error.response?.data?.message || 'Failed to pay with cash');
        }

    },
        
};
export default PaymentService;