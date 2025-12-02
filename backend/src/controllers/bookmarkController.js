import Bookmark from '../models/Bookmark.js';

export const addBookmark = async (req, res) => {
  try {
    const { platform, problemId, problemName, difficulty, url, tags, notes } = req.body;

    if (!platform || !problemId || !problemName || !url) {
      return res.status(400).json({
        success: false,
        message: 'Platform, problemId, problemName, and url are required',
      });
    }

    const existingBookmark = await Bookmark.findOne({
      userId: req.user._id,
      platform,
      problemId,
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: 'Problem already bookmarked',
      });
    }

    const bookmark = await Bookmark.create({
      userId: req.user._id,
      platform,
      problemId,
      problemName,
      difficulty: difficulty || 'unknown',
      url,
      tags: tags || [],
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      bookmark,
    });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add bookmark',
    });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const { 
      platform, 
      difficulty, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const filter = { userId: req.user._id };
    
    // Filter by platform
    if (platform && platform !== 'all') {
      filter.platform = platform.toLowerCase();
    }
    
    // Filter by difficulty
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty.toLowerCase();
    }

    // Search by problem name (case-insensitive)
    if (search && search.trim()) {
      filter.problemName = { $regex: search.trim(), $options: 'i' };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Determine sort order
    const sortOptions = {};
    const validSortFields = ['createdAt', 'difficulty', 'problemName', 'platform'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Get total count for pagination
    const totalCount = await Bookmark.countDocuments(filter);

    // Fetch bookmarks with pagination and sorting
    const bookmarks = await Bookmark.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      total: totalCount,
      page: pageNum,
      pages: Math.ceil(totalCount / limitNum),
      bookmarks,
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookmarks',
    });
  }
};

export const updateBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, tags } = req.body;

    const bookmark = await Bookmark.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found',
      });
    }

    if (notes !== undefined) bookmark.notes = notes;
    if (tags !== undefined) bookmark.tags = tags;

    await bookmark.save();

    res.status(200).json({
      success: true,
      bookmark,
    });
  } catch (error) {
    console.error('Update bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bookmark',
    });
  }
};

export const deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bookmark removed',
    });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bookmark',
    });
  }
};
