import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
    unique: true
  },
  referenceId: {
    type: String,
    required: true,
    index: true
  },
  complainantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  effectiveness: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  timeliness: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  communication: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  fairness: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  resolvedAdequately: {
    type: String,
    enum: ['Yes', 'Partially', 'No'],
    required: true
  },
  comments: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
