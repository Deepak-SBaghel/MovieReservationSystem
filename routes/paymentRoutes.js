import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createPaymentIntent } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-payment-intent', verifyToken, createPaymentIntent);

export default router;
