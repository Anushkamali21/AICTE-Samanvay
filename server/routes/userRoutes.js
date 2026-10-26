import express from 'express';
import { updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.patch('/profile', protect, updateProfile);

export default router;
