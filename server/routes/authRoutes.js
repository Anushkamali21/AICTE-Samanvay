import express from 'express';
import { requestOtp, verifyOtp, demoLogin, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/demo-login', demoLogin);
router.get('/me', protect, getMe);

export default router;
