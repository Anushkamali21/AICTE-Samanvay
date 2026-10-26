import { ROLES, SENSITIVE_CATEGORIES } from '../config/constants.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not possess the required permissions to perform this action.'
      });
    }
    next();
  };
};

// Resource authorization helper for complaints
export const canAccessComplaint = (user, complaint) => {
  if (!user || !complaint) return false;

  // AICTE Admin can access everything
  if (user.role === ROLES.AICTE_ADMIN) return true;

  // Institution Nodal Officer can access complaints targeting their institution
  if (user.role === ROLES.INSTITUTION_NODAL) {
    // If complaint is sensitive and belongs to someone else, check institutional restriction
    return complaint.institution.toLowerCase().includes(user.institution.toLowerCase()) ||
           complaint.institutionId === user.institutionId;
  }

  // Complainant can access their own complaint
  return complaint.complainantId === user._id || complaint.complainantEmail.toLowerCase() === user.email.toLowerCase();
};

// Check if user is authorized to view sensitive details
export const sanitizeComplaintForUser = (user, complaint) => {
  if (!complaint) return null;
  const isOwner = complaint.complainantId === user._id || complaint.complainantEmail.toLowerCase() === user.email.toLowerCase();
  const isAdmin = user.role === ROLES.AICTE_ADMIN;

  // If complaint is sensitive and user is not owner or central admin, mask complainant identity
  if (complaint.isSensitive && !isOwner && !isAdmin) {
    return {
      ...complaint,
      complainantName: 'Protected Complainant Identity',
      complainantEmail: '[CONFIDENTIAL]',
      complainantMobile: '[CONFIDENTIAL]'
    };
  }
  return complaint;
};
