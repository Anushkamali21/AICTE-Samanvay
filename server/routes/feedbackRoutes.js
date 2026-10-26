import express from 'express';
import {
  submitFeedback,
  getFeedbackForComplaint,
  getFeedbackAnalytics
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/:complaintId', submitFeedback);
router.get('/complaint/:complaintId', getFeedbackForComplaint);
router.get('/analytics', getFeedbackAnalytics);

export default router;
