import memoryStore from '../services/memoryStore.js';
import { COMPLAINT_STATUSES, SENSITIVE_CATEGORIES } from '../config/constants.js';
import { canAccessComplaint, sanitizeComplaintForUser } from '../middleware/rbac.js';
import { determineRoutingCell, calculateSlaStatus } from '../services/routingService.js';
import { findPotentialDuplicates } from '../services/duplicateService.js';

export const createComplaint = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      targetType,
      institution,
      department,
      incidentDate,
      priority = 'Normal',
      expectedResolution
    } = req.body;

    if (!title || !description || !category || !targetType || !institution) {
      return res.status(400).json({
        success: false,
        message: 'Missing mandatory fields: title, description, category, targetType, and institution are required.'
      });
    }

    const isSensitive = SENSITIVE_CATEGORIES.includes(category);
    const routingInfo = determineRoutingCell(category, priority);

    const newComplaint = memoryStore.createComplaint({
      complainantId: req.user._id,
      complainantName: req.user.name,
      complainantRole: req.user.role,
      complainantEmail: req.user.email,
      complainantMobile: req.user.mobile,
      title: title.trim(),
      description: description.trim(),
      category,
      isSensitive,
      targetType,
      institution: institution.trim(),
      institutionId: req.user.institutionId || 'INST-001',
      department: department ? department.trim() : req.user.department || 'General',
      incidentDate: incidentDate ? new Date(incidentDate) : new Date(),
      priority,
      expectedResolution: expectedResolution ? expectedResolution.trim() : '',
      currentStatus: COMPLAINT_STATUSES.SUBMITTED,
      assignedTo: 'Unassigned',
      assignedCell: routingInfo.cell,
      linkedCases: []
    });

    // Add notification
    memoryStore.addNotification({
      userId: req.user._id,
      notificationType: 'COMPLAINT_REGISTERED',
      title: 'Complaint Registered Successfully',
      message: `Your complaint has been registered with reference ID ${newComplaint.referenceId}.`,
      complaintId: newComplaint._id,
      referenceId: newComplaint.referenceId
    });

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint: newComplaint
    });
  } catch (error) {
    next(error);
  }
};

export const getMyComplaints = async (req, res, next) => {
  try {
    const { status, category, search } = req.query;
    let complaints = memoryStore.getAllComplaints({ complainantId: req.user._id });

    if (status) {
      complaints = complaints.filter(c => c.currentStatus === status);
    }
    if (category) {
      complaints = complaints.filter(c => c.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      complaints = complaints.filter(c => 
        c.referenceId.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.institution.toLowerCase().includes(q)
      );
    }

    // Attach SLA status
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

export const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = memoryStore.findComplaintById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint record not found.'
      });
    }

    if (!canAccessComplaint(req.user, complaint)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this complaint.'
      });
    }

    const sanitized = sanitizeComplaintForUser(req.user, complaint);
    sanitized.slaStatus = calculateSlaStatus(complaint.createdAt, complaint.category, complaint.currentStatus);
    const history = memoryStore.getHistoriesForComplaint(complaint._id);
    const feedback = memoryStore.getFeedbackForComplaint(complaint._id);

    return res.status(200).json({
      success: true,
      complaint: sanitized,
      history,
      feedback: feedback || null
    });
  } catch (error) {
    next(error);
  }
};

// Public status lookup (no login required, used for landing page tracker)
export const getPublicComplaintStatus = async (req, res, next) => {
  try {
    const { referenceId } = req.params;
    if (!referenceId) {
      return res.status(400).json({ success: false, message: 'Reference ID is required.' });
    }

    const complaint = memoryStore.findComplaintById(referenceId.trim().toUpperCase());
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No grievance record found with reference "${referenceId}". Please verify the identifier.`
      });
    }

    const slaStatus = calculateSlaStatus(complaint.createdAt, complaint.category, complaint.currentStatus);
    const history = memoryStore.getHistoriesForComplaint(complaint._id);

    return res.status(200).json({
      success: true,
      status: {
        referenceId: complaint.referenceId,
        title: complaint.isSensitive ? 'Protected Grievance Record' : complaint.title,
        category: complaint.category,
        institution: complaint.institution,
        currentStatus: complaint.currentStatus,
        priority: complaint.priority,
        assignedCell: complaint.assignedCell,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
        slaStatus,
        historyStages: history.map(h => ({
          stage: h.newStatus,
          action: h.action,
          timestamp: h.timestamp,
          explanation: h.userVisibleExplanation
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addAdditionalInformation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note content cannot be empty.'
      });
    }

    const complaint = memoryStore.findComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (!canAccessComplaint(req.user, complaint)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const newNote = {
      authorName: req.user.name,
      authorRole: req.user.role,
      note: note.trim(),
      createdAt: new Date()
    };

    complaint.additionalNotes.push(newNote);
    memoryStore.updateComplaint(complaint._id, { additionalNotes: complaint.additionalNotes });

    memoryStore.addHistory({
      complaintId: complaint._id,
      referenceId: complaint.referenceId,
      previousStatus: complaint.currentStatus,
      newStatus: complaint.currentStatus,
      action: 'Additional Information Appended',
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      userVisibleExplanation: `Complainant appended clarification: "${note.substring(0, 60)}..."`
    });

    return res.status(200).json({
      success: true,
      message: 'Additional information submitted successfully.',
      notes: complaint.additionalNotes
    });
  } catch (error) {
    next(error);
  }
};

export const uploadSupportingDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No document file received.'
      });
    }

    const complaint = memoryStore.findComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (!canAccessComplaint(req.user, complaint)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const doc = {
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date()
    };

    complaint.supportingDocuments.push(doc);
    memoryStore.updateComplaint(complaint._id, { supportingDocuments: complaint.supportingDocuments });

    memoryStore.addHistory({
      complaintId: complaint._id,
      referenceId: complaint.referenceId,
      previousStatus: complaint.currentStatus,
      newStatus: complaint.currentStatus,
      action: 'Supporting Document Uploaded',
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      userVisibleExplanation: `Document uploaded: ${req.file.originalname}`
    });

    return res.status(200).json({
      success: true,
      message: 'Document uploaded successfully.',
      document: doc
    });
  } catch (error) {
    next(error);
  }
};

export const requestReopen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A justified reason is required to request reopening a complaint.'
      });
    }

    const complaint = memoryStore.findComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (complaint.currentStatus !== COMPLAINT_STATUSES.RESOLVED && complaint.currentStatus !== COMPLAINT_STATUSES.CLOSED) {
      return res.status(400).json({
        success: false,
        message: 'Only Resolved or Closed complaints can be considered for reopening.'
      });
    }

    const reopenRecord = {
      reason: reason.trim(),
      requestedBy: req.user.name,
      requestedAt: new Date(),
      status: 'pending'
    };

    complaint.reopenRequests.push(reopenRecord);
    memoryStore.updateComplaint(complaint._id, {
      reopenRequests: complaint.reopenRequests,
      currentStatus: COMPLAINT_STATUSES.REOPENED
    });

    memoryStore.addHistory({
      complaintId: complaint._id,
      referenceId: complaint.referenceId,
      previousStatus: complaint.currentStatus,
      newStatus: COMPLAINT_STATUSES.REOPENED,
      action: 'Reopen Requested',
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      userVisibleExplanation: `Complainant requested case reopening: "${reason.trim()}"`
    });

    return res.status(200).json({
      success: true,
      message: 'Reopening request submitted for administrative review.',
      complaint
    });
  } catch (error) {
    next(error);
  }
};

export const checkDuplicates = async (req, res, next) => {
  try {
    const { title, description, category, institution } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required for duplicate analysis.'
      });
    }

    const matches = findPotentialDuplicates({
      title,
      description,
      category: category || 'Academic Issues',
      institution: institution || ''
    });

    return res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    next(error);
  }
};
