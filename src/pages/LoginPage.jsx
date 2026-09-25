import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine redirect URL from location query params
  const params = new URLSearchParams(location.search);
  const redirectPath = params.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess(`Login successful! Welcome back, ${result.user.name}`);
      setTimeout(() => {
        if (redirectPath) {
          navigate(redirectPath);
        } else if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 700);
    } else {
      setError(result.message || 'Invalid credentials. Please try again.');
    }
  };

  // Quick fill helper for testing
  const fillCredentials = (fillEmail, fillPass) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError('');
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar />
      <div className="auth-bg-decor" />

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-badge">
              <i className="fa fa-shield" />
              <span>Secure Access</span>
            </div>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to manage bookings, explore tours, or access the admin dashboard</p>
          </div>

          {/* Quick Demo Login Credentials */}
          <div className="quick-fill-section">
            <div className="quick-fill-label">
              <span><i className="fa fa-key" style={{ marginRight: '5px' }} /> Quick Demo Credentials</span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>1-Click Fill</span>
            </div>
            <div className="quick-fill-btns">
              <button
                type="button"
                className="quick-btn admin-pill"
                onClick={() => fillCredentials('admin@maharajatours.com', 'admin123')}
                title="Administrator Account"
              >
                <i className="fa fa-shield" /> Admin
              </button>
              <button
                type="button"
                className="quick-btn"
                onClick={() => fillCredentials('rahul.sharma@example.com', 'customer123')}
                title="Registered Customer Account"
              >
                <i className="fa fa-user" /> Customer
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-alert error">
              <i className="fa fa-exclamation-circle" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="auth-alert success">
              <i className="fa fa-check-circle" />
              <span>{success}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label className="form-label-custom">Email Address</label>
              <div className="input-with-icon">
                <i className="fa fa-envelope icon-prefix" />
                <input
                  type="email"
                  className="custom-auth-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-custom">
              <div className="form-label-custom">
                <span>Password</span>
              </div>
              <div className="input-with-icon">
                <i className="fa fa-lock icon-prefix" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="custom-auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fa fa-spinner fa-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <i className="fa fa-arrow-right" />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <span>Don't have an account?</span>
            <Link to="/register" className="auth-switch-link">
              Create Account
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
