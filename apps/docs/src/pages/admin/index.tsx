import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

/**
 * Admin Dashboard - Main Overview
 *
 * Entry point for CMS administration with quick links to all management areas.
 */

export default function AdminDashboard() {
  return (
    <Layout title="Admin Dashboard" description="VendorEval CMS Administration">
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>
            Manage content, pages, and site settings
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ padding: '24px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Pages</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>-</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              Load stats from database
            </div>
          </div>

          <div style={{ padding: '24px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Published</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669' }}>-</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              Live on site
            </div>
          </div>

          <div style={{ padding: '24px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Drafts</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>-</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              Not yet published
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Pages Management */}
          <Link
            to="/admin/pages"
            style={{
              padding: '32px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>📄</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              Page Management
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
              Create, edit, and publish documentation pages with dual-tone content (No BS & Corporate)
            </p>
          </Link>

          {/* Settings */}
          <Link
            to="/admin/settings"
            style={{
              padding: '32px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>⚙️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              Site Settings
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
              Configure site-wide settings, branding, and global preferences
            </p>
          </Link>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '40px', padding: '24px', background: '#f9fafb', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/admin/pages"
              style={{
                padding: '10px 16px',
                background: '#2563eb',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              + Create New Page
            </Link>
            <Link
              to="/docs"
              style={{
                padding: '10px 16px',
                background: 'white',
                border: '1px solid #d1d5db',
                color: '#374151',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              View Public Site
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
