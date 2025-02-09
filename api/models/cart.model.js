import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    addedTime: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default : true
    }
});

const cartSchema = new mongoose.Schema({
    products: [cartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true
    }
}, {
    timestamps: true
});

// Middleware to calculate totalPrice before saving
cartSchema.pre('save', function(next) {
    this.totalPrice = this.products.reduce((total, item) => total + (item.price * item.quantity), 0);
    next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
