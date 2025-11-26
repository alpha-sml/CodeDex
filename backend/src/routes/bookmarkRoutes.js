import express from 'express';
import { addBookmark, getBookmarks, updateBookmark, deleteBookmark } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addBookmark);
router.get('/', protect, getBookmarks);
router.put('/:id', protect, updateBookmark);
router.delete('/:id', protect, deleteBookmark);

export default router;
