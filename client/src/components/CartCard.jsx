import React, { useState } from "react";
import touristService from "../services/touristService";

export default function CartCard({ cartProduct, idx, loggedInUser, currency, refreshCart }) {
    const [quantity, setQuantity] = useState(cartProduct.quantity);

    const handleRemoveFromCart = async () => {
        try {
            console.log(cartProduct._id);
            const response = await touristService.removeItemFromCart(cartProduct.productId._id);
            console.log(response);
            console.log(`Removed from cart: ${cartProduct._id}`);
            refreshCart(); // Refresh cart items after removal
        } catch (error) {
            console.error(`Failed to remove from cart ${cartProduct._id}`, error);
        }
    };

    const handleUpdateQuantity = async (newQuantity) => {
        try {
            const response = await touristService.changeItemQuantity(cartProduct.productId._id, newQuantity);
            console.log(response);
            setQuantity(newQuantity); // Update local state
            refreshCart(); // Refresh cart items after update
        } catch (error) {
            console.error(`Failed to update quantity for ${cartProduct._id}`, error);
        }
    };

    return (
        <div className="relative cartProduct-card">
            <div key={idx} className="max-w-sm bg-slate-200 border border-gray-200 rounded-lg shadow">
                <a href="#">
                    <img 
                        className="rounded-t-lg" 
                        src={cartProduct.productId.imageUrl} 
                        alt={cartProduct.productId.productName || "Product Image"} 
                    />
                </a>
                <div className="p-5">
                    <a href="#">
                        {/* Display the productName if available */}
                        <h5 className="mb-2 text-2xl font-bold tracking-tight dark:text-white">
                            {cartProduct.productName || "No Product Name"}
                        </h5>
                    </a>
                    {/* Display the price */}
                    <p className="mb-3 font-normal text-gray-700">
                        Price: {cartProduct.price} {currency}
                    </p>

                    {/* Display quantity input */}
                    <p className="mb-3 font-normal text-gray-700">
                        Quantity: 
                        <input 
                            type="number" 
                            value={quantity} 
                            min="1" 
                            onChange={(e) => handleUpdateQuantity(Number(e.target.value))} 
                            className="ml-2 w-16 text-center border rounded"
                        />
                    </p>

                    {/* Remove button */}
                    <button
                        onClick={handleRemoveFromCart}
                        className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-600"
                    >
                        Remove from Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
