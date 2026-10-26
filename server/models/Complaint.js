import mongoose from 'mongoose';
import { COMPLAINT_STATUSES, COMPLAINT_CATEGORIES, PRIORITIES, TARGET_TYPES } from '../config/constants.js';

const documentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const additionalNoteSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  authorRole: { type: String, required: true },
  note: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const reopenRequestSchema = new mongoose.Schema({
  reason: { type: String, required: true },
  requestedBy: { type: String, required: true },
  requestedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewerNote: { type: String }
});

const complaintSchema = new mongoose.Schema({
  referenceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  complainantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  complainantName: { type: String, required: true },
  complainantRole: { type: String, required: true },
  complainantEmail: { type: String, required: true },
  complainantMobile: { type: String, required: true },
  
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: COMPLAINT_CATEGORIES,
    required: true,
    index: true
  },
  isSensitive: {
    type: Boolean,
    default: false
  },
  targetType: {
    type: String,
    enum: TARGET_TYPES,
    required: true
  },
  institution: {
    type: String,
    required: true,
    index: true
  },
  institutionId: {
    type: String,
    default: 'INST-001'
  },
  department: {
    type: String,
    trim: true
  },
  incidentDate: {
    type: Date
  },
  priority: {
    type: String,
    enum: PRIORITIES,
    default: 'Normal'
  },
  expectedResolution: {
    type: String,
    trim: true
  },
  currentStatus: {
    type: String,
    enum: Object.values(COMPLAINT_STATUSES),
    default: COMPLAINT_STATUSES.SUBMITTED,
    index: true
  },
  assignedTo: {
    type: String,
    default: 'Unassigned'
  },
  assignedCell: {
    type: String,
    default: 'General Grievance Cell'
  },
  institutionResponse: {
    response: { type: String },
    respondedBy: { type: String },
    respondedAt: { type: Date }
  },
  resolutionSummary: {
    summary: { type: String },
    resolvedBy: { type: String },
    resolvedAt: { type: Date }
  },
  escalatedAt: { type: Date },
  escalationReason: { type: String },
  resolvedAt: { type: Date },
  closedAt: { type: Date },
  
  supportingDocuments: [documentSchema],
  additionalNotes: [additionalNoteSchema],
  reopenRequests: [reopenRequestSchema]
}, {
  timestamps: true
});

export const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
