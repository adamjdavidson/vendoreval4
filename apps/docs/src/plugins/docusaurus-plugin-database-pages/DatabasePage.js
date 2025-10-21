/**
 * Database Page Component
 *
 * Renders a page from the database with dual-tone toggle (No BS vs Corporate).
 */

import React, { useState } from 'react';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function DatabasePage({ pageData }) {
  const [tone, setTone] = useState('no-bs'); // 'no-bs' or 'corporate'

  // Get title and content based on selected tone
  const title = tone === 'no-bs' ? pageData.title_no_bs : pageData.title_corporate;
  const content = tone === 'no-bs' ? pageData.content_no_bs : pageData.content_corporate;

  return (
    <Layout
      title={title}
      description={`${pageData.slug} - ${title}`}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Tone Toggle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '30px',
            gap: '10px',
          }}
        >
          <button
            onClick={() => setTone('no-bs')}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: tone === 'no-bs' ? '2px solid #2563eb' : '1px solid #d1d5db',
              background: tone === 'no-bs' ? '#eff6ff' : 'white',
              color: tone === 'no-bs' ? '#1e40af' : '#6b7280',
              fontSize: '14px',
              fontWeight: tone === 'no-bs' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            No BS Version
          </button>
          <button
            onClick={() => setTone('corporate')}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: tone === 'corporate' ? '2px solid #2563eb' : '1px solid #d1d5db',
              background: tone === 'corporate' ? '#eff6ff' : 'white',
              color: tone === 'corporate' ? '#1e40af' : '#6b7280',
              fontSize: '14px',
              fontWeight: tone === 'corporate' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Corporate Version
          </button>
        </div>

        {/* Page Title */}
        <h1
          style={{
            fontSize: '36px',
            fontWeight: '900',
            marginBottom: '20px',
            color: '#1f2937',
          }}
        >
          {title}
        </h1>

        {/* Page Content */}
        <div
          style={{
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#374151',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }} {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '25px', marginBottom: '12px' }} {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px', marginBottom: '10px' }} {...props} />
              ),
              p: ({ node, ...props }) => (
                <p style={{ marginBottom: '15px' }} {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul style={{ marginBottom: '15px', paddingLeft: '25px' }} {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol style={{ marginBottom: '15px', paddingLeft: '25px' }} {...props} />
              ),
              li: ({ node, ...props }) => (
                <li style={{ marginBottom: '8px' }} {...props} />
              ),
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code
                    style={{
                      background: '#f3f4f6',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                    }}
                    {...props}
                  />
                ) : (
                  <code
                    style={{
                      display: 'block',
                      background: '#f3f4f6',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      overflowX: 'auto',
                      marginBottom: '15px',
                    }}
                    {...props}
                  />
                ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  style={{
                    borderLeft: '4px solid #2563eb',
                    paddingLeft: '15px',
                    marginLeft: '0',
                    marginBottom: '15px',
                    color: '#6b7280',
                    fontStyle: 'italic',
                  }}
                  {...props}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Metadata Footer */}
        <div
          style={{
            marginTop: '50px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb',
            fontSize: '13px',
            color: '#9ca3af',
          }}
        >
          <p>
            Slug: <code>{pageData.slug}</code> | Last updated:{' '}
            {new Date(pageData.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Layout>
  );
}
