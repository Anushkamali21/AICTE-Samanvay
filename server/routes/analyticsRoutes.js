import express from 'express';
import { getDashboardStats, getInstitutionalStats } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/institutional', getInstitutionalStats);

export default router;
