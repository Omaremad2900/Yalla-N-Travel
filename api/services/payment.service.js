import Stripe from 'stripe';
import apiError from '../utils/apiError.js';
import { StatusCodes } from "http-status-codes";
import Ticket from '../models/ticket.model.js';
import Tourist from "../models/tourist.model.js";
import { schedulePaymentConfirmationEmail } from '../utils/Jobs/agenda.js';
import promoCodeModel from '../models/promoCode.model.js';
import orderModel from '../models/order.model.js';
import container from '../config/di-container.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  constructor(ticketService) {
    this.ticketService = ticketService;
  }

  async createPaymentIntent(ticketIds, promoCodeName) {
    try {
      const tickets = await Ticket.find({ _id: { $in: ticketIds } });
      if (!tickets || tickets.length === 0) {
        throw new apiError('Tickets not found', StatusCodes.NOT_FOUND);
      }
  
      // Calculate total amount of tickets
      let amount = 0;
      for (let i = 0; i < tickets.length; i++) {
        amount += tickets[i].price;
      }
  
      // Promo Code Validation
      if (promoCodeName) {
        const promoCode = await promoCodeModel.findOne({ name: promoCodeName.toUpperCase() });
        if (!promoCode) {
          throw new apiError('Promo code not found', StatusCodes.NOT_FOUND);
        }
  
        // Check if promo code is active and not expired
        if (!promoCode.isActive || (promoCode.expirationDate && new Date() > promoCode.expirationDate)) {
          throw new apiError('Promo code is invalid or expired', StatusCodes.BAD_REQUEST);
        }
  
        // Apply discount multiplier
        amount *= promoCode.discountMultiplier;
      }
  
      const amountInCents = Math.round(amount * 100); // Convert to cents
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      });
  
      if (!paymentIntent) {
        throw new apiError('PaymentIntent not created', StatusCodes.INTERNAL_SERVER_ERROR);
      }
  
      // Loop through tickets and set paymentId
      for (let i = 0; i < tickets.length; i++) {
        tickets[i].paymentId = paymentIntent.id;
        await tickets[i].save();
      }
  
      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      throw new apiError(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }  
  async handlePaymentSuccess(paymentId) {
    try {
      const payment = await stripe.paymentIntents.retrieve(paymentId);
  
      // Check if the payment was for an order
      const order = await orderModel
  .findOne({ paymentIntentId: paymentId })
  .populate({
    path: 'cart',
    populate: {
      path: 'products.productId',
      model: 'Product',
    },
  });

if (order) {
  // Mark order as paid
  for (const item of order.cart.products) {
    const product = item.productId; // Access the populated product
    if (product) {
      // Check stock availability
      if (product.availableQuantity < item.quantity) {
        throw new apiError(
          `Insufficient stock for product ${product.name}`,
          StatusCodes.BAD_REQUEST
        );
      }


      // Deduct quantity and save the product
      product.availableQuantity -= item.quantity;
      //increment sales count
      product.salesCount += item.quantity;
      await product.save();
      this.checkProductStock(product._id);
    } else {
      throw new apiError(
        `Product not found for item ${item.productName}`,
        StatusCodes.NOT_FOUND
      );
    }
  }


        order.paymentStatus = 'Paid';
        order.orderStatus = 'Shipping'; // Update status as required
        order.paymentMethod='Visa';
        await order.save();
        
  
        // Notify user and update any loyalty points if applicable
        const user = await Tourist.findById(order.user).populate('user');
        if (user) {
          const totalOrderPrice = order.cart.totalPrice;
  
          // Calculate and update loyalty points
          if (user.level == 1) {
            user.loyaltyPoints += totalOrderPrice * 0.5;
          } else if (user.level == 2) {
            user.loyaltyPoints += totalOrderPrice * 1;
          } else {
            user.loyaltyPoints += totalOrderPrice * 1.5;
          }
          await user.save();
  
          // Send payment confirmation email
          await schedulePaymentConfirmationEmail(user.user.email, user.user.username, totalOrderPrice);
        }
  
        return; // Exit early if payment was for an order
      }
  
      // If no order is found, proceed with ticket processing
      const tickets = await Ticket.find({ paymentId });
  
      if (!tickets || tickets.length === 0) {
        throw new apiError('Tickets not found', StatusCodes.NOT_FOUND);
      }
  
      let totalPrice = 0;
  
      for (let i = 0; i < tickets.length; i++) {
        totalPrice += tickets[i].price;
        tickets[i].status = 'Paid';
        tickets[i].paymentType = 'card';
        await tickets[i].save();
      }
  
      const tourist = await Tourist.findOne({ user: tickets[0].assignee }).populate('user');
      if (!tourist) {
        throw new apiError('Tourist not found', StatusCodes.NOT_FOUND);
      }
  
      // Calculate loyalty points
      if (tourist.level == 1) {
        tourist.loyaltyPoints += totalPrice * 0.5;
      } else if (tourist.level == 2) {
        tourist.loyaltyPoints += totalPrice * 1;
      } else {
        tourist.loyaltyPoints += totalPrice * 1.5;
      }
  
      await tourist.save();
  
      // Send payment confirmation email
      await schedulePaymentConfirmationEmail(tourist.user.email, tourist.user.username, totalPrice);
    } catch (error) {
      throw new apiError(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
  

  async handlePaymentFailure(paymentId) {
    try {
      const payment = await stripe.paymentIntents.retrieve(paymentId);
  
      // Check if the payment was for an order
      const order = await orderModel.findOne({ paymentIntentId: paymentId });
      if (order) {
        // Mark order as not paid or failed
        order.paymentStatus = 'Failed';
        order.orderStatus = 'Pending'; // Optional: You can also cancel the order
        await order.save();
        return; // Exit early if payment was for an order
      }
  
      // If no order is found, proceed with ticket processing
      const tickets = await Ticket.find({ paymentId });
  
      if (!tickets || tickets.length === 0) {
        throw new apiError(`No tickets with payment ID ${paymentId}`, StatusCodes.NOT_FOUND);
      }
  
      for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].itinerary) {
          await this.deleteTicketForItinerary(tickets[i]._id);
        } else if (tickets[i].activity) {
          await this.deleteTicketforActivity(tickets[i]._id);
        }
      }
    } catch (error) {
      throw new apiError(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  

  async handleStripeWebhook(event) {
    try {
      let payment;
      switch (event.type) {
        case 'payment_intent.succeeded':
          payment = await this.handlePaymentSuccess(event.data.object.id);
          break;
        case 'payment_intent.payment_failed':
          payment = await this.handlePaymentFailure(event.data.object.id);
          break;
        default:
          throw new apiError('Unhandled event type.', StatusCodes.NOT_FOUND);
      }
      return payment;
    } catch (error) {
      throw new apiError(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  //pay using wallet
  async payUsingWallet(ticketIds, touristId, promoCodeName) {
    try {
      const tourist = await Tourist.findOne({ user: touristId }).populate('user');
      if (!tourist) {
        throw new apiError('Tourist not found', StatusCodes.NOT_FOUND);
      }
  
      const tickets = await Ticket.find({ _id: { $in: ticketIds } });
      if (!tickets.length) {
        throw new apiError('Tickets not found', StatusCodes.NOT_FOUND);
      }
  
      // Calculate total amount of tickets
      let amount = 0;
      for (let ticket of tickets) {
        amount += ticket.price;
        ticket.paymentType = 'wallet';
        ticket.status = 'Paid';
      }
  
      // Apply promo code discount if provided
      if (promoCodeName) {
        const promoCode = await promoCodeModel.findOne({ name: promoCodeName.toUpperCase() });
        if (!promoCode) {
          throw new apiError('Promo code not found', StatusCodes.NOT_FOUND);
        }
  
        if (!promoCode.isActive || (promoCode.expirationDate && new Date() > promoCode.expirationDate)) {
          throw new apiError('Promo code is invalid or expired', StatusCodes.BAD_REQUEST);
        }
  
        amount *= promoCode.discountMultiplier;
      }
  
      // Check if tourist has sufficient funds
      if (tourist.wallet < amount) {
        throw new apiError('Insufficient funds', StatusCodes.BAD_REQUEST);
      }
  
      // Deduct amount from tourist wallet
      tourist.wallet -= amount;
      
  
      // Add loyalty points based on tourist level
      if (tourist.level == 1) {
        tourist.loyaltyPoints += amount * 0.5;
      } else if (tourist.level == 2) {
        tourist.loyaltyPoints += amount * 1;
      } else {
        tourist.loyaltyPoints += amount * 1.5;
      }
  
      // Schedule confirmation email
      await schedulePaymentConfirmationEmail(tourist.user.email, tourist.user.username, amount);
  
      await tourist.save();
  
      // Save all ticket updates in parallel to reduce database calls
      await Promise.all(tickets.map(ticket => ticket.save()));
  
      return tourist;
    } catch (error) {
      throw new apiError(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async createPaymentIntentForOrder(orderId, promoCodeName) {
    try {
      
        const order = await orderModel.findById(orderId).populate({
            path: 'cart',
            populate: { path: 'products.productId' } // Ensure products are fully populated
        });

        if (!order) {
            throw new apiError('Order not found', StatusCodes.NOT_FOUND);
        }

        const cart = order.cart;

        if (!cart || cart.products.length === 0) {
            throw new apiError('Cart is empty or not found', StatusCodes.BAD_REQUEST);
        }

        // Calculate total amount
        let amount = cart.totalPrice;

        // Promo Code Validation
        if (promoCodeName) {
            const promoCode = await promoCodeModel.findOne({ name: promoCodeName.toUpperCase() });
            if (!promoCode) {
                throw new apiError('Promo code not found', StatusCodes.NOT_FOUND);
            }

            // Check if promo code is active and valid
            if (!promoCode.isActive || (promoCode.expirationDate && new Date() > promoCode.expirationDate)) {
                throw new apiError('Promo code is invalid or expired', StatusCodes.BAD_REQUEST);
            }

            // Apply discount multiplier
            amount *= promoCode.discountMultiplier;
        }

        const amountInCents = Math.round(amount * 100); // Convert to cents

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        if (!paymentIntent) {
            throw new apiError('PaymentIntent not created', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        // Attach payment ID to the order
        order.paymentIntentId = paymentIntent.id;
        order.orderPrice=amount;
        await order.save();

        return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
        throw new apiError(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
//pay order on delivery
async payOrderOnDelivery(orderId,promoCodeName) {
  try {
    // Find the order and populate nested productId in items
    const order = await orderModel
      .findById(orderId)
      .populate({
        path: 'cart',
        populate: {
          path: 'products.productId',
          model: 'Product',
        },
      });

    // Check if the order exists
    if (!order) {
      throw new apiError('Order not found', StatusCodes.NOT_FOUND);
    }

    // Check if cart and products are populated
    if (!order.cart || order.cart.products.length === 0) {
      throw new apiError('No products found in the order', StatusCodes.BAD_REQUEST);
    }

    // Update product quantities and validate stock
    for (const item of order.cart.products) {
      const product = item.productId; // Access populated product
      if (!product) {
        throw new apiError(`Product not found for item ${item._id}`, StatusCodes.NOT_FOUND);
      }

      // Check stock availability
      if (product.availableQuantity < item.quantity) {
        throw new apiError(
          `Insufficient stock for product ${product.name}. Available: ${product.availableQuantity}, Requested: ${item.quantity}`,
          StatusCodes.BAD_REQUEST
        );
      }

      // Deduct the quantity from available stock
      product.availableQuantity -= item.quantity;
      product.salesCount += item.quantity;
      // Save updated product
      await product.save();
      this.checkProductStock(product._id);
    }
    let totalPrice=order.cart.totalPrice
    // Apply promo code discount if provided
    if (promoCodeName) {
      const promoCode = await promoCodeModel.findOne({ name: promoCodeName.toUpperCase() });
      if (!promoCode) {
        throw new apiError('Promo code not found', StatusCodes.NOT_FOUND);
      }
      // Check if promo code is valid for the order
      if (!promoCode.isActive || (promoCode.expirationDate && new Date() > promoCode.expirationDate)) {
        throw new apiError('Promo code is invalid or expired', StatusCodes.BAD_REQUEST);
      }
      // Apply discount multiplier
      totalPrice *= promoCode.discountMultiplier;
    }
    // Update order with new total price and save
    order.orderPrice = totalPrice;

    // Update order fields
    order.paymentStatus = 'To Be Paid';
    order.orderStatus = 'Shipping'; // Adjust to the next appropriate status
    order.paymentMethod = 'Cash';

    // Save the updated order
    await order.save();

    return order;
  } catch (error) {
    throw new apiError(
      error.message,
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async  payOrderUsingWallet(orderId, touristId, promoCodeName) {
  try {
    // Fetch the tourist and their wallet details
    const tourist = await Tourist.findOne({ user: touristId }).populate('user');
    if (!tourist) {
      throw new apiError('Tourist not found', StatusCodes.NOT_FOUND);
    }

    // Fetch the order and its related cart details
    const order = await orderModel
      .findById(orderId)
      .populate({
        path: 'cart',
        populate: {
          path: 'products.productId',
          model: 'Product',
        },
      });

    if (!order) {
      throw new apiError('Order not found', StatusCodes.NOT_FOUND);
    }

    if (!order.cart || order.cart.products.length === 0) {
      throw new apiError('No products found in the order', StatusCodes.BAD_REQUEST);
    }

    // Calculate the total price of the order
    let totalAmount = order.cart.totalPrice

    // Apply promo code discount if provided
    if (promoCodeName) {
      const promoCode = await promoCodeModel.findOne({ name: promoCodeName.toUpperCase() });
      if (!promoCode) {
        throw new apiError('Promo code not found', StatusCodes.NOT_FOUND);
      }

      if (!promoCode.isActive || (promoCode.expirationDate && new Date() > promoCode.expirationDate)) {
        throw new apiError('Promo code is invalid or expired', StatusCodes.BAD_REQUEST);
      }

      totalAmount *= promoCode.discountMultiplier;
    }

    // Check if the tourist has sufficient wallet balance
    if (tourist.wallet < totalAmount) {
      throw new apiError('Insufficient funds', StatusCodes.BAD_REQUEST);
    }

    // Deduct the amount from the tourist's wallet
    tourist.wallet -= totalAmount;

    // Add loyalty points based on the tourist's level
    if (tourist.level == 1) {
      tourist.loyaltyPoints += totalAmount * 0.5;
    } else if (tourist.level == 2) {
      tourist.loyaltyPoints += totalAmount * 1;
    } else {
      tourist.loyaltyPoints += totalAmount * 1.5;
    }

    // Update the order status and payment details
    order.paymentStatus = 'Paid';
    order.orderStatus = 'Shipping'; // Update to the next status as per requirements
    order.paymentMethod = 'Wallet';
    order.orderPrice=totalAmount;

    // Deduct quantities from products in the order
    for (const item of order.cart.products) {
      const product = item.productId;
      if (!product) {
        throw new apiError(`Product not found for item ${item._id}`, StatusCodes.NOT_FOUND);
      }

      if (product.availableQuantity < item.quantity) {
        throw new apiError(
          `Insufficient stock for product ${product.name}. Available: ${product.availableQuantity}, Requested: ${item.quantity}`,
          StatusCodes.BAD_REQUEST
        );
      }

      // Deduct product quantity
      product.availableQuantity -= item.quantity;
      product.salesCount += item.quantity;
      await product.save();
      this.checkProductStock(product._id);
    }

    // Schedule payment confirmation email
    await schedulePaymentConfirmationEmail(tourist.user.email, tourist.user.username, totalAmount);

    // Save the updated tourist and order details
    await tourist.save();
    await order.save();

    return { tourist, order };
  } catch (error) {
    throw new apiError(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async refundToWallet(touristId, amount) {
  const tourist = await Tourist.findOne({ user: touristId });
  if (!tourist) throw new apiError('Tourist not found', StatusCodes.NOT_FOUND);

  const walletBefore = tourist.wallet;
  tourist.wallet += amount;
  await tourist.save();
  const walletAfter = tourist.wallet;

  return { walletBefore, walletAfter, refundedAmount: amount };
}

async checkProductStock(productId) {
  const productService = container.resolve('productService');
  await productService.checkAndNotifyOutOfStock(productId);
}

}

export default PaymentService;