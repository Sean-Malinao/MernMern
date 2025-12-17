import express from 'express';
import {
  signup,
  verifyOTP,
  login,
  resendOTP,
  getCurrentUser,
  forgotPassword,
  verifyForgotOTP,
  resetPassword
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/verify-forgot-otp', verifyForgotOTP);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);

export default router;
