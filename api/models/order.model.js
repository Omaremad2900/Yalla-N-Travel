// models/order.model.js
import mongoose from "mongoose";
import {addressSchema} from "./address.model.js"; // Import the Address schema


const orderSchema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true
    },
    paymentMethod:{
        type: String,
        enum : ['Cash','Visa','Wallet'],
        required:true
    },
    paymentStatus : {
        type : String,
        enum : ['Not Paid' , 'Failed' , 'Paid' , 'To Be Paid'],
        required : true,
        default : 'Not Paid'
    },
    orderStatus : {
        type : String,
        enum : ['Pending', 'Shipping', 'Shipped', 'Cancelled'],
        required : true,
        default : 'Pending'
    },

    deliveryAddress :{
        type : addressSchema,
        required : true
    },
    
    orderDate: {
        type: Date,
        default: Date.now,
        required : true

    },
    paymentIntentId:{
        type:String
        
    },
    orderPrice:{
        type:Number,
        
    }
   
}, { timestamps: true });


orderSchema.statics.didTouristBuyProduct = async function (touristId, productId) {
    try {
        // Query all orders by the given tourist
        const orders = await this.find({}).populate({
            path: 'cart',
            match: { user: touristId }, // Ensure the cart belongs to the tourist
            populate: { path: 'products.productId' } // Populate the product details in the cart
        });
        console.log(orders)

        // Check if any order's cart contains the specified product
        for (const order of orders) {
            const cart = order.cart;
            if (cart && cart.products.some(product => product.productId.equals(productId))) {
                return true; // The product exists in one of the orders
            }
        }

        return false; // No product match found
    } catch (error) {
        console.error("Error in checking product purchase:", error);
        throw error;
    }
};


export default mongoose.model("Order", orderSchema);
