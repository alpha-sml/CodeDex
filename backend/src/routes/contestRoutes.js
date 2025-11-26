import express from 'express';
import { getUpcomingContests } from '../controllers/contestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUpcomingContests);

export default router;
