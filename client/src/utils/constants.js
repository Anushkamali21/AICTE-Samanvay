export const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  STAFF: 'staff',
  INSTITUTION_NODAL: 'institution_nodal',
  AICTE_ADMIN: 'aicte_admin'
};

export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.FACULTY]: 'Faculty / Teacher',
  [ROLES.STAFF]: 'Non-Teaching Staff',
  [ROLES.INSTITUTION_NODAL]: 'Institution Nodal Officer',
  [ROLES.AICTE_ADMIN]: 'AICTE Administrator'
};

export const COMPLAINT_STATUSES = {
  SUBMITTED: 'Submitted',
  ACKNOWLEDGED: 'Acknowledged',
  UNDER_REVIEW: 'Under Review',
  ASSIGNED: 'Assigned to Officer',
  AWAITING_INSTITUTION_RESPONSE: 'Awaiting Institution Response',
  IN_PROGRESS: 'In Progress',
  ESCALATED: 'Escalated',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REOPENED: 'Reopened'
};

export const STATUS_COLORS = {
  [COMPLAINT_STATUSES.SUBMITTED]: 'bg-slate-100 text-slate-800 border-slate-300',
  [COMPLAINT_STATUSES.ACKNOWLEDGED]: 'bg-blue-50 text-blue-800 border-blue-200',
  [COMPLAINT_STATUSES.UNDER_REVIEW]: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  [COMPLAINT_STATUSES.ASSIGNED]: 'bg-sky-50 text-sky-800 border-sky-200',
  [COMPLAINT_STATUSES.AWAITING_INSTITUTION_RESPONSE]: 'bg-amber-50 text-amber-800 border-amber-300',
  [COMPLAINT_STATUSES.IN_PROGRESS]: 'bg-cyan-50 text-cyan-800 border-cyan-300',
  [COMPLAINT_STATUSES.ESCALATED]: 'bg-red-50 text-red-800 border-red-300',
  [COMPLAINT_STATUSES.RESOLVED]: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  [COMPLAINT_STATUSES.CLOSED]: 'bg-slate-100 text-slate-600 border-slate-200',
  [COMPLAINT_STATUSES.REOPENED]: 'bg-orange-50 text-orange-800 border-orange-300'
};

export const COMPLAINT_CATEGORIES = [
  'Academic Issues',
  'Faculty-Related Issues',
  'Non-Teaching Staff Issues',
  'Examination and Evaluation',
  'Fee-Related Issues',
  'Scholarship Issues',
  'Infrastructure and Laboratory Facilities',
  'Hostel and Campus Facilities',
  'Harassment, Discrimination, or Misconduct',
  'Administrative Issues',
  'Institutional Management',
  'Admission and Documentation',
  'Safety and Student Welfare',
  'Other'
];

export const SENSITIVE_CATEGORIES = [
  'Harassment, Discrimination, or Misconduct',
  'Safety and Student Welfare'
];

export const PRIORITIES = ['Normal', 'High', 'Urgent'];

export const TARGET_TYPES = ['Institution', 'Department', 'Individual', 'Management'];
