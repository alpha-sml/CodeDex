import express from 'express';
import {
  addPlatform,
  removePlatform,
  listPlatforms,
  syncPlatform,
  getStats,
  getProgressHistory,
} from '../controllers/platformController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addPlatform);
router.delete('/:platform', protect, removePlatform);
router.get('/', protect, listPlatforms);
router.post('/:platform/sync', protect, syncPlatform);
router.get('/stats', protect, getStats);
router.get('/history', protect, getProgressHistory);

export default router;
