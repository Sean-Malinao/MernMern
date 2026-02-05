import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/elections/available
router.get('/available', authMiddleware, (req, res) => {
  // Mocked available elections; replace with DB query later
  const elections = [
    {
      _id: 'election-barangay-2026',
      title: 'Barangay Election 2026',
      type: 'barangay',
      description: 'Open to all registered voters 18 years and above.'
    },
    {
      _id: 'election-sk-2026',
      title: 'Sangguniang Kabataan (SK) Election 2026',
      type: 'sk',
      description: 'Youth ballot for voters aged 15–30.'
    }
  ];

  res.json(elections);
});

export default router;
