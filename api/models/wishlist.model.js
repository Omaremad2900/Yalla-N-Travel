import mongoose from "mongoose";


const wishlistSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true
    }
}, {
    timestamps: true
});


const WishList = mongoose.model("WishList", wishlistSchema);
export default WishList;
