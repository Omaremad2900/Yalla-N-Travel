import { StatusCodes } from "http-status-codes";
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const paymentIntent =async(req,res,next)=>
{
  try{
    // recieve array of ticket ids from body
    const {
      ticketIds,
      promoCode
    } = req.body;

    const paymentService = await req.container.resolve('paymentService');
    const paymentIntent = await paymentService.createPaymentIntent(ticketIds,promoCode);
    res.status(StatusCodes.OK).json({success:true,paymentIntent});
  }catch(error)
  {
    next(error);
  }
  
} 
export const paymentIntentForOrder =async(req,res,next)=>
{
  try{
    // recieve array of ticket ids from body
    const {
      orderId,
      promoCode
    } = req.body;

    const paymentService = await req.container.resolve('paymentService');
    const paymentIntent = await paymentService.createPaymentIntentForOrder(orderId,promoCode);
    res.status(StatusCodes.OK).json({success:true,paymentIntent});
  }catch(error)
  {
    next(error);
  }
  
} 
//This method handles the incoming webhook request
//This method handles the incoming webhook request
export const webhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature']; // Stripe signature from the headers
  let event; // Declare event here
  
 /* try {
    // Construct the event by verifying its signature
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log(event);
  } catch (error) {
    // If verification fails, send error to the error handling middleware
    console.log(error);
    return next(error);
  }*/

  try {
    const paymentService = await req.container.resolve('paymentService');
    // Pass the verified event to the payment service
    const result = await paymentService.handleStripeWebhook(req.body); // Use the initialized event
    res.status(StatusCodes.OK).json({ success: true, event: result });
  } catch (error) {
    // Pass any errors in payment handling to the error handling middleware
    next(error);
  }
};
//paying using wallet
export const payUsingWallet = async (req, res, next) => {
  try {
    const { ticketIds , promoCode} = req.body;
    const paymentService = await req.container.resolve('paymentService');
    const result = await paymentService.payUsingWallet(ticketIds,req.user.id,promoCode);
    res.status(StatusCodes.OK).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
//pay cash on delivery
export const payCash=async(req,res,next)=>{
  try{
    const {orderId,promoCode}=req.body;
    const paymentService = await req.container.resolve('paymentService');
    const result = await paymentService.payOrderOnDelivery(orderId,promoCode);
    res.status(StatusCodes.OK).json({ success: true, data: result });
  }catch(error){
    next(error);
}
}
//pay order with wallet
export const payOrderWithWallet=async(req,res,next)=>{
  try{
    const {orderId,promoCode}=req.body;
    const paymentService = await req.container.resolve('paymentService');
    const result = await paymentService.payOrderUsingWallet(orderId,req.user.id,promoCode);
    res.status(StatusCodes.OK).json({ success: true, data: result });
  }catch(error){
    next(error);
}
}

export const refundToWallet = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const paymentService = await req.container.resolve('paymentService');

    const result = await paymentService.refundOrderToWallet(orderId, req.user.id);
    res.status(StatusCodes.OK).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};