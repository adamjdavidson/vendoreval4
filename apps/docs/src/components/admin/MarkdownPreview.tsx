import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * MarkdownPreview Component
 *
 * Renders Markdown to HTML in real-time with Docusaurus styling.
 * - Uses react-markdown for safe rendering
 * - Supports GitHub Flavored Markdown (tables, task lists, etc.)
 * - Respects Docusaurus styling conventions
 * - Debounced updates handled by parent (200ms)
 */

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  // Memoize the rendered markdown to avoid re-rendering on every keystroke
  const renderedContent = useMemo(() => {
    if (!content || content.trim() === '') {
      return (
        <div style={{ padding: '20px', color: '#9ca3af', fontStyle: 'italic' }}>
          No content to preview. Start typing to see the preview.
        </div>
      );
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom component renderers to match Docusaurus styling
          h1: ({ node, ...props }) => (
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginTop: '1.5rem',
                marginBottom: '1rem',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '0.5rem',
              }}
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginTop: '1.25rem',
                marginBottom: '0.75rem',
              }}
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginTop: '1rem',
                marginBottom: '0.5rem',
              }}
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              style={{
                marginTop: '0.5rem',
                marginBottom: '0.5rem',
                lineHeight: '1.75',
              }}
              {...props}
            />
          ),
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code
                style={{
                  background: '#f3f4f6',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                }}
                {...props}
              />
            ) : (
              <code
                style={{
                  display: 'block',
                  background: '#1f2937',
                  color: '#f9fafb',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem',
                }}
                {...props}
              />
            ),
          pre: ({ node, ...props }) => (
            <pre
              style={{
                background: '#1f2937',
                padding: '0',
                borderRadius: '6px',
                marginTop: '0.75rem',
                marginBottom: '0.75rem',
              }}
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              style={{
                borderLeft: '4px solid #3b82f6',
                paddingLeft: '16px',
                marginLeft: '0',
                marginTop: '0.75rem',
                marginBottom: '0.75rem',
                color: '#6b7280',
                fontStyle: 'italic',
              }}
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              style={{
                paddingLeft: '1.5rem',
                marginTop: '0.5rem',
                marginBottom: '0.5rem',
                listStyleType: 'disc',
              }}
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              style={{
                paddingLeft: '1.5rem',
                marginTop: '0.5rem',
                marginBottom: '0.5rem',
                listStyleType: 'decimal',
              }}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li
              style={{
                marginTop: '0.25rem',
                marginBottom: '0.25rem',
              }}
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              style={{
                color: '#2563eb',
                textDecoration: 'underline',
              }}
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '1rem',
                marginBottom: '1rem',
              }}
              {...props}
            />
          ),
          thead: ({ node, ...props }) => (
            <thead
              style={{
                background: '#f9fafb',
                borderBottom: '2px solid #e5e7eb',
              }}
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              style={{
                padding: '8px 12px',
                textAlign: 'left',
                fontWeight: '600',
                border: '1px solid #e5e7eb',
              }}
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              style={{
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
              }}
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr
              style={{
                border: 'none',
                borderTop: '1px solid #e5e7eb',
                marginTop: '1.5rem',
                marginBottom: '1.5rem',
              }}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }, [content]);

  return (
    <div
      className={`markdown-preview ${className}`}
      style={{
        padding: '20px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        background: 'white',
        minHeight: '200px',
        maxHeight: '600px',
        overflowY: 'auto',
      }}
    >
      {renderedContent}
    </div>
  );
}
