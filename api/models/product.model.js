import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String
    },
    availableQuantity: {
        type: Number,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    isArchived :{
        type : Boolean,
        default : false
    },
    salesCount :{
        type:Number,
        default : 0
    }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;