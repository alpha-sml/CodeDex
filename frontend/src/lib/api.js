const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

let isRefreshing = false;
let refreshPromise = null;

const refreshAccessToken = async () => {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      return response.json();
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};

const handleResponse = async (response, retryFn = null) => {
  if (response.status === 401 && retryFn) {
    try {
      await refreshAccessToken();
      return await retryFn();
    } catch (error) {
      throw new Error('Unauthorized');
    }
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    return data;
  } else {
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }
};

export const api = {
  async signup(data) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async login(data) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async getProfile() {
    const makeRequest = async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },

  async addPlatform(data) {
    const makeRequest = async () => {
      const response = await fetch(`${API_BASE_URL}/platforms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },

  async removePlatform(platform) {
    const makeRequest = async () => {
      const response = await fetch(`${API_BASE_URL}/platforms/${platform}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },

  async listPlatforms() {
    const makeRequest = async () => {
      const response = await fetch(`${API_BASE_URL}/platforms`, {
        method: 'GET',
        credentials: 'include',
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },

  async updatePlatform(platform, data) {
    const makeRequest = async () => {
      const response = await fetch(`${API_BASE_URL}/platforms/${platform}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },

  async syncPlatform(platform) {
    const makeRequest = async () => {
      const response = await fetch(`${API_BASE_URL}/platforms/${platform}/sync`, {
        method: 'POST',
        credentials: 'include',
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },

  async getStats() {
    const makeRequest = async () => {
      const response = await fetch(`${API_BASE_URL}/platforms/stats`, {
        method: 'GET',
        credentials: 'include',
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },

  async getContests(platform = 'all') {
    const makeRequest = async () => {
      const response = await fetch(`${API_BASE_URL}/contests?platform=${platform}`, {
        method: 'GET',
        credentials: 'include',
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },

  async getBookmarks(filters = {}) {
    const makeRequest = async () => {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/bookmarks?${params}`, {
        method: 'GET',
        credentials: 'include',
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },

  async addBookmark(data) {
    const makeRequest = async () => {
      const response = await fetch(`${API_BASE_URL}/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },

  async updateBookmark(id, data) {
    const makeRequest = async () => {
      const response = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },

  async deleteBookmark(id) {
    const makeRequest = async () => {
      const response = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },

  async getProgressHistory(params = {}) {
    const makeRequest = async () => {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${API_BASE_URL}/platforms/history?${queryParams}`, {
        method: 'GET',
        credentials: 'include',
      });
      return handleResponse(response, makeRequest);
    };
    return makeRequest();
  },
};

