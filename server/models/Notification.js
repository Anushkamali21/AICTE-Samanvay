import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  notificationType: {
    type: String,
    enum: [
      'COMPLAINT_REGISTERED',
      'COMPLAINT_ACKNOWLEDGED',
      'STATUS_CHANGED',
      'DOCUMENTS_REQUESTED',
      'INSTITUTION_RESPONSE',
      'COMPLAINT_ESCALATED',
      'RESOLUTION_ISSUED',
      'FEEDBACK_REQUESTED',
      'COMPLAINT_REOPENED'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  },
  referenceId: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
