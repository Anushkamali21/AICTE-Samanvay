import { COMPLAINT_STATUSES, ROLES, COMPLAINT_CATEGORIES } from '../config/constants.js';

// Predefined Demo Users
export const initialUsers = [
  {
    _id: 'usr_student_01',
    name: 'Rahul Sharma',
    email: 'student@samanvay.demo',
    mobile: '9876543210',
    role: ROLES.STUDENT,
    institution: 'Delhi Technological University',
    institutionId: 'DTU-001',
    department: 'Computer Science and Engineering',
    accountStatus: 'active',
    createdAt: new Date('2026-01-15T10:00:00Z')
  },
  {
    _id: 'usr_faculty_01',
    name: 'Dr. Priya Nair',
    email: 'faculty@samanvay.demo',
    mobile: '9876543211',
    role: ROLES.FACULTY,
    institution: 'College of Engineering, Pune',
    institutionId: 'COEP-002',
    department: 'Mechanical Engineering',
    accountStatus: 'active',
    createdAt: new Date('2026-01-10T09:30:00Z')
  },
  {
    _id: 'usr_staff_01',
    name: 'Amit Kumar Verma',
    email: 'staff@samanvay.demo',
    mobile: '9876543212',
    role: ROLES.STAFF,
    institution: 'National Institute of Technology, Trichy',
    institutionId: 'NITT-003',
    department: 'Administration & Finance',
    accountStatus: 'active',
    createdAt: new Date('2026-01-20T11:15:00Z')
  },
  {
    _id: 'usr_nodal_01',
    name: 'Prof. Ramesh Chandra',
    email: 'nodal@samanvay.demo',
    mobile: '9876543213',
    role: ROLES.INSTITUTION_NODAL,
    institution: 'Delhi Technological University',
    institutionId: 'DTU-001',
    department: 'Grievance Redressal Cell',
    accountStatus: 'active',
    createdAt: new Date('2026-01-01T08:00:00Z')
  },
  {
    _id: 'usr_admin_01',
    name: 'Dr. Sunita Deshmukh',
    email: 'admin@samanvay.demo',
    mobile: '9876543214',
    role: ROLES.AICTE_ADMIN,
    institution: 'All India Council for Technical Education (HQ)',
    institutionId: 'AICTE-HQ',
    department: 'Central Grievance Bureau',
    accountStatus: 'active',
    createdAt: new Date('2026-01-01T08:00:00Z')
  }
];

// Initial complaints
export const initialComplaints = [
  {
    _id: 'cmp_001',
    referenceId: 'AICTE-2026-000101',
    complainantId: 'usr_student_01',
    complainantName: 'Rahul Sharma',
    complainantRole: ROLES.STUDENT,
    complainantEmail: 'student@samanvay.demo',
    complainantMobile: '9876543210',
    title: 'Discrepancy in Semester VI Grade Card and Marksheet Issuance',
    description: 'Final semester grade cards for batch 2022-2026 have an unexplained deduction in internal assessment marks without rubric publication. Despite repeated applications to the examination cell, no clarification has been provided.',
    category: 'Examination and Evaluation',
    isSensitive: false,
    targetType: 'Department',
    institution: 'Delhi Technological University',
    institutionId: 'DTU-001',
    department: 'Examination Branch',
    incidentDate: new Date('2026-02-10'),
    priority: 'High',
    expectedResolution: 'Verification of original internal award sheets and revised grade cards issued.',
    currentStatus: COMPLAINT_STATUSES.IN_PROGRESS,
    assignedTo: 'Prof. Ramesh Chandra (Nodal Officer)',
    assignedCell: 'Academic Redressal Cell',
    supportingDocuments: [
      {
        fileName: 'marksheet_copy_sem6.pdf',
        originalName: 'marksheet_copy_sem6.pdf',
        mimeType: 'application/pdf',
        size: 245000,
        url: '/uploads/sample_doc.pdf',
        uploadedAt: new Date('2026-02-12T14:30:00Z')
      }
    ],
    additionalNotes: [
      {
        authorName: 'Prof. Ramesh Chandra',
        authorRole: ROLES.INSTITUTION_NODAL,
        note: 'Original marksheets requested from the departmental assessment committee.',
        createdAt: new Date('2026-02-15T11:00:00Z')
      }
    ],
    reopenRequests: [],
    createdAt: new Date('2026-02-12T10:00:00Z'),
    updatedAt: new Date('2026-02-15T11:00:00Z')
  },
  {
    _id: 'cmp_002',
    referenceId: 'AICTE-2026-000102',
    complainantId: 'usr_student_01',
    complainantName: 'Rahul Sharma',
    complainantRole: ROLES.STUDENT,
    complainantEmail: 'student@samanvay.demo',
    complainantMobile: '9876543210',
    title: 'Arbitrary Increase in Hostel Maintenance Surcharge without Notice',
    description: 'Hostel committee notified an additional unapproved surcharge of Rs 12,000 per term without student representation or justification.',
    category: 'Hostel and Campus Facilities',
    isSensitive: false,
    targetType: 'Institution',
    institution: 'Delhi Technological University',
    institutionId: 'DTU-001',
    department: 'Hostel Affairs',
    incidentDate: new Date('2026-01-25'),
    priority: 'Normal',
    expectedResolution: 'Rollback of unauthorized surcharge and transparent audit of facility fees.',
    currentStatus: COMPLAINT_STATUSES.RESOLVED,
    assignedTo: 'Prof. Ramesh Chandra (Nodal Officer)',
    assignedCell: 'Student Welfare Cell',
    institutionResponse: {
      response: 'Institutional governing body reviewed the surcharge and agreed to waive 100% of the additional maintenance fee for the ongoing academic session.',
      respondedBy: 'Prof. Ramesh Chandra',
      respondedAt: new Date('2026-02-05T16:00:00Z')
    },
    resolutionSummary: {
      summary: 'Governing board order passed on 04 Feb 2026 rolling back the surcharge. Notice issued to accounts department.',
      resolvedBy: 'Dr. Sunita Deshmukh (AICTE Admin)',
      resolvedAt: new Date('2026-02-06T12:00:00Z')
    },
    resolvedAt: new Date('2026-02-06T12:00:00Z'),
    supportingDocuments: [],
    additionalNotes: [],
    reopenRequests: [],
    createdAt: new Date('2026-01-26T09:00:00Z'),
    updatedAt: new Date('2026-02-06T12:00:00Z')
  },
  {
    _id: 'cmp_003',
    referenceId: 'AICTE-2026-000103',
    complainantId: 'usr_faculty_01',
    complainantName: 'Dr. Priya Nair',
    complainantRole: ROLES.FACULTY,
    complainantEmail: 'faculty@samanvay.demo',
    complainantMobile: '9876543211',
    title: 'Non-Disbursement of AICTE Research Promotion Grant Installment',
    description: 'RPS research funding installment sanction letter issued 6 months prior, but institutional finance section has not released the approved capital equipment budget.',
    category: 'Administrative Issues',
    isSensitive: false,
    targetType: 'Department',
    institution: 'College of Engineering, Pune',
    institutionId: 'COEP-002',
    department: 'Finance & Accounts',
    incidentDate: new Date('2026-01-18'),
    priority: 'High',
    expectedResolution: 'Immediate transfer of sanctioned project grant into departmental research account.',
    currentStatus: COMPLAINT_STATUSES.UNDER_REVIEW,
    assignedTo: 'AICTE Bureau of Research',
    assignedCell: 'Research & Faculty Welfare Cell',
    supportingDocuments: [],
    additionalNotes: [],
    reopenRequests: [],
    createdAt: new Date('2026-02-01T15:20:00Z'),
    updatedAt: new Date('2026-02-03T10:00:00Z')
  },
  {
    _id: 'cmp_004',
    referenceId: 'AICTE-2026-000104',
    complainantId: 'usr_staff_01',
    complainantName: 'Amit Kumar Verma',
    complainantRole: ROLES.STAFF,
    complainantEmail: 'staff@samanvay.demo',
    complainantMobile: '9876543212',
    title: 'Irregularity in Overtime Allowance and Duty Register Discrepancies',
    description: 'Technical staff supporting weekend lab exams have not been credited with overtime allowances per standard AICTE seventh pay commission norms.',
    category: 'Non-Teaching Staff Issues',
    isSensitive: false,
    targetType: 'Institution',
    institution: 'National Institute of Technology, Trichy',
    institutionId: 'NITT-003',
    department: 'Establishment Section',
    incidentDate: new Date('2026-02-02'),
    priority: 'Normal',
    expectedResolution: 'Verification of biometric duty hours and disbursement of due allowances.',
    currentStatus: COMPLAINT_STATUSES.SUBMITTED,
    assignedTo: 'Unassigned',
    assignedCell: 'Establishment & Staff Grievance Cell',
    supportingDocuments: [],
    additionalNotes: [],
    reopenRequests: [],
    createdAt: new Date('2026-02-18T11:45:00Z'),
    updatedAt: new Date('2026-02-18T11:45:00Z')
  },
  {
    _id: 'cmp_005',
    referenceId: 'AICTE-2026-000105',
    complainantId: 'usr_student_01',
    complainantName: 'Rahul Sharma',
    complainantRole: ROLES.STUDENT,
    complainantEmail: 'student@samanvay.demo',
    complainantMobile: '9876543210',
    title: 'Non-Functional Lab Equipment in Advanced Computing Laboratory',
    description: 'Hardware GPU nodes in the AICTE-funded computing lab have been non-functional for 3 months, preventing final year project completions.',
    category: 'Infrastructure and Laboratory Facilities',
    isSensitive: false,
    targetType: 'Department',
    institution: 'Delhi Technological University',
    institutionId: 'DTU-001',
    department: 'Computer Science and Engineering',
    incidentDate: new Date('2026-02-08'),
    priority: 'Normal',
    expectedResolution: 'AMC service call dispatched and nodes restored.',
    currentStatus: COMPLAINT_STATUSES.ESCALATED,
    assignedTo: 'Prof. Ramesh Chandra (Nodal Officer)',
    assignedCell: 'Infrastructure Cell',
    escalatedAt: new Date('2026-02-16T14:00:00Z'),
    escalationReason: 'Institutional response exceeded 14-day SLA deadline without status report.',
    supportingDocuments: [],
    additionalNotes: [],
    reopenRequests: [],
    createdAt: new Date('2026-02-08T09:10:00Z'),
    updatedAt: new Date('2026-02-16T14:00:00Z')
  }
];

export const initialHistories = [
  {
    _id: 'hist_001',
    complaintId: 'cmp_001',
    referenceId: 'AICTE-2026-000101',
    previousStatus: 'None',
    newStatus: COMPLAINT_STATUSES.SUBMITTED,
    action: 'Complaint Registered',
    actorId: 'usr_student_01',
    actorName: 'Rahul Sharma',
    actorRole: ROLES.STUDENT,
    userVisibleExplanation: 'Complaint submitted by Rahul Sharma through the online portal.',
    timestamp: new Date('2026-02-12T10:00:00Z')
  },
  {
    _id: 'hist_002',
    complaintId: 'cmp_001',
    referenceId: 'AICTE-2026-000101',
    previousStatus: COMPLAINT_STATUSES.SUBMITTED,
    newStatus: COMPLAINT_STATUSES.ACKNOWLEDGED,
    action: 'Acknowledgment Dispatched',
    actorId: 'system',
    actorName: 'AICTE Automated Intake',
    actorRole: 'System',
    userVisibleExplanation: 'Complaint reference AICTE-2026-000101 generated and assigned to the intake queue.',
    timestamp: new Date('2026-02-12T10:05:00Z')
  },
  {
    _id: 'hist_003',
    complaintId: 'cmp_001',
    referenceId: 'AICTE-2026-000101',
    previousStatus: COMPLAINT_STATUSES.ACKNOWLEDGED,
    newStatus: COMPLAINT_STATUSES.UNDER_REVIEW,
    action: 'Review Initiated',
    actorId: 'usr_admin_01',
    actorName: 'Dr. Sunita Deshmukh',
    actorRole: ROLES.AICTE_ADMIN,
    userVisibleExplanation: 'Case examined by Central Grievance Bureau. Documents verified.',
    timestamp: new Date('2026-02-13T11:20:00Z')
  },
  {
    _id: 'hist_004',
    complaintId: 'cmp_001',
    referenceId: 'AICTE-2026-000101',
    previousStatus: COMPLAINT_STATUSES.UNDER_REVIEW,
    newStatus: COMPLAINT_STATUSES.ASSIGNED,
    action: 'Assigned to Institution Nodal Officer',
    actorId: 'usr_admin_01',
    actorName: 'Dr. Sunita Deshmukh',
    actorRole: ROLES.AICTE_ADMIN,
    userVisibleExplanation: 'Transferred to Delhi Technological University Nodal Officer for verification.',
    timestamp: new Date('2026-02-14T09:40:00Z')
  },
  {
    _id: 'hist_005',
    complaintId: 'cmp_001',
    referenceId: 'AICTE-2026-000101',
    previousStatus: COMPLAINT_STATUSES.ASSIGNED,
    newStatus: COMPLAINT_STATUSES.IN_PROGRESS,
    action: 'Internal Investigation Started',
    actorId: 'usr_nodal_01',
    actorName: 'Prof. Ramesh Chandra',
    actorRole: ROLES.INSTITUTION_NODAL,
    userVisibleExplanation: 'Examination Branch summoned to produce original assessment sheets.',
    timestamp: new Date('2026-02-15T11:00:00Z')
  },
  // Histories for cmp_002
  {
    _id: 'hist_006',
    complaintId: 'cmp_002',
    referenceId: 'AICTE-2026-000102',
    previousStatus: 'None',
    newStatus: COMPLAINT_STATUSES.SUBMITTED,
    action: 'Complaint Registered',
    actorId: 'usr_student_01',
    actorName: 'Rahul Sharma',
    actorRole: ROLES.STUDENT,
    userVisibleExplanation: 'Complaint submitted by Rahul Sharma regarding hostel fees.',
    timestamp: new Date('2026-01-26T09:00:00Z')
  },
  {
    _id: 'hist_007',
    complaintId: 'cmp_002',
    referenceId: 'AICTE-2026-000102',
    previousStatus: COMPLAINT_STATUSES.SUBMITTED,
    newStatus: COMPLAINT_STATUSES.IN_PROGRESS,
    action: 'Institutional Hearing',
    actorId: 'usr_nodal_01',
    actorName: 'Prof. Ramesh Chandra',
    actorRole: ROLES.INSTITUTION_NODAL,
    userVisibleExplanation: 'Governing board summoned meeting on hostel fee structures.',
    timestamp: new Date('2026-01-30T10:00:00Z')
  },
  {
    _id: 'hist_008',
    complaintId: 'cmp_002',
    referenceId: 'AICTE-2026-000102',
    previousStatus: COMPLAINT_STATUSES.IN_PROGRESS,
    newStatus: COMPLAINT_STATUSES.RESOLVED,
    action: 'Resolution Granted',
    actorId: 'usr_admin_01',
    actorName: 'Dr. Sunita Deshmukh',
    actorRole: ROLES.AICTE_ADMIN,
    userVisibleExplanation: 'Unauthorized surcharge rolled back in full by board directive.',
    timestamp: new Date('2026-02-06T12:00:00Z')
  }
];

export const initialFeedback = [
  {
    _id: 'fb_001',
    complaintId: 'cmp_002',
    referenceId: 'AICTE-2026-000102',
    complainantId: 'usr_student_01',
    rating: 5,
    effectiveness: 5,
    timeliness: 4,
    communication: 5,
    fairness: 5,
    resolvedAdequately: 'Yes',
    comments: 'Prompt response from the central bureau ensured the university rolled back the fee before deadline.',
    createdAt: new Date('2026-02-07T14:00:00Z')
  }
];

export const initialNotifications = [
  {
    _id: 'notif_001',
    userId: 'usr_student_01',
    notificationType: 'STATUS_CHANGED',
    title: 'Complaint Status Updated',
    message: 'Your complaint AICTE-2026-000101 is now In Progress with Delhi Technological University.',
    complaintId: 'cmp_001',
    referenceId: 'AICTE-2026-000101',
    isRead: false,
    createdAt: new Date('2026-02-15T11:00:00Z')
  },
  {
    _id: 'notif_002',
    userId: 'usr_student_01',
    notificationType: 'RESOLUTION_ISSUED',
    title: 'Complaint Resolved',
    message: 'Complaint AICTE-2026-000102 has been marked as Resolved. You may now submit satisfaction feedback.',
    complaintId: 'cmp_002',
    referenceId: 'AICTE-2026-000102',
    isRead: true,
    createdAt: new Date('2026-02-06T12:05:00Z')
  },
  {
    _id: 'notif_003',
    userId: 'usr_nodal_01',
    notificationType: 'STATUS_CHANGED',
    title: 'New Complaint Assigned',
    message: 'Complaint AICTE-2026-000101 has been assigned to your institution for verification.',
    complaintId: 'cmp_001',
    referenceId: 'AICTE-2026-000101',
    isRead: false,
    createdAt: new Date('2026-02-14T09:40:00Z')
  }
];

// Active in-memory store
class MemoryDataStore {
  constructor() {
    this.users = [...initialUsers];
    this.complaints = [...initialComplaints];
    this.histories = [...initialHistories];
    this.feedback = [...initialFeedback];
    this.notifications = [...initialNotifications];
    this.refCounter = 106;
  }

  generateReferenceId() {
    const year = new Date().getFullYear();
    const formatted = String(this.refCounter++).padStart(6, '0');
    return `AICTE-${year}-${formatted}`;
  }

  // Users
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  createUser(userData) {
    const newUser = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, updates) {
    const index = this.users.findIndex(u => u._id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates, updatedAt: new Date() };
    return this.users[index];
  }

  // Complaints
  getAllComplaints(filters = {}) {
    let result = [...this.complaints];
    if (filters.category) {
      result = result.filter(c => c.category === filters.category);
    }
    if (filters.status) {
      result = result.filter(c => c.currentStatus === filters.status);
    }
    if (filters.institution) {
      result = result.filter(c => c.institution.toLowerCase().includes(filters.institution.toLowerCase()));
    }
    if (filters.complainantId) {
      result = result.filter(c => c.complainantId === filters.complainantId);
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  findComplaintById(id) {
    return this.complaints.find(c => c._id === id || c.referenceId === id);
  }

  createComplaint(complaintData) {
    const refId = this.generateReferenceId();
    const newComplaint = {
      _id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      referenceId: refId,
      supportingDocuments: [],
      additionalNotes: [],
      reopenRequests: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...complaintData
    };
    this.complaints.unshift(newComplaint);

    // Automatically add initial history log
    this.addHistory({
      complaintId: newComplaint._id,
      referenceId: refId,
      previousStatus: 'None',
      newStatus: newComplaint.currentStatus,
      action: 'Complaint Registered',
      actorId: newComplaint.complainantId,
      actorName: newComplaint.complainantName,
      actorRole: newComplaint.complainantRole,
      userVisibleExplanation: `Complaint officially registered with reference ID ${refId}.`
    });

    return newComplaint;
  }

  updateComplaint(id, updates) {
    const index = this.complaints.findIndex(c => c._id === id || c.referenceId === id);
    if (index === -1) return null;
    this.complaints[index] = {
      ...this.complaints[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.complaints[index];
  }

  // History
  addHistory(historyData) {
    const newHistory = {
      _id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date(),
      ...historyData
    };
    this.histories.push(newHistory);
    return newHistory;
  }

  getHistoriesForComplaint(complaintId) {
    return this.histories
      .filter(h => h.complaintId === complaintId || h.referenceId === complaintId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // Feedback
  addFeedback(feedbackData) {
    const newFb = {
      _id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date(),
      ...feedbackData
    };
    this.feedback.push(newFb);
    return newFb;
  }

  getFeedbackForComplaint(complaintId) {
    return this.feedback.find(f => f.complaintId === complaintId || f.referenceId === complaintId);
  }

  getAllFeedback() {
    return [...this.feedback];
  }

  // Notifications
  addNotification(notifData) {
    const notif = {
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      isRead: false,
      createdAt: new Date(),
      ...notifData
    };
    this.notifications.unshift(notif);
    return notif;
  }

  getNotificationsForUser(userId) {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  markNotificationAsRead(id, userId) {
    const notif = this.notifications.find(n => n._id === id && n.userId === userId);
    if (notif) notif.isRead = true;
    return notif;
  }

  markAllNotificationsAsRead(userId) {
    this.notifications.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    return true;
  }
}

export const memoryStore = new MemoryDataStore();
export default memoryStore;
