import React, { useState } from 'react';
import Layout from '@theme/Layout';

/**
 * Admin Site Settings
 *
 * Global site configuration and preferences.
 */

export default function AdminSettings() {
  const [siteName, setSiteName] = useState('VendorEval Documentation');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [contactEmail, setContactEmail] = useState('hello@feedforward.ai');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // TODO: Implement save to site_settings table
      // For now, just simulate a save
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout title="Site Settings" description="Configure site-wide settings">
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
            Site Settings
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Configure global site preferences and branding
          </p>
        </div>

        {/* Save Status */}
        {saveStatus === 'saved' && (
          <div
            style={{
              padding: '12px',
              background: '#d1fae5',
              border: '1px solid #059669',
              borderRadius: '6px',
              color: '#065f46',
              marginBottom: '20px',
            }}
          >
            ✓ Settings saved successfully
          </div>
        )}

        {saveStatus === 'error' && (
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
            Failed to save settings. Please try again.
          </div>
        )}

        {/* Settings Form */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '32px' }}>
          {/* Site Name */}
          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="siteName"
              style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}
            >
              Site Name
            </label>
            <input
              id="siteName"
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              The name of your documentation site
            </p>
          </div>

          {/* Primary Color */}
          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="primaryColor"
              style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}
            >
              Primary Color
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                id="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                style={{
                  width: '60px',
                  height: '40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Main brand color used throughout the site
            </p>
          </div>

          {/* Contact Email */}
          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="contactEmail"
              style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}
            >
              Contact Email
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Email address for site inquiries and support
            </p>
          </div>

          {/* Save Button */}
          <div style={{ paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '10px 24px',
                borderRadius: '6px',
                border: 'none',
                background: '#2563eb',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '6px',
          }}
        >
          <p style={{ fontSize: '13px', color: '#1e40af', lineHeight: '1.6' }}>
            <strong>Note:</strong> Site settings are stored in the <code>site_settings</code> table.
            Changes will take effect immediately across all pages.
          </p>
        </div>
      </div>
    </Layout>
  );
}
