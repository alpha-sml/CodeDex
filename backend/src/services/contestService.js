const CACHE_DURATION = 30 * 60 * 1000;

let contestCache = {
  data: null,
  lastFetched: null,
};

const isCacheStale = () => {
  if (!contestCache.lastFetched) return true;
  return Date.now() - contestCache.lastFetched > CACHE_DURATION;
};

const fetchCodeforcesContests = async () => {
  try {
    const response = await fetch('https://codeforces.com/api/contest.list');
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error('Codeforces API error');
    }

    const now = Date.now() / 1000;
    const upcomingContests = data.result
      .filter(contest => contest.phase === 'BEFORE' && contest.startTimeSeconds > now)
      .map(contest => ({
        platform: 'codeforces',
        id: contest.id.toString(),
        name: contest.name,
        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
        duration: contest.durationSeconds,
        url: `https://codeforces.com/contest/${contest.id}`,
      }))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 10);

    return upcomingContests;
  } catch (error) {
    console.error('Codeforces contests fetch error:', error);
    return [];
  }
};

const fetchLeetCodeContests = async () => {
  try {
    const query = `
      query {
        allContests {
          title
          titleSlug
          startTime
          duration
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    
    if (!data.data || !data.data.allContests) {
      throw new Error('LeetCode API error');
    }

    const now = Date.now() / 1000;
    const upcomingContests = data.data.allContests
      .filter(contest => contest.startTime > now)
      .map(contest => ({
        platform: 'leetcode',
        id: contest.titleSlug,
        name: contest.title,
        startTime: new Date(contest.startTime * 1000).toISOString(),
        duration: contest.duration,
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
      }))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 10);

    return upcomingContests;
  } catch (error) {
    console.error('LeetCode contests fetch error:', error);
    return [];
  }
};

const fetchAllContests = async () => {
  if (!isCacheStale()) {
    return contestCache.data;
  }

  try {
    const [codeforcesContests, leetcodeContests] = await Promise.all([
      fetchCodeforcesContests(),
      fetchLeetCodeContests(),
    ]);

    const allContests = [...codeforcesContests, ...leetcodeContests]
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    contestCache.data = allContests;
    contestCache.lastFetched = Date.now();

    return allContests;
  } catch (error) {
    console.error('Contest fetch error:', error);
    throw error;
  }
};

export { fetchAllContests };
