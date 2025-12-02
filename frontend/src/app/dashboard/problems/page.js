"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import './problems.css';
import Modal from '@/components/common/Modal';
import FormField from '@/components/common/FormField';
import Badge from '@/components/common/Badge';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import '@/components/styles/common.css';

export default function ProblemsPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  
  // Filters and pagination
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [formData, setFormData] = useState({
    platform: 'leetcode',
    problemId: '',
    problemName: '',
    difficulty: 'medium',
    url: '',
    tags: '',
    notes: ''
  });

  useEffect(() => {
    fetchBookmarks();
  }, [search, platform, difficulty, sortBy, sortOrder, page]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const filters = {
        page,
        limit,
        sortBy,
        sortOrder
      };
      
      if (search.trim()) filters.search = search.trim();
      if (platform !== 'all') filters.platform = platform;
      if (difficulty !== 'all') filters.difficulty = difficulty;
      
      const response = await api.getBookmarks(filters);
      
      if (response.success) {
        setBookmarks(response.bookmarks || []);
        setTotalPages(response.pages || 1);
        setTotalCount(response.total || 0);
      }
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch bookmarks');
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAdd = () => {
    setEditingBookmark(null);
    setFormData({
      platform: '',
      problemId: '',
      problemName: '',
      difficulty: 'medium',
      url: '',
      tags: '',
      notes: ''
    });
    setShowModal(true);
  };

  const extractDetailsFromUrl = (url) => {
    try {
      // LeetCode pattern: https://leetcode.com/problems/two-sum/
      if (url.includes('leetcode.com')) {
        const match = url.match(/leetcode\.com\/problems\/([^\/]+)/);
        if (match) {
          const slug = match[1];
          const problemName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          return {
            platform: 'leetcode',
            problemId: slug,
            problemName: problemName
          };
        }
      }
      
      // Codeforces pattern: https://codeforces.com/problemset/problem/1234/A
      if (url.includes('codeforces.com')) {
        const match = url.match(/codeforces\.com\/(?:problemset\/)?problem\/(\d+)\/([A-Z]\d?)/);
        if (match) {
          const contestId = match[1];
          const problemCode = match[2];
          return {
            platform: 'codeforces',
            problemId: `${contestId}${problemCode}`,
            problemName: `Problem ${problemCode}`
          };
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleUrlChange = (url) => {
    setFormData({ ...formData, url });
    
    const details = extractDetailsFromUrl(url);
    if (details) {
      setFormData(prev => ({
        ...prev,
        url,
        platform: details.platform,
        problemId: details.problemId,
        problemName: details.problemName
      }));
    }
  };

  const handleEdit = (bookmark) => {
    setEditingBookmark(bookmark);
    setFormData({
      platform: bookmark.platform,
      problemId: bookmark.problemId,
      problemName: bookmark.problemName,
      difficulty: bookmark.difficulty,
      url: bookmark.url,
      tags: Array.isArray(bookmark.tags) ? bookmark.tags.join(', ') : '',
      notes: bookmark.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };
      
      if (editingBookmark) {
        // Update operation
        await api.updateBookmark(editingBookmark._id, {
          notes: data.notes,
          tags: data.tags
        });
        showNotification('Bookmark updated successfully!');
      } else {
        // Create operation
        await api.addBookmark(data);
        showNotification('Bookmark added successfully!');
        setPage(1);
      }
      
      setShowModal(false);
      fetchBookmarks();
    } catch (err) {
      setError(err.message || 'Failed to save bookmark');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return;
    
    try {
      await api.deleteBookmark(id);
      showNotification('Bookmark deleted successfully!');
      
      // If we're on a page that becomes empty, go to previous page
      if (bookmarks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchBookmarks();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete bookmark');
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const getDifficultyClass = (diff) => {
    const diffLower = diff?.toLowerCase() || 'unknown';
    return `difficulty-badge difficulty-${diffLower}`;
  };

  return (
    <DashboardLayout>
      <div className="problems-container">
        <header className="dashboardHeader">
          <h1 className="dashboardTitle">Your Pokédex</h1>
          <p className="dashboardSubtitle">Your Problem Collection</p>
        </header>

        <div className="row justify-end mb-4">
          <Button onClick={handleAdd}>+ Add Problem</Button>
        </div>

        {notification && (
          <div className="notification">{notification}</div>
        )}

        {error && (
          <div className="notice notice--error mb-4">{error}</div>
        )}

        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Problem name..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Platform</label>
              <select
                className="filter-select"
                value={platform}
                onChange={(e) => { setPlatform(e.target.value); setPage(1); }}
              >
                <option value="all">All Platforms</option>
                <option value="leetcode">LeetCode</option>
                <option value="codeforces">Codeforces</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Difficulty</label>
              <select
                className="filter-select"
                value={difficulty}
                onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Date Added</option>
                <option value="problemName">Problem Name</option>
                <option value="difficulty">Difficulty</option>
                <option value="platform">Platform</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Order</label>
              <select
                className="filter-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="results-info">
            Showing {bookmarks.length} of {totalCount} problems
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading problems...</div>
        ) : bookmarks.length === 0 ? (
          <div className="empty-state">
            No problems found. Add your first bookmark!
          </div>
        ) : (
          <>
            <Table headers={["Problem Name", "Platform", "Difficulty", "Tags", "Actions"]}>
              {bookmarks.map((bookmark) => (
                <tr key={bookmark._id}>
                  <td>{bookmark.problemName}</td>
                  <td>
                    <Badge variant="platform">{bookmark.platform}</Badge>
                  </td>
                  <td>
                    <Badge variant={`diff-${(bookmark.difficulty||'').toLowerCase()}`}>{bookmark.difficulty}</Badge>
                  </td>
                  <td>
                    {Array.isArray(bookmark.tags) && bookmark.tags.length > 0
                      ? bookmark.tags.join(', ')
                      : '-'}
                  </td>
                  <td>
                    <div className="row">
                      <Button variant="secondary" onClick={() => window.open(bookmark.url, '_blank')}>
                        View
                      </Button>
                      <Button variant="primary" onClick={() => handleEdit(bookmark)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(bookmark._id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>

            {totalPages > 1 && (
              <div className="pagination">
                <Button variant="secondary" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Previous
                </Button>
                <span className="pagination-info">
                  Page {page} of {totalPages}
                </span>
                <Button variant="secondary" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {showModal && (
          <Modal
            title={editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
            open={showModal}
            onClose={() => setShowModal(false)}
            footer={(
              <div className="form-buttons">
                <Button type="submit" onClick={handleSubmit}>
                  {editingBookmark ? 'Update' : 'Add'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            )}
          >
            <form className="modal-form" onSubmit={handleSubmit}>
              {!editingBookmark && (
                <>
                  <FormField label="Problem URL *" hint="Paste a LeetCode or Codeforces problem link">
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://leetcode.com/problems/two-sum/"
                      value={formData.url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      required
                    />
                  </FormField>

                  {formData.platform && (
                    <>
                      <FormField label="Platform">
                        <input
                          type="text"
                          className="form-input"
                          value={formData.platform}
                          disabled
                        />
                      </FormField>

                      <FormField label="Problem Name">
                        <input
                          type="text"
                          className="form-input"
                          value={formData.problemName}
                          onChange={(e) => setFormData({ ...formData, problemName: e.target.value })}
                        />
                      </FormField>

                      <FormField label="Difficulty">
                        <select
                          className="form-select"
                          value={formData.difficulty}
                          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </FormField>
                    </>
                  )}
                </>
              )}

              <FormField label="Tags (comma-separated)">
                <input
                  type="text"
                  className="form-input"
                  placeholder="array, dp, graphs"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </FormField>

              <FormField label="Notes">
                <textarea
                  className="form-textarea"
                  placeholder="Add your notes here..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </FormField>
            </form>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}
