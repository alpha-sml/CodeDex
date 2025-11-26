import { fetchAllContests } from '../services/contestService.js';

export const getUpcomingContests = async (req, res) => {
  try {
    const { platform } = req.query;
    
    let contests = await fetchAllContests();

    if (platform && platform !== 'all') {
      contests = contests.filter(c => c.platform === platform.toLowerCase());
    }

    res.status(200).json({
      success: true,
      count: contests.length,
      contests,
    });
  } catch (error) {
    console.error('Get contests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contests',
    });
  }
};
