// backend/controllers/voterAuthController.js
import Voter from '../models/Voter.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const voterLogin = async (req, res) => {
  try {
    const { voterId, password } = req.body;

    // Validate voterId
    if (!/^\d{12}$/.test(voterId)) {
      return res.status(400).json({ message: 'Voter ID must be exactly 12 digits.' });
    }

    // Validate password exists
    if (!password || password.trim().length === 0) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    // Find voter by voterId
    const voter = await Voter.findOne({ voterId });
    if (!voter) {
      return res.status(400).json({ message: 'Invalid Voter ID or password.' });
    }

    // 🔐 Compare password with hashed password stored in database
    const isPasswordValid = await bcrypt.compare(password, voter.password);

    // DEBUG LOG
    console.log('🔐 PASSWORD COMPARISON:', {
      voterId,
      isPasswordValid
    });

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid Voter ID or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: voter._id.toString(), role: 'voter' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return success response
    res.json({
      token,
      voter: {
        id: voter._id.toString(),
        voterId: voter.voterId,
        eligibility: voter.eligibility,
        hasVoted: voter.hasVoted || false,
        dob: voter.dob,
        age: voter.age,
        name: voter.name || ''
      }
    });

  } catch (error) {
    console.error('💥 LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
};