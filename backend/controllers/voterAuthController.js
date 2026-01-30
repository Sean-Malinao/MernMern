// backend/controllers/voterAuthController.js
import Voter from '../models/Voter.js';
import jwt from 'jsonwebtoken';

export const voterLogin = async (req, res) => {
  try {
    const { voterId, secretPassword } = req.body;

    // ✅ Convert secretPassword to string (in case frontend sends a number)
    const secretPasswordStr = String(secretPassword).trim();

    // Validate voterId
    if (!/^\d{12}$/.test(voterId)) {
      return res.status(400).json({ message: 'Voter ID must be exactly 12 digits.' });
    }

    // Parse secretPasswordStr as DOB (YYYYMMDD or YYYY-MM-DD)
    let inputDob;
    if (/^\d{8}$/.test(secretPasswordStr)) {
      // Format: YYYYMMDD
      const year = parseInt(secretPasswordStr.substring(0, 4), 10);
      const month = parseInt(secretPasswordStr.substring(4, 6), 10) - 1; // JS months are 0-indexed
      const day = parseInt(secretPasswordStr.substring(6, 8), 10);
      inputDob = new Date(year, month, day);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(secretPasswordStr)) {
      // Format: YYYY-MM-DD
      inputDob = new Date(secretPasswordStr);
    } else {
      return res.status(400).json({ 
        message: 'Secret Password must be in YYYYMMDD or YYYY-MM-DD format (e.g., 20000101 or 2000-01-01)' 
      });
    }

    // Validate parsed date
    if (isNaN(inputDob.getTime())) {
      return res.status(400).json({ message: 'Invalid date of birth.' });
    }

    // Find voter by voterId
    const voter = await Voter.findOne({ voterId });
    if (!voter) {
      return res.status(400).json({ message: 'Invalid Voter ID or Secret Password.' });
    }

    // 🔐 Simple DOB comparison: DOB is now stored as YYYYMMDD string
    const inputDobKey = `${inputDob.getFullYear()}${String(inputDob.getMonth() + 1).padStart(2, '0')}${String(inputDob.getDate()).padStart(2, '0')}`;
    const storedDobKey = voter.dob; // Already in YYYYMMDD format

    // DEBUG LOG
    console.log('🔐 DOB COMPARISON:', {
      voterId,
      storedDobKey,
      inputDobKey,
      match: storedDobKey === inputDobKey
    });

    if (storedDobKey !== inputDobKey) {
      return res.status(400).json({ message: 'Invalid Voter ID or Secret Password.' });
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
        hasVoted: voter.hasVoted || false
      }
    });

  } catch (error) {
    console.error('💥 LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
};