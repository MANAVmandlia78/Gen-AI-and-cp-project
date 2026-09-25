import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Auth.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, phone, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password
    });
    setIsSubmitting(false);

    if (result.success) {
      setSuccess('Account created successfully! Saving to database...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar />
      <div className="auth-bg-decor" />

      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: '520px' }}>
          <div className="auth-header">
            <div className="auth-badge">
              <i className="fa fa-user-plus" />
              <span>New Account Registration</span>
            </div>
            <h2 className="auth-title">Create an Account</h2>
            <p className="auth-subtitle">Join Maharaja Tours to book packages, track itineraries, and receive exclusive offers</p>
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
              <label className="form-label-custom">Full Name *</label>
              <div className="input-with-icon">
                <i className="fa fa-user icon-prefix" />
                <input
                  type="text"
                  name="name"
                  className="custom-auth-input"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Email Address *</label>
              <div className="input-with-icon">
                <i className="fa fa-envelope icon-prefix" />
                <input
                  type="email"
                  name="email"
                  className="custom-auth-input"
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Phone Number (Optional)</label>
              <div className="input-with-icon">
                <i className="fa fa-phone icon-prefix" />
                <input
                  type="tel"
                  name="phone"
                  className="custom-auth-input"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Password (Min 6 chars) *</label>
              <div className="input-with-icon">
                <i className="fa fa-lock icon-prefix" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="custom-auth-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="form-group-custom">
              <label className="form-label-custom">Confirm Password *</label>
              <div className="input-with-icon">
                <i className="fa fa-check-circle icon-prefix" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="custom-auth-input"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <i className="fa fa-check" />
                </>
              )}
            </button>
          </form>

          <div className="register-benefits">
            <div className="benefit-item">
              <span className="benefit-icon"><i className="fa fa-shield" /></span>
              <span className="benefit-text">Secure Data</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon"><i className="fa fa-bolt" /></span>
              <span className="benefit-text">Instant Booking</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon"><i className="fa fa-tag" /></span>
              <span className="benefit-text">Best Rates</span>
            </div>
          </div>

          <div className="auth-footer">
            <span>Already registered?</span>
            <Link to="/login" className="auth-switch-link">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
