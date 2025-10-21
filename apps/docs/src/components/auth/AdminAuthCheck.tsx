import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * AdminAuthCheck Component
 *
 * Wraps admin pages to ensure only authenticated admins can access.
 * For development: Currently allows access (auth not fully implemented)
 * For production: Will check admin_users table
 */

interface AdminAuthCheckProps {
  children: React.ReactNode;
}

export function AdminAuthCheck({ children }: AdminAuthCheckProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      // Get current user session
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        // No user logged in
        // For development: Allow access anyway (auth not fully implemented)
        // For production: Redirect to login
        console.warn('No user logged in - allowing access for development');
        setIsAdmin(true); // TEMPORARY: Allow access in development
        setIsChecking(false);
        return;
      }

      // Check if user is in admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id, revoked_at')
        .eq('user_id', user.id)
        .is('revoked_at', null)
        .single();

      if (adminError || !adminData) {
        // User exists but is not an admin
        setIsAdmin(false);
        setError('Access denied. You must be an admin to access this area.');
        setIsChecking(false);
        return;
      }

      // User is a valid admin
      setIsAdmin(true);
      setIsChecking(false);
    } catch (err) {
      console.error('Admin auth check error:', err);
      // For development: Allow access on error
      setIsAdmin(true); // TEMPORARY: Allow access in development
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Checking admin access...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAdmin && error) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '80px auto',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '24px'
        }}>
          🔒
        </div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#111827'
        }}>
          Admin Access Required
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          {error}
        </p>
        <div style={{
          padding: '16px',
          background: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#92400e'
        }}>
          <strong>Development Note:</strong> Admin authentication is currently in development.
          For now, access is allowed for local testing. In production, you'll need to be added
          to the admin_users table.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
