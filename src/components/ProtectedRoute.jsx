import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Preloader from './Preloader';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Preloader />;
  }

  // If page requires authentication and user is not logged in
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 60px' }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          background: '#fff',
          padding: '40px 32px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: '#fef2f2',
            color: '#f33f3f',
            fontSize: '22px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px'
          }}>
            <i className="fa fa-lock" />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '10px', color: '#0f172a' }}>
            {adminOnly ? 'Admin Sign In Required' : 'Authentication Required'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
            {adminOnly
              ? 'This section is reserved for the website administrator. Please sign in with your admin credentials to access the management portal.'
              : 'You need to be signed in to access this page.'}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
              className="btn-minimal-primary"
              style={{ padding: '10px 24px', textDecoration: 'none', display: 'inline-block' }}
            >
              Sign In Now
            </Link>
            <Link
              to="/"
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#f1f5f9',
                color: '#334155',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                display: 'inline-block'
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If page requires Admin role but logged in user is a regular customer
  if (adminOnly && !isAdmin) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 60px' }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          background: '#fff',
          padding: '40px 32px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          textAlign: 'center',
          border: '1px solid #fed7aa'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: '#fffbeb',
            color: '#d97706',
            fontSize: '22px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px'
          }}>
            <i className="fa fa-shield" />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '10px', color: '#0f172a' }}>
            Restricted Admin Area
          </h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
            Logged in as <strong>{user?.name}</strong> ({user?.email}) with role: <span style={{ textTransform: 'capitalize', color: '#f33f3f', fontWeight: '600' }}>{user?.role}</span>.
          </p>
          <p style={{ color: '#64748b', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '24px' }}>
            Only administrator accounts have permission to manage tour packages, bookings, and database records.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/"
              className="btn-minimal-primary"
              style={{ padding: '10px 22px', textDecoration: 'none', display: 'inline-block' }}
            >
              Return to Website
            </Link>
            <button
              onClick={logout}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #fee2e2',
                background: '#fef2f2',
                color: '#dc2626',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Switch Account / Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
