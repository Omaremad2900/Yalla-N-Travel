// services/order.service.js
import { StatusCodes } from "http-status-codes";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import apiError from "../utils/apiError.js";
import Cart from "../models/cart.model.js";

class OrderService {
    async getAllMyOrders(touristId, page = 1, limit = 10) {
        try {
            //insure limit is page,limit are int 
            page = parseInt(page);
            limit = parseInt(limit);
            const skip = (page - 1) * limit;

            // Aggregate query to count all orders by the tourist
            const totalOrdersResult = await Order.aggregate([
                {
                    $lookup: {
                        from: 'carts',
                        localField: 'cart',
                        foreignField: '_id',
                        as: 'cartDetails'
                    }
                },
                { $unwind: '$cartDetails' },
                { $match: { 'cartDetails.user': touristId } },
                { $count: 'totalOrders' }
            ]);

            const totalOrders = totalOrdersResult.length > 0 ? totalOrdersResult[0].totalOrders : 0;

            // Aggregate query to find all orders by the tourist (populate related fields)
            const orders = await Order.aggregate([
                {
                    $lookup: {
                        from: 'carts',
                        localField: 'cart',
                        foreignField: '_id',
                        as: 'cartDetails'
                    }
                },
                { $unwind: '$cartDetails' },
                { $match: { 'cartDetails.user': touristId } },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'cartDetails.products.productId',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                { $skip: skip },
                { $limit: limit }
            ]);

            // If no orders are found, return an empty array
            if (!orders || orders.length === 0) {
                return [];
            }

            const totalItems = totalOrders;
            const totalPages = Math.ceil(totalItems / limit);
             // Return the populated orders with cart details and product details
             return {
                data: orders,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    limit,
                },
            };
        } catch (error) {
            throw new apiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async placeOrder(tourist_id,cart, orderDetails) {
        try {
            // console.log(cart)

            if (cart.products.length === 0) {
                throw new apiError('Cart is empty.',StatusCodes.BAD_REQUEST);
            }

            for (const item of cart.products) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    throw new apiError(`Product with ID ${item.productId} not found.`, StatusCodes.BAD_REQUEST);
                }
            
                if (product.availableQuantity < item.quantity) {
                    throw new apiError(
                        `Product "${product.name}" is not available in the required quantity (${item.quantity}).`, StatusCodes.BAD_REQUEST
                    );
                }
            }
            
            for (const item of cart.products) {
                const product = await Product.findByIdAndUpdate(
                    item.productId,
                    { 
                        $inc: { availableQuantity: -item.quantity },
                        $inc: { salesCount: item.quantity }
                     },
                    { new: true } // Return the updated document
                );
            
                if (!product) {
                    throw new apiError(`Failed to update product with ID ${item.productId}.`, StatusCodes.INTERNAL_SERVER_ERROR);
                }
            }
            

            if(!orderDetails)
                throw new apiError("Please Enter Order Details", StatusCodes.BAD_REQUEST);

            if(!orderDetails.paymentMethod)
                throw new apiError("Please Enter Payment Method", StatusCodes.BAD_REQUEST);

            if(!orderDetails.deliveryAddress)
                throw new apiError("Please Enter Delivery Address", StatusCodes.BAD_REQUEST);

            const orderData = {
                cart,
                paymentMethod: orderDetails.paymentMethod,
                deliveryAddress:{...orderDetails.deliveryAddress,tourist_id: tourist_id }
            };


            // Create a new order
            const newOrder = new Order(orderData);
            await newOrder.save();

            const newCart = new Cart({user:tourist_id});
            await newCart.save();

            return newOrder;
        } catch (error) {
            throw new apiError(`Error placing order: ${error.message}`,StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default OrderService;
