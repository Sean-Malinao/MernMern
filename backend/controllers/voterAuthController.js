// backend/controllers/voterAuthController.js
import Voter from '../models/Voter.js';
import jwt from 'jsonwebtoken';

const getEligibility = (age) => {
  if (age >= 18) return 'barangay';
  if (age >= 15) return 'sk';
  return null;
};

export const voterSignup = async (req, res) => {
  const { email, dob } = req.body;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  const eligibility = getEligibility(age);
  if (!eligibility) {
    return res.status(400).json({ message: 'You must be at least 15 years old to vote.' });
  }

  const existing = await Voter.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered.' });

  const voter = new Voter({ email, dob: birthDate, age, eligibility });
  await voter.save();

  res.status(201).json({ message: 'Registration successful!', voter });
};

export const voterLogin = async (req, res) => {
  const { email, dob } = req.body;
  const inputDob = new Date(dob);

  const voter = await Voter.findOne({ email });
  if (!voter) return res.status(400).json({ message: 'Invalid email or date of birth.' });

  const storedDob = new Date(voter.dob);
  if (
    storedDob.getFullYear() !== inputDob.getFullYear() ||
    storedDob.getMonth() !== inputDob.getMonth() ||
    storedDob.getDate() !== inputDob.getDate()
  ) {
    return res.status(400).json({ message: 'Invalid email or date of birth.' });
  }

  const token = jwt.sign(
    { id: voter._id, role: 'voter' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token, voter: { id: voter._id, email: voter.email, eligibility: voter.eligibility } });
};