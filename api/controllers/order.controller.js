// controllers/order.controller.js
import { StatusCodes } from "http-status-codes";

// export const placeOrder = async (req, res, next) => {
//     try {
//         const orderService = await req.container.resolve('orderService');
//         const {orderDetails } = req.body;
//         const touristService = await req.container.resolve("touristService");
//         const tourist = await touristService.findTouristByUserId(req.user.id);


//         const order = await orderService.placeOrder(productId, buyerId, quantity);

//         res.status(StatusCodes.CREATED).json({ success: true, data: order });
//     } catch (error) {
//         next(error);
//     }
// };
