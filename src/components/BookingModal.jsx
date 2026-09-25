import { useState } from 'react';

/**
 * BookingModal - "Book Now" modal dialog
 * Props: isOpen (bool), onClose (fn)
 */
export default function BookingModal({ isOpen, onClose, packageId = null, packageTitle = '' }) {
  const [form, setForm] = useState({
    pickupLocation: '',
    returnLocation: '',
    pickupDateTime: '',
    returnDateTime: '',
    fullName: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          package_id: packageId,
          notes: packageTitle ? `Booking for package: ${packageTitle}` : ''
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit booking');
      }

      setSubmitted(true);
      setForm({
        pickupLocation: '',
        returnLocation: '',
        pickupDateTime: '',
        returnDateTime: '',
        fullName: '',
        email: '',
        phone: '',
      });

      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.message || 'Error submitting booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="bookingModalLabel"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="bookingModalLabel">Book Now</h5>
            <button type="button" className="close" aria-label="Close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="contact-form">
              {submitted && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa fa-check-circle" /> Booking request submitted successfully! An email confirmation has been sent to our team.
                </div>
              )}
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa fa-exclamation-circle" /> {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <fieldset>
                      <input
                        type="text"
                        className="form-control"
                        name="pickupLocation"
                        placeholder="Pick-up location"
                        value={form.pickupLocation}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-md-6">
                    <fieldset>
                      <input
                        type="text"
                        className="form-control"
                        name="returnLocation"
                        placeholder="Return location"
                        value={form.returnLocation}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <fieldset>
                      <input
                        type="text"
                        className="form-control"
                        name="pickupDateTime"
                        placeholder="Pick-up date/time"
                        value={form.pickupDateTime}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-md-6">
                    <fieldset>
                      <input
                        type="text"
                        className="form-control"
                        name="returnDateTime"
                        placeholder="Return date/time"
                        value={form.returnDateTime}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                </div>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
                <div className="row">
                  <div className="col-md-6">
                    <fieldset>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Enter email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-md-6">
                    <fieldset>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        placeholder="Enter phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: 'none', padding: '16px 0 0 0' }}>
                  <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Book Now'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
