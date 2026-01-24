// backend/models/Voter.js
import mongoose from 'mongoose';

const voterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  dob: { type: Date, required: true },
  age: { type: Number, required: true, min: 15, max: 100 },
  eligibility: {
    type: String,
    enum: ['barangay', 'sk'],
    required: true
  },
  hasVoted: { type: Boolean, default: false },
  // Optional: AI verification fields
  aiVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Voter', voterSchema);