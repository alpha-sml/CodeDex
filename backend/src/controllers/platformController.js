import User from '../models/User.js';
import Platform from '../models/Platform.js';
import ProgressSnapshot from '../models/ProgressSnapshot.js';
import {
  fetchLeetCodeStats,
  fetchCodeforcesStats,
  normalizeStats,
  isCacheStale,
} from '../services/platformService.js';

// ADD OR UPDATE PLATFORM
export const addPlatform = async (req, res) => {
  try {
    const { platform, username } = req.body;

    if (!platform || !username) {
      return res.status(400).json({ message: 'Platform and username required' });
    }

    if (!['leetcode', 'codeforces'].includes(platform.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid platform' });
    }

    const userId = req.user._id;
    const platformLower = platform.toLowerCase();

    let stats;
    try {
      if (platformLower === 'leetcode') {
        stats = await fetchLeetCodeStats(username);
      } else if (platformLower === 'codeforces') {
        stats = await fetchCodeforcesStats(username);
      }
    } catch (error) {
      if (error.message.includes('NOT_FOUND')) {
        return res.status(404).json({ message: `User not found on ${platform}` });
      }
      return res.status(500).json({ message: `Failed to fetch ${platform} stats` });
    }

    await User.findByIdAndUpdate(userId, {
      [`platforms.${platformLower}`]: username,
      lastSyncedAt: new Date(),
    });

    const normalizedStats = normalizeStats(stats);
    
    await Platform.findOneAndUpdate(
      { userId, platform: platformLower },
      {
        username,
        stats: normalizedStats,
        lastFetched: new Date(),
        error: null,
      },
      { upsert: true, new: true }
    );

    await ProgressSnapshot.create({
      userId,
      platform: platformLower,
      stats: normalizedStats,
      date: new Date(),
    });

    res.status(200).json({
      message: `${platform} connected successfully`,
      stats: normalizedStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE PLATFORM
export const removePlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user._id;
    const platformLower = platform.toLowerCase();

    if (!['leetcode', 'codeforces'].includes(platformLower)) {
      return res.status(400).json({ message: 'Invalid platform' });
    }

    await User.findByIdAndUpdate(userId, {
      [`platforms.${platformLower}`]: null,
    });

    await Platform.findOneAndDelete({ userId, platform: platformLower });

    res.status(200).json({ message: `${platform} disconnected successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LIST PLATFORMS
export const listPlatforms = async (req, res) => {
  try {
    const userId = req.user._id;
    const platforms = await Platform.find({ userId });

    const result = platforms.map((p) => ({
      platform: p.platform,
      username: p.username,
      stats: p.stats,
      lastFetched: p.lastFetched,
      isStale: isCacheStale(p.lastFetched),
      error: p.error,
    }));

    res.status(200).json({ platforms: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SYNC PLATFORM
export const syncPlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user._id;
    const platformLower = platform.toLowerCase();

    if (!['leetcode', 'codeforces'].includes(platformLower)) {
      return res.status(400).json({ message: 'Invalid platform' });
    }

    const platformDoc = await Platform.findOne({ userId, platform: platformLower });

    if (!platformDoc) {
      return res.status(404).json({ message: 'Platform not connected' });
    }

    let stats;
    try {
      if (platformLower === 'leetcode') {
        stats = await fetchLeetCodeStats(platformDoc.username);
      } else if (platformLower === 'codeforces') {
        stats = await fetchCodeforcesStats(platformDoc.username);
      }
    } catch (error) {
      platformDoc.error = error.message;
      platformDoc.lastFetched = new Date();
      await platformDoc.save();
      return res.status(500).json({ message: `Failed to sync ${platform}` });
    }

    const normalizedStats = normalizeStats(stats);
    platformDoc.stats = normalizedStats;
    platformDoc.lastFetched = new Date();
    platformDoc.error = null;
    await platformDoc.save();

    await ProgressSnapshot.create({
      userId,
      platform: platformLower,
      stats: normalizedStats,
      date: new Date(),
    });

    res.status(200).json({
      message: `${platform} synced successfully`,
      stats: normalizedStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET AGGREGATED STATS
export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const platforms = await Platform.find({ userId });

    if (platforms.length === 0) {
      return res.status(200).json({ message: 'No platforms connected', stats: [] });
    }

    for (const platformDoc of platforms) {
      if (isCacheStale(platformDoc.lastFetched)) {
        try {
          let freshStats;
          if (platformDoc.platform === 'leetcode') {
            freshStats = await fetchLeetCodeStats(platformDoc.username);
          } else if (platformDoc.platform === 'codeforces') {
            freshStats = await fetchCodeforcesStats(platformDoc.username);
          }

          platformDoc.stats = normalizeStats(freshStats);
          platformDoc.lastFetched = new Date();
          platformDoc.error = null;
          await platformDoc.save();
        } catch (error) {
          platformDoc.error = error.message;
          await platformDoc.save();
        }
      }
    }

    let totalProblems = 0;
    let easy = 0;
    let medium = 0;
    let hard = 0;

    platforms.forEach((p) => {
      if (p.stats && p.stats.breakdown) {
        easy += p.stats.breakdown.easy || 0;
        medium += p.stats.breakdown.medium || 0;
        hard += p.stats.breakdown.hard || 0;
      }
      if (p.stats && p.stats.totalSolved !== undefined) {
        totalProblems += p.stats.totalSolved || 0;
      }
    });

    const aggregatedStats = {
      totalProblems,
      easy,
      medium,
      hard,
    };

    res.status(200).json({ stats: aggregatedStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROGRESS HISTORY
export const getProgressHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { platform, days = 30 } = req.query;

    const filter = { userId };
    if (platform && platform !== 'all') {
      filter.platform = platform.toLowerCase();
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));
    filter.date = { $gte: daysAgo };

    const snapshots = await ProgressSnapshot.find(filter)
      .sort({ date: 1 })
      .lean();

    const history = snapshots.map(snapshot => ({
      platform: snapshot.platform,
      date: snapshot.date,
      totalProblems: snapshot.stats.totalProblems || 0,
      easy: snapshot.stats.easy || 0,
      medium: snapshot.stats.medium || 0,
      hard: snapshot.stats.hard || 0,
      rating: snapshot.stats.rating,
    }));

    res.status(200).json({ 
      success: true,
      count: history.length,
      history 
    });
  } catch (error) {
    console.error('Get progress history error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch progress history' 
    });
  }
};
