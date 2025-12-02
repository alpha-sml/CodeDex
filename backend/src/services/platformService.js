const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// LEETCODE
export const fetchLeetCodeStats = async (username) => {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
    });

    const data = await response.json();

    if (!data.data?.matchedUser) {
      throw new Error('LEETCODE_USER_NOT_FOUND');
    }

    const user = data.data.matchedUser;
    const stats = user.submitStats.acSubmissionNum;

    return {
      platform: 'leetcode',
      username: user.username,
      totalSolved: stats.find(s => s.difficulty === 'All')?.count || 0,
      easy: stats.find(s => s.difficulty === 'Easy')?.count || 0,
      medium: stats.find(s => s.difficulty === 'Medium')?.count || 0,
      hard: stats.find(s => s.difficulty === 'Hard')?.count || 0,
      ranking: user.profile.ranking,
      reputation: user.profile.reputation,
    };
  } catch (error) {
    if (error.message === 'LEETCODE_USER_NOT_FOUND') throw error;
    throw new Error('LEETCODE_API_ERROR');
  }
};

// CODEFORCES
export const fetchCodeforcesStats = async (username) => {
  try {
    // Fetch user info
    const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    const userData = await userResponse.json();

    if (userData.status !== 'OK') {
      throw new Error('CODEFORCES_USER_NOT_FOUND');
    }

    const user = userData.result[0];

    // Fetch user submissions to count solved problems
    let solvedCount = 0;
    try {
      const submissionsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
      const submissionsData = await submissionsResponse.json();
      
      if (submissionsData.status === 'OK') {
        const solvedProblems = new Set();
        submissionsData.result.forEach(submission => {
          if (submission.verdict === 'OK') {
            const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
            solvedProblems.add(problemId);
          }
        });
        solvedCount = solvedProblems.size;
      }
    } catch (submissionError) {
      console.log('Could not fetch Codeforces submissions:', submissionError);
      // Continue without submission count
    }

    return {
      platform: 'codeforces',
      username: user.handle,
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || 'unrated',
      maxRank: user.maxRank || 'unrated',
      contribution: user.contribution || 0,
      friendOfCount: user.friendOfCount || 0,
      totalSolved: solvedCount,
    };
  } catch (error) {
    if (error.message === 'CODEFORCES_USER_NOT_FOUND') throw error;
    throw new Error('CODEFORCES_API_ERROR');
  }
};

// NORMALIZE
export const normalizeStats = (rawStats) => {
  const { platform } = rawStats;

  if (platform === 'leetcode') {
    return {
      platform,
      username: rawStats.username,
      totalSolved: rawStats.totalSolved,
      rating: rawStats.ranking,
      breakdown: {
        easy: rawStats.easy,
        medium: rawStats.medium,
        hard: rawStats.hard,
      },
      extra: {
        reputation: rawStats.reputation,
      },
    };
  }

  if (platform === 'codeforces') {
    return {
      platform,
      username: rawStats.username,
      totalSolved: rawStats.totalSolved || 0,
      rating: rawStats.rating,
      maxRating: rawStats.maxRating,
      rank: rawStats.rank,
      maxRank: rawStats.maxRank,
      extra: {
        contribution: rawStats.contribution,
        friendOfCount: rawStats.friendOfCount,
      },
    };
  }

  return rawStats;
};

// CHECK CACHE
export const isCacheStale = (lastFetched) => {
  if (!lastFetched) return true;
  return Date.now() - new Date(lastFetched).getTime() > CACHE_TTL_MS;
};
