import express from 'express';
import bodyParser from 'body-parser';

import {verifyToken, authorizeRoles,checkTermsAccepted,CheckProfile} from "../utils/verifyUser.js";
import {
    paymentIntent,
    webhook,
    payUsingWallet,
    paymentIntentForOrder,
    payCash,
    payOrderWithWallet
} from "../controllers/payment.controller.js";

const router = express.Router();
router.post('/payment/paymentintent',verifyToken,authorizeRoles(['Tourist']), paymentIntent);
router.post(
    '/webhook/stripe-webhook',
    bodyParser.raw({ type: 'application/json' }), // Parse raw body for Stripe webhook
    webhook
  );
router.post('/payment/wallet',verifyToken,authorizeRoles(['Tourist']),payUsingWallet);
router.post('/payment/paymentintentOrder',verifyToken,authorizeRoles(['Tourist']),paymentIntentForOrder);
router.post('/payment/cash',verifyToken,authorizeRoles(['Tourist']),payCash);
router.post('/payment/walletOrder',verifyToken,authorizeRoles(['Tourist']),payOrderWithWallet);
export default router;