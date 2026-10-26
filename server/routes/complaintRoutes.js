import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getPublicComplaintStatus,
  addAdditionalInformation,
  uploadSupportingDocument,
  requestReopen,
  checkDuplicates
} from '../controllers/complaintController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public status tracking (unauthenticated)
router.get('/public/:referenceId', getPublicComplaintStatus);

// All subsequent routes require authentication
router.use(protect);

router.post('/', createComplaint);
router.get('/my', getMyComplaints);
router.post('/check-duplicates', checkDuplicates);
router.get('/:id', getComplaintById);
router.post('/:id/notes', addAdditionalInformation);
router.post('/:id/documents', upload.single('document'), uploadSupportingDocument);
router.post('/:id/reopen', requestReopen);

export default router;
