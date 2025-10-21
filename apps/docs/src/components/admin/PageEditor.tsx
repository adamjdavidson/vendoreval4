import React, { useState, useEffect, useCallback } from 'react';
import { cmsService, type Page, type CreatePageInput, type UpdatePageInput } from '../../services/cms';
import { MarkdownPreview } from './MarkdownPreview';

/**
 * PageEditor Component
 *
 * Single Markdown editor with version toggle for editing CMS pages.
 * - Toggle between "No BS" and "Corporate" versions
 * - Live preview panel below editor
 * - Auto-generate corporate version button (when editing No BS)
 * - Auto-save functionality (500ms debounce)
 * - Save/Publish/Unpublish actions
 */

interface PageEditorProps {
  pageId?: string; // If editing existing page
  onSave?: (page: Page) => void;
  onCancel?: () => void;
}

type ToneVersion = 'no_bs' | 'corporate';

export function PageEditor({ pageId, onSave, onCancel }: PageEditorProps) {
  const [page, setPage] = useState<Page | null>(null);
  const [slug, setSlug] = useState('');
  const [titleNoBs, setTitleNoBs] = useState('');
  const [titleCorporate, setTitleCorporate] = useState('');
  const [contentNoBs, setContentNoBs] = useState('');
  const [contentCorporate, setContentCorporate] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const [activeVersion, setActiveVersion] = useState<ToneVersion>('no_bs');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Load existing page if editing
  useEffect(() => {
    if (pageId) {
      loadPage(pageId);
    }
  }, [pageId]);

  const loadPage = async (id: string) => {
    try {
      const pageData = await cmsService.getPageById(id);
      if (!pageData) {
        setError('Page not found');
        return;
      }

      // Populate form fields
      setPage(pageData);
      setSlug(pageData.slug);
      setTitleNoBs(pageData.title_no_bs);
      setTitleCorporate(pageData.title_corporate);
      setContentNoBs(pageData.content_no_bs);
      setContentCorporate(pageData.content_corporate);
      setIsPublished(pageData.is_published);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load page');
    }
  };

  // Auto-save with debounce (500ms)
  useEffect(() => {
    if (!pageId) return; // Only auto-save when editing existing page

    const timer = setTimeout(() => {
      handleAutoSave();
    }, 500);

    return () => clearTimeout(timer);
  }, [titleNoBs, titleCorporate, contentNoBs, contentCorporate, slug, isPublished]);

  const handleAutoSave = async () => {
    if (!pageId) return;

    try {
      setSaveStatus('saving');
      const updates: UpdatePageInput = {
        slug,
        title_no_bs: titleNoBs,
        title_corporate: titleCorporate,
        content_no_bs: contentNoBs,
        content_corporate: contentCorporate,
        is_published: isPublished,
      };
      const updated = await cmsService.updatePage(pageId, updates);
      setSaveStatus('saved');
      setPage(updated);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      setError(err instanceof Error ? err.message : 'Auto-save failed');
    }
  };

  const handleAutoGenerateCorporate = async () => {
    if (activeVersion !== 'no_bs') {
      setError('Auto-generate only available when editing No BS version');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Generate corporate title
      const corporateTitle = await cmsService.generateCorporateTone(titleNoBs);
      setTitleCorporate(corporateTitle);

      // Generate corporate content
      const corporateContent = await cmsService.generateCorporateTone(contentNoBs);
      setContentCorporate(corporateContent);

      // Switch to corporate version to review
      setActiveVersion('corporate');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate corporate version');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      let savedPage: Page;

      if (pageId) {
        // Update existing page
        const updates: UpdatePageInput = {
          slug,
          title_no_bs: titleNoBs,
          title_corporate: titleCorporate,
          content_no_bs: contentNoBs,
          content_corporate: contentCorporate,
          is_published: isPublished,
        };
        savedPage = await cmsService.updatePage(pageId, updates);
      } else {
        // Create new page
        const newPage: CreatePageInput = {
          slug,
          title_no_bs: titleNoBs,
          title_corporate: titleCorporate,
          content_no_bs: contentNoBs,
          content_corporate: contentCorporate,
          is_published: isPublished,
        };
        savedPage = await cmsService.createPage(newPage);
      }

      setPage(savedPage);
      onSave?.(savedPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublished(true);
    await handleSave();
  };

  const handleUnpublish = async () => {
    setIsPublished(false);
    await handleSave();
  };

  // Get current title and content based on active version
  const currentTitle = activeVersion === 'no_bs' ? titleNoBs : titleCorporate;
  const currentContent = activeVersion === 'no_bs' ? contentNoBs : contentCorporate;

  const setCurrentTitle = (value: string) => {
    if (activeVersion === 'no_bs') {
      setTitleNoBs(value);
    } else {
      setTitleCorporate(value);
    }
  };

  const setCurrentContent = (value: string) => {
    if (activeVersion === 'no_bs') {
      setContentNoBs(value);
    } else {
      setContentCorporate(value);
    }
  };

  return (
    <div className="page-editor" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
          {pageId ? 'Edit Page' : 'Create New Page'}
        </h1>
        {saveStatus === 'saved' && (
          <p style={{ color: 'green', fontSize: '14px' }}>✓ Auto-saved</p>
        )}
        {saveStatus === 'saving' && (
          <p style={{ color: 'gray', fontSize: '14px' }}>Saving...</p>
        )}
        {error && (
          <p style={{ color: 'red', fontSize: '14px', padding: '10px', background: '#fee', borderRadius: '4px' }}>
            {error}
          </p>
        )}
      </div>

      {/* Slug field (only for new pages or can edit for existing) */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
          Slug (URL path):
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g., help, about, faq"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
      </div>

      {/* Version Toggle */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={() => setActiveVersion('no_bs')}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: activeVersion === 'no_bs' ? '2px solid #2563eb' : '1px solid #ddd',
            background: activeVersion === 'no_bs' ? '#dbeafe' : 'white',
            fontWeight: activeVersion === 'no_bs' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          No BS
        </button>
        <button
          onClick={() => setActiveVersion('corporate')}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: activeVersion === 'corporate' ? '2px solid #2563eb' : '1px solid #ddd',
            background: activeVersion === 'corporate' ? '#dbeafe' : 'white',
            fontWeight: activeVersion === 'corporate' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Corporate
        </button>

        {/* Auto-generate button (only visible when editing No BS) */}
        {activeVersion === 'no_bs' && (
          <button
            onClick={handleAutoGenerateCorporate}
            disabled={isGenerating || !titleNoBs || !contentNoBs}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #10b981',
              background: '#d1fae5',
              color: '#065f46',
              fontWeight: 'bold',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              opacity: isGenerating || !titleNoBs || !contentNoBs ? 0.5 : 1,
              marginLeft: 'auto',
            }}
          >
            {isGenerating ? 'Generating...' : '✨ Auto-Generate Corporate'}
          </button>
        )}
      </div>

      {/* Title field */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
          Title ({activeVersion === 'no_bs' ? 'No BS' : 'Corporate'}):
        </label>
        <input
          type="text"
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          placeholder={`Enter ${activeVersion === 'no_bs' ? 'no-bs' : 'corporate'} title`}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
          }}
        />
      </div>

      {/* Markdown Editor */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
          Content ({activeVersion === 'no_bs' ? 'No BS' : 'Corporate'}) - Markdown:
        </label>
        <textarea
          value={currentContent}
          onChange={(e) => setCurrentContent(e.target.value)}
          placeholder={`Enter ${activeVersion === 'no_bs' ? 'no-bs' : 'corporate'} content in Markdown format`}
          style={{
            width: '100%',
            minHeight: '300px',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Live Preview */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          Preview ({activeVersion === 'no_bs' ? 'No BS' : 'Corporate'}):
        </h2>
        <MarkdownPreview content={currentContent} />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
        <button
          onClick={handleSave}
          disabled={isSaving || !slug || !titleNoBs || !contentNoBs}
          style={{
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            background: '#2563eb',
            color: 'white',
            fontWeight: 'bold',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving || !slug || !titleNoBs || !contentNoBs ? 0.5 : 1,
          }}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>

        <button
          onClick={handlePublish}
          disabled={isSaving || !slug || !titleNoBs || !contentNoBs}
          style={{
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            background: '#10b981',
            color: 'white',
            fontWeight: 'bold',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving || !slug || !titleNoBs || !contentNoBs ? 0.5 : 1,
          }}
        >
          {isPublished ? 'Update & Publish' : 'Publish'}
        </button>

        {isPublished && (
          <button
            onClick={handleUnpublish}
            disabled={isSaving}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: '1px solid #ef4444',
              background: 'white',
              color: '#ef4444',
              fontWeight: 'bold',
              cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            Unpublish
          </button>
        )}

        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              background: 'white',
              color: '#374151',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
