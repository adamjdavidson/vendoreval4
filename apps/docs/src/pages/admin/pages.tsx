import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { PageList } from '../../components/admin/PageList';
import { PageEditor } from '../../components/admin/PageEditor';
import type { Page } from '../../services/cms';

/**
 * Admin Pages Management
 *
 * Manages all CMS pages - provides UI for listing and editing pages.
 */

type ViewMode = 'list' | 'edit' | 'create';

export default function AdminPages() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const handleEditPage = (page: Page) => {
    setSelectedPage(page);
    setViewMode('edit');
  };

  const handleCreateNew = () => {
    setSelectedPage(null);
    setViewMode('create');
  };

  const handleSave = (page: Page) => {
    // After save, return to list view
    setViewMode('list');
    setSelectedPage(null);
  };

  const handleCancel = () => {
    // Return to list view without saving
    setViewMode('list');
    setSelectedPage(null);
  };

  return (
    <Layout title="Page Management" description="Manage CMS pages">
      <div style={{ minHeight: '600px', paddingTop: '20px', paddingBottom: '40px' }}>
        {viewMode === 'list' && (
          <PageList onEditPage={handleEditPage} onCreateNew={handleCreateNew} />
        )}

        {viewMode === 'edit' && selectedPage && (
          <PageEditor
            pageId={selectedPage.id}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {viewMode === 'create' && (
          <PageEditor onSave={handleSave} onCancel={handleCancel} />
        )}
      </div>
    </Layout>
  );
}
