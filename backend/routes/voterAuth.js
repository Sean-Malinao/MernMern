import express from 'express';
import { voterSignup, voterLogin } from '../controllers/voterAuthController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // ✅ Must be imported

const router = express.Router();

router.post('/signup', voterSignup);
router.post('/login', voterLogin);

// ✅ This is the protected route
router.get('/me', authMiddleware, (req, res) => {
  res.json({ message: 'Hello, voter!', user: req.user });
});

export default router;