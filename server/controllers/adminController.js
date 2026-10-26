import memoryStore from '../services/memoryStore.js';
import { COMPLAINT_STATUSES, ALLOWED_TRANSITIONS, ROLES } from '../config/constants.js';
import { calculateSlaStatus } from '../services/routingService.js';

export const getAdminComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, institution, search } = req.query;
    let complaints = memoryStore.getAllComplaints();

    // Restrict Institution Nodal Officer to complaints in their institution
    if (req.user.role === ROLES.INSTITUTION_NODAL) {
      complaints = complaints.filter(c => 
        c.institution.toLowerCase().includes(req.user.institution.toLowerCase()) ||
        c.institutionId === req.user.institutionId
      );
    }

    if (status) {
      complaints = complaints.filter(c => c.currentStatus === status);
    }
    if (category) {
      complaints = complaints.filter(c => c.category === category);
    }
    if (priority) {
      complaints = complaints.filter(c => c.priority === priority);
    }
    if (institution) {
      complaints = complaints.filter(c => c.institution.toLowerCase().includes(institution.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      complaints = complaints.filter(c =>
        c.referenceId.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.complainantName.toLowerCase().includes(q)
      );
    }

    // Attach SLA metrics
    const enriched = complaints.map(c => ({
      ...c,
      slaStatus: calculateSlaStatus(c.createdAt, c.category, c.currentStatus)
    }));

    return res.status(200).json({
      success: true,
      count: enriched.length,
      complaints: enriched
    });
  } catch (error) {
    next(error);
  }
};

export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newStatus, explanation } = req.body;

    if (!newStatus || !explanation) {
      return res.status(400).json({
        success: false,
        message: 'New status and explanatory remark are required.'
      });
    }

    const complaint = memoryStore.findComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (req.user.role === ROLES.INSTITUTION_NODAL) {
      if (!complaint.institution.toLowerCase().includes(req.user.institution.toLowerCase())) {
        return res.status(403).json({ success: false, message: 'Access denied: Out of institutional jurisdiction.' });
      }
    }

    const allowed = ALLOWED_TRANSITIONS[complaint.currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid workflow transition. Cannot move complaint from "${complaint.currentStatus}" to "${newStatus}".`
      });
    }

    const previousStatus = complaint.currentStatus;
    const updates = { currentStatus: newStatus };

    if (newStatus === COMPLAINT_STATUSES.RESOLVED) {
      updates.resolvedAt = new Date();
    } else if (newStatus === COMPLAINT_STATUSES.CLOSED) {
      updates.closedAt = new Date();
    }

    const updated = memoryStore.updateComplaint(complaint._id, updates);

    memoryStore.addHistory({
      complaintId: complaint._id,
      referenceId: complaint.referenceId,
      previousStatus,
      newStatus,
      action: `Status Transition: ${previousStatus} to ${newStatus}`,
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      userVisibleExplanation: explanation.trim()
    });

    memoryStore.addNotification({
      userId: complaint.complainantId,
      notificationType: 'STATUS_CHANGED',
      title: 'Complaint Status Updated',
      message: `Your complaint ${complaint.referenceId} status has been updated to "${newStatus}".`,
      complaintId: complaint._id,
      referenceId: complaint.referenceId
    });

    return res.status(200).json({
      success: true,
      message: `Status successfully updated to ${newStatus}.`,
      complaint: updated
    });
  } catch (error) {
    next(error);
  }
};

export const assignComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assignedTo, assignedCell, remark } = req.body;

    if (!assignedTo || !assignedCell) {
      return res.status(400).json({
        success: false,
        message: 'Assigned officer and assigned cell are required.'
      });
    }

    const complaint = memoryStore.findComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const updated = memoryStore.updateComplaint(complaint._id, {
      assignedTo: assignedTo.trim(),
      assignedCell: assignedCell.trim(),
      currentStatus: complaint.currentStatus === COMPLAINT_STATUSES.SUBMITTED ? COMPLAINT_STATUSES.ASSIGNED : complaint.currentStatus
    });

    memoryStore.addHistory({
      complaintId: complaint._id,
      referenceId: complaint.referenceId,
      previousStatus: complaint.currentStatus,
      newStatus: updated.currentStatus,
      action: 'Case Assigned',
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      userVisibleExplanation: remark || `Assigned to ${assignedTo} (${assignedCell}).`
    });

    return res.status(200).json({
      success: true,
      message: 'Complaint assignment updated successfully.',
      complaint: updated
    });
  } catch (error) {
    next(error);
  }
};

export const linkComplaintCase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { targetReferenceId, reason } = req.body;

    if (!targetReferenceId) {
      return res.status(400).json({ success: false, message: 'Target Reference ID is required to link cases.' });
    }

    const complaint = memoryStore.findComplaintById(id);
    const targetComplaint = memoryStore.findComplaintById(targetReferenceId);

    if (!complaint || !targetComplaint) {
      return res.status(404).json({ success: false, message: 'One or both complaint records could not be found.' });
    }

    const currentLinks = complaint.linkedCases || [];
    if (!currentLinks.includes(targetComplaint.referenceId)) {
      currentLinks.push(targetComplaint.referenceId);
      memoryStore.updateComplaint(complaint._id, { linkedCases: currentLinks });
    }

    const targetLinks = targetComplaint.linkedCases || [];
    if (!targetLinks.includes(complaint.referenceId)) {
      targetLinks.push(complaint.referenceId);
      memoryStore.updateComplaint(targetComplaint._id, { linkedCases: targetLinks });
    }

    memoryStore.addHistory({
      complaintId: complaint._id,
      referenceId: complaint.referenceId,
      previousStatus: complaint.currentStatus,
      newStatus: complaint.currentStatus,
      action: 'Cases Bundled for Joint Review',
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      userVisibleExplanation: `Linked to related complaint ${targetComplaint.referenceId}: ${reason || 'Identified institutional overlap.'}`
    });

    return res.status(200).json({
      success: true,
      message: `Successfully linked ${complaint.referenceId} with ${targetComplaint.referenceId}.`,
      linkedCases: currentLinks
    });
  } catch (error) {
    next(error);
  }
};

export const escalateComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Escalation justification is required.'
      });
    }

    const complaint = memoryStore.findComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const previousStatus = complaint.currentStatus;
    const updated = memoryStore.updateComplaint(complaint._id, {
      currentStatus: COMPLAINT_STATUSES.ESCALATED,
      escalatedAt: new Date(),
      escalationReason: reason.trim()
    });

    memoryStore.addHistory({
      complaintId: complaint._id,
      referenceId: complaint.referenceId,
      previousStatus,
      newStatus: COMPLAINT_STATUSES.ESCALATED,
      action: 'Case Escalated to Higher Authority',
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      userVisibleExplanation: `Case escalated: ${reason.trim()}`
    });

    memoryStore.addNotification({
      userId: complaint.complainantId,
      notificationType: 'COMPLAINT_ESCALATED',
      title: 'Complaint Escalated',
      message: `Complaint ${complaint.referenceId} has been escalated for high-level administrative review.`,
      complaintId: complaint._id,
      referenceId: complaint.referenceId
    });

    return res.status(200).json({
      success: true,
      message: 'Complaint escalated successfully.',
      complaint: updated
    });
  } catch (error) {
    next(error);
  }
};

export const submitInstitutionResponse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    if (!response || !response.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Institutional response text is required.'
      });
    }

    const complaint = memoryStore.findComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const responseObj = {
      response: response.trim(),
      respondedBy: req.user.name,
      respondedAt: new Date()
    };

    const updated = memoryStore.updateComplaint(complaint._id, {
      institutionResponse: responseObj,
      currentStatus: COMPLAINT_STATUSES.IN_PROGRESS
    });

    memoryStore.addHistory({
      complaintId: complaint._id,
      referenceId: complaint.referenceId,
      previousStatus: complaint.currentStatus,
      newStatus: COMPLAINT_STATUSES.IN_PROGRESS,
      action: 'Institutional Response Submitted',
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      userVisibleExplanation: `Institution provided formal reply: "${response.substring(0, 100)}..."`
    });

    memoryStore.addNotification({
      userId: complaint.complainantId,
      notificationType: 'INSTITUTION_RESPONSE',
      title: 'Institution Response Received',
      message: `The institution has submitted an official response regarding complaint ${complaint.referenceId}.`,
      complaintId: complaint._id,
      referenceId: complaint.referenceId
    });

    return res.status(200).json({
      success: true,
      message: 'Institutional response logged successfully.',
      complaint: updated
    });
  } catch (error) {
    next(error);
  }
};

export const resolveComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { summary } = req.body;

    if (!summary || !summary.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A formal resolution summary is required.'
      });
    }

    const complaint = memoryStore.findComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const resolutionObj = {
      summary: summary.trim(),
      resolvedBy: req.user.name,
      resolvedAt: new Date()
    };

    const updated = memoryStore.updateComplaint(complaint._id, {
      resolutionSummary: resolutionObj,
      currentStatus: COMPLAINT_STATUSES.RESOLVED,
      resolvedAt: new Date()
    });

    memoryStore.addHistory({
      complaintId: complaint._id,
      referenceId: complaint.referenceId,
      previousStatus: complaint.currentStatus,
      newStatus: COMPLAINT_STATUSES.RESOLVED,
      action: 'Resolution Issued',
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      userVisibleExplanation: `Formal resolution issued: ${summary.trim()}`
    });

    memoryStore.addNotification({
      userId: complaint.complainantId,
      notificationType: 'RESOLUTION_ISSUED',
      title: 'Complaint Resolved: Feedback Requested',
      message: `Complaint ${complaint.referenceId} has been resolved. Please share your satisfaction feedback.`,
      complaintId: complaint._id,
      referenceId: complaint.referenceId
    });

    return res.status(200).json({
      success: true,
      message: 'Complaint resolved successfully.',
      complaint: updated
    });
  } catch (error) {
    next(error);
  }
};
