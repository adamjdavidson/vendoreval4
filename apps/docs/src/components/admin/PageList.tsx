import React, { useState, useEffect } from 'react';
import { cmsService, type Page } from '../../services/cms';

/**
 * PageList Component
 *
 * Displays all CMS pages with management capabilities:
 * - List pages with title, slug, published status
 * - Search and filter functionality
 * - Create new page button
 * - Edit/Delete actions for each page
 */

interface PageListProps {
  onEditPage?: (page: Page) => void;
  onCreateNew?: () => void;
}

export function PageList({ onEditPage, onCreateNew }: PageListProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load pages on mount
  useEffect(() => {
    loadPages();
  }, []);

  // Filter pages when search or filter changes
  useEffect(() => {
    let filtered = pages;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (page) =>
          page.title_no_bs.toLowerCase().includes(query) ||
          page.slug.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter === 'published') {
      filtered = filtered.filter((page) => page.is_published);
    } else if (statusFilter === 'draft') {
      filtered = filtered.filter((page) => !page.is_published);
    }

    setFilteredPages(filtered);
  }, [pages, searchQuery, statusFilter]);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allPages = await cmsService.getAllPages();
      setPages(allPages);
      setFilteredPages(allPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (pageId: string) => {
    if (deleteConfirm !== pageId) {
      // First click - ask for confirmation
      setDeleteConfirm(pageId);
      setTimeout(() => setDeleteConfirm(null), 3000); // Reset after 3 seconds
      return;
    }

    // Second click - actually delete
    try {
      await cmsService.deletePage(pageId);
      setPages(pages.filter((p) => p.id !== pageId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete page');
    }
  };

  const handleTogglePublish = async (page: Page) => {
    try {
      const updated = await cmsService.togglePublishStatus(page.id, !page.is_published);
      setPages(pages.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update publish status');
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading pages...</p>
      </div>
    );
  }

  return (
    <div className="page-list" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>CMS Pages</h1>
          <button
            onClick={onCreateNew}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              background: '#2563eb',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            + Create New Page
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              background: '#fee',
              border: '1px solid #ef4444',
              borderRadius: '6px',
              color: '#991b1b',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Pages</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>

        {/* Results count */}
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Showing {filteredPages.length} of {pages.length} pages
        </p>
      </div>

      {/* Pages Table */}
      {filteredPages.length === 0 ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
          }}
        >
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '10px' }}>
            {pages.length === 0 ? 'No pages yet' : 'No pages match your filters'}
          </p>
          {pages.length === 0 && (
            <button
              onClick={onCreateNew}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #2563eb',
                background: 'white',
                color: '#2563eb',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Create your first page
            </button>
          )}
        </div>
      ) : (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                  Title (No BS)
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                  Slug
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                  Updated
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((page, index) => (
                <tr
                  key={page.id}
                  style={{
                    borderBottom: index < filteredPages.length - 1 ? '1px solid #f3f4f6' : 'none',
                  }}
                >
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                    <div style={{ fontWeight: '500' }}>{page.title_no_bs}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {page.title_corporate}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontFamily: 'monospace', color: '#6b7280' }}>
                    /{page.slug}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: page.is_published ? '#d1fae5' : '#fef3c7',
                        color: page.is_published ? '#065f46' : '#92400e',
                      }}
                    >
                      {page.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>
                    {new Date(page.updated_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => onEditPage?.(page)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: '1px solid #d1d5db',
                          background: 'white',
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleTogglePublish(page)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: '1px solid #d1d5db',
                          background: 'white',
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        {page.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: deleteConfirm === page.id ? '2px solid #ef4444' : '1px solid #fca5a5',
                          background: deleteConfirm === page.id ? '#fee' : 'white',
                          color: '#dc2626',
                          fontSize: '13px',
                          cursor: 'pointer',
                          fontWeight: deleteConfirm === page.id ? 'bold' : 'normal',
                        }}
                      >
                        {deleteConfirm === page.id ? 'Confirm?' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
