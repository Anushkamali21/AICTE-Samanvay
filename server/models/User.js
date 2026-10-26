import mongoose from 'mongoose';
import { ROLES } from '../config/constants.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    required: true
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  institutionId: {
    type: String,
    default: 'INST-001'
  },
  department: {
    type: String,
    trim: true
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'pending'],
    default: 'active'
  }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
export default User;
