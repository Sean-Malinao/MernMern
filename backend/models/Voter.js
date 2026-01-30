// backend/models/Voter.js
import mongoose from 'mongoose';

const voterSchema = new mongoose.Schema({
  voterId: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{12}$/, 'Voter ID must be exactly 12 digits']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  dob: { 
    type: String, 
    required: true,
    match: [/^\d{8}$/, 'DOB must be in YYYYMMDD format']
  },
  age: { 
    type: Number, 
    required: true, 
    min: 15, 
    max: 100 
  },
  eligibility: {
    type: String,
    enum: ['barangay', 'sk'],
    required: true
  },
  hasVoted: { 
    type: Boolean, 
    default: false 
  },
  aiVerified: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export default mongoose.model('Voter', voterSchema);