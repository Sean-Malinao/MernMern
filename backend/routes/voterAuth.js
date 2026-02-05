// backend/routes/voterAuth.js
import express from 'express';
import { voterLogin } from '../controllers/voterAuthController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Voter from '../models/Voter.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Public routes
router.post('/login', voterLogin);

// Protected route
router.get('/me', authMiddleware, (req, res) => {
  res.json({ message: 'Hello, voter!', user: req.user });
});

// TEMPORARY: Add voter (for testing only)
router.post('/add-voter', async (req, res) => {
  const { voterId, dob, email, password } = req.body;

  if (!voterId || !dob || !password) {
    return res.status(400).json({ message: 'voterId, dob, and password are required' });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  
  // Check for at least one special character
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/~`]/;
  if (!specialCharRegex.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least 1 special character (!@#$%^&* etc.)' });
  }

  // Parse dob and convert to YYYYMMDD format
  let dobStr;
  if (/^\d{8}$/.test(dob)) {
    // Already in YYYYMMDD format
    dobStr = dob;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    // Convert YYYY-MM-DD to YYYYMMDD
    dobStr = dob.replace(/-/g, '');
  } else {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD or YYYYMMDD.' });
  }

  // Parse to validate and calculate age
  const year = parseInt(dobStr.substring(0, 4), 10);
  const month = parseInt(dobStr.substring(4, 6), 10) - 1;
  const day = parseInt(dobStr.substring(6, 8), 10);
  const birthDate = new Date(year, month, day);
  
  if (isNaN(birthDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date of birth.' });
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  const eligibility = age >= 18 ? 'barangay' : 'sk';

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const voter = new Voter({ voterId, dob: dobStr, age, eligibility, email, password: hashedPassword });
    await voter.save();
    res.status(201).json({ message: 'Voter added!', voter: { voterId, email, age, eligibility } });
  } catch (err) {
    if (err.code === 11000) {
      // Determine which field caused the duplicate error
      const field = Object.keys(err.keyPattern)[0];
      if (field === 'email') {
        return res.status(400).json({ message: 'This email is already taken' });
      } else if (field === 'voterId') {
        return res.status(400).json({ message: 'This Voter ID already exists' });
      }
      return res.status(400).json({ message: 'Voter ID or email already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;