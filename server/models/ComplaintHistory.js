import mongoose from 'mongoose';
import { COMPLAINT_STATUSES } from '../config/constants.js';

const complaintHistorySchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
    index: true
  },
  referenceId: {
    type: String,
    required: true,
    index: true
  },
  previousStatus: {
    type: String,
    enum: [...Object.values(COMPLAINT_STATUSES), 'None']
  },
  newStatus: {
    type: String,
    enum: Object.values(COMPLAINT_STATUSES),
    required: true
  },
  action: {
    type: String,
    required: true
  },
  actorId: {
    type: String,
    required: true
  },
  actorName: {
    type: String,
    required: true
  },
  actorRole: {
    type: String,
    required: true
  },
  userVisibleExplanation: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const ComplaintHistory = mongoose.model('ComplaintHistory', complaintHistorySchema);
export default ComplaintHistory;
