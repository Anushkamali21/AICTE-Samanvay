import memoryStore from '../services/memoryStore.js';
import { COMPLAINT_STATUSES, ROLES } from '../config/constants.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    let complaints = memoryStore.getAllComplaints();

    // Scope by role
    if (req.user.role === ROLES.STUDENT || req.user.role === ROLES.FACULTY || req.user.role === ROLES.STAFF) {
      complaints = complaints.filter(c => c.complainantId === req.user._id);
    } else if (req.user.role === ROLES.INSTITUTION_NODAL) {
      complaints = complaints.filter(c => 
        c.institution.toLowerCase().includes(req.user.institution.toLowerCase()) ||
        c.institutionId === req.user.institutionId
      );
    }

    const total = complaints.length;
    const underReview = complaints.filter(c => 
      c.currentStatus === COMPLAINT_STATUSES.UNDER_REVIEW ||
      c.currentStatus === COMPLAINT_STATUSES.ASSIGNED ||
      c.currentStatus === COMPLAINT_STATUSES.IN_PROGRESS
    ).length;
    const resolved = complaints.filter(c => 
      c.currentStatus === COMPLAINT_STATUSES.RESOLVED ||
      c.currentStatus === COMPLAINT_STATUSES.CLOSED
    ).length;
    const awaitingAction = complaints.filter(c => 
      c.currentStatus === COMPLAINT_STATUSES.SUBMITTED ||
      c.currentStatus === COMPLAINT_STATUSES.AWAITING_INSTITUTION_RESPONSE ||
      c.currentStatus === COMPLAINT_STATUSES.ESCALATED ||
      c.currentStatus === COMPLAINT_STATUSES.REOPENED
    ).length;

    // Status distribution
    const statusMap = {};
    Object.values(COMPLAINT_STATUSES).forEach(s => { statusMap[s] = 0; });
    complaints.forEach(c => {
      if (statusMap[c.currentStatus] !== undefined) {
        statusMap[c.currentStatus] += 1;
      }
    });

    const statusDistribution = Object.keys(statusMap)
      .map(name => ({ name, count: statusMap[name] }))
      .filter(item => item.count > 0);

    // Monthly trends (last 6 months)
    const monthNames = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const monthlyTrends = monthNames.map(m => ({
      month: m,
      registered: 0,
      resolved: 0
    }));

    complaints.forEach(c => {
      const date = new Date(c.createdAt);
      const mIndex = date.getMonth(); // 0-11
      // Map to demo months
      const bucket = monthlyTrends[mIndex % monthlyTrends.length];
      if (bucket) {
        bucket.registered += 1;
        if (c.currentStatus === COMPLAINT_STATUSES.RESOLVED || c.currentStatus === COMPLAINT_STATUSES.CLOSED) {
          bucket.resolved += 1;
        }
      }
    });

    // Recent complaints table (top 5)
    const recentComplaints = complaints.slice(0, 5).map(c => ({
      _id: c._id,
      referenceId: c.referenceId,
      title: c.title,
      category: c.category,
      institution: c.institution,
      currentStatus: c.currentStatus,
      priority: c.priority,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));

    return res.status(200).json({
      success: true,
      stats: {
        total,
        underReview,
        resolved,
        awaitingAction
      },
      statusDistribution,
      monthlyTrends,
      recentComplaints
    });
  } catch (error) {
    next(error);
  }
};

export const getInstitutionalStats = async (req, res, next) => {
  try {
    let complaints = memoryStore.getAllComplaints();

    if (req.user.role === ROLES.INSTITUTION_NODAL) {
      complaints = complaints.filter(c => 
        c.institution.toLowerCase().includes(req.user.institution.toLowerCase()) ||
        c.institutionId === req.user.institutionId
      );
    }

    const total = complaints.length;
    const open = complaints.filter(c => 
      c.currentStatus !== COMPLAINT_STATUSES.RESOLVED &&
      c.currentStatus !== COMPLAINT_STATUSES.CLOSED
    ).length;
    const underReview = complaints.filter(c => 
      c.currentStatus === COMPLAINT_STATUSES.UNDER_REVIEW ||
      c.currentStatus === COMPLAINT_STATUSES.ASSIGNED ||
      c.currentStatus === COMPLAINT_STATUSES.IN_PROGRESS
    ).length;
    const resolved = complaints.filter(c => 
      c.currentStatus === COMPLAINT_STATUSES.RESOLVED ||
      c.currentStatus === COMPLAINT_STATUSES.CLOSED
    ).length;
    const escalated = complaints.filter(c => c.currentStatus === COMPLAINT_STATUSES.ESCALATED).length;

    // Resolution rate calculation
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Average resolution time in days
    let totalDays = 0;
    let resolvedWithDatesCount = 0;
    complaints.forEach(c => {
      if ((c.currentStatus === COMPLAINT_STATUSES.RESOLVED || c.currentStatus === COMPLAINT_STATUSES.CLOSED) && c.resolvedAt) {
        const diffMs = new Date(c.resolvedAt) - new Date(c.createdAt);
        const days = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
        totalDays += days;
        resolvedWithDatesCount += 1;
      }
    });
    const averageResolutionDays = resolvedWithDatesCount > 0 ? Math.round((totalDays / resolvedWithDatesCount) * 10) / 10 : 8.5;

    // Category distribution
    const catMap = {};
    complaints.forEach(c => {
      catMap[c.category] = (catMap[c.category] || 0) + 1;
    });
    const categoryDistribution = Object.keys(catMap).map(category => ({
      name: category,
      count: catMap[category]
    })).sort((a, b) => b.count - a.count);

    // Department-wise distribution
    const deptMap = {};
    complaints.forEach(c => {
      const dept = c.department || 'General Administration';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    const departmentDistribution = Object.keys(deptMap).map(dept => ({
      name: dept,
      count: deptMap[dept]
    })).sort((a, b) => b.count - a.count);

    return res.status(200).json({
      success: true,
      metrics: {
        total,
        open,
        underReview,
        resolved,
        escalated,
        resolutionRate,
        averageResolutionDays
      },
      categoryDistribution,
      departmentDistribution
    });
  } catch (error) {
    next(error);
  }
};
