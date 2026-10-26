import express from 'express';
import {
  getAdminComplaints,
  updateComplaintStatus,
  assignComplaint,
  linkComplaintCase,
  escalateComplaint,
  submitInstitutionResponse,
  resolveComplaint
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles(ROLES.INSTITUTION_NODAL, ROLES.AICTE_ADMIN));

router.get('/complaints', getAdminComplaints);
router.patch('/complaints/:id/status', updateComplaintStatus);
router.patch('/complaints/:id/assignment', assignComplaint);
router.post('/complaints/:id/link', linkComplaintCase);
router.post('/complaints/:id/escalate', escalateComplaint);
router.post('/complaints/:id/response', submitInstitutionResponse);
router.post('/complaints/:id/resolve', resolveComplaint);

export default router;
