import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import './ContactPage.css';

const destinationTiles = [
  { id: 'kerala', name: 'Kerala Backwaters', tag: 'South India', image: '/assets/images/kerala.jpg' },
  { id: 'rajasthan', name: 'Royal Rajasthan', tag: 'Heritage & Forts', image: '/assets/images/jaipur.jpg' },
  { id: 'kashmir', name: 'Kashmir Valley', tag: 'Mountains & Lakes', image: '/assets/images/kashmir.jpg' },
  { id: 'goa', name: 'Goa Coastal', tag: 'Beaches & Leisure', image: '/assets/images/goa-1.jpg' },
];

export default function ContactPage() {
  const [selectedDest, setSelectedDest] = useState('Kerala');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    travelDate: '',
    destination: 'Kerala',
    subject: 'Tour Package Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleDestSelect = (destName) => {
    setSelectedDest(destName);
    setForm(prev => ({
      ...prev,
      destination: destName,
      subject: `Inquiry for ${destName} Tour Package`
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contact message');
      }

      setSubmitted(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        travelDate: '',
        destination: 'Kerala',
        subject: 'Tour Package Inquiry',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      setError(err.message || 'Error submitting message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Preloader />
      <Navbar />

      {/* ── HERO BANNER ── */}
      <section
        className="contact-hero-minimal"
        style={{ backgroundImage: "url('/assets/images/kashmir-2.jpg')" }}
      >
        <div className="contact-hero-minimal__overlay" />
        <div className="container">
          <div className="contact-hero-minimal__content">
            <div className="contact-hero-badge">
              <i className="fa fa-compass" style={{ color: '#fca5a5' }} />
              <span>Let's Plan Your Next Getaway</span>
            </div>
            <div className="contact-hero-minimal__breadcrumbs">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>Contact Us</span>
            </div>
            <h1 className="contact-hero-minimal__title">Get in Touch with Us</h1>
            <p className="contact-hero-minimal__sub">
              Have questions regarding our holiday packages, custom itineraries, or private transport? Our travel specialists in Junagadh are ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="contact-minimal-wrapper">
        <div className="container">

          {/* 1. TOP 3 KEY INFORMATION CARDS */}
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-info-card__icon">
                <i className="fa fa-phone" />
              </div>
              <div className="contact-info-card__body">
                <h4>Direct Phone &amp; WhatsApp</h4>
                <p><a href="tel:+919157355055">+91 91573 55055</a></p>
                <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-card__icon">
                <i className="fa fa-envelope-o" />
              </div>
              <div className="contact-info-card__body">
                <h4>Email Consultation</h4>
                <p><a href="mailto:info@maharajatours.com">info@maharajatours.com</a></p>
                <span>Average response within 2 hours</span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-card__icon">
                <i className="fa fa-map-marker" />
              </div>
              <div className="contact-info-card__body">
                <h4>Headquarters &amp; Lounge</h4>
                <p>Talav Gate, Zanzarda Road</p>
                <span>Junagadh, Gujarat 362001, India</span>
              </div>
            </div>
          </div>

          {/* 2. VISUAL DESTINATION TILES STRIP */}
          <div className="contact-destinations-strip">
            <div className="destinations-strip-header">
              <div>
                <h3>Select Your Preferred Destination</h3>
                <p>Click on any region below to automatically attach it to your message inquiry.</p>
              </div>
            </div>

            <div className="destinations-grid-4">
              {destinationTiles.map((dest) => {
                const isSelected = selectedDest.toLowerCase().includes(dest.id);
                return (
                  <div
                    key={dest.id}
                    className={`destination-card-tile ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDestSelect(dest.name)}
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      loading="lazy"
                      onError={(e) => { e.target.src = '/assets/images/kerala.jpg'; }}
                    />
                    <div className="destination-card-overlay">
                      <span className="tag">{dest.tag}</span>
                      <h5>{dest.name}</h5>
                      <span className="click-hint">
                        {isSelected ? '✓ Selected' : '+ Click to choose'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. FORM + OFFICE DETAILS & MAP SPLIT */}
          <div className="contact-content-grid">

            {/* Left: Contact Form Panel */}
            <div className="contact-form-panel">
              <h2 className="contact-form-panel__title">Send Us a Message</h2>
              <p className="contact-form-panel__desc">
                Tell us about your upcoming travel plans, destination preferences, or any specific requirements.
              </p>

              {/* Quick Destination Chips */}
              <div className="form-quick-chips">
                <span className="form-quick-chips-label">Destination of Interest:</span>
                <div className="chips-row">
                  {['Kerala', 'Rajasthan', 'Kashmir', 'Goa', 'Himachal', 'Custom Route'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`chip-btn ${selectedDest.toLowerCase().includes(item.toLowerCase()) ? 'active' : ''}`}
                      onClick={() => handleDestSelect(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {submitted && (
                <div className="form-alert-success" role="alert">
                  <i className="fa fa-check-circle" style={{ fontSize: '20px', color: '#16a34a' }} />
                  <div>
                    <strong>Message received successfully!</strong>
                    <div style={{ fontSize: '13px', marginTop: '2px', color: '#15803d' }}>
                      Thank you for contacting Maharaja Tours. A dedicated trip coordinator will review your request and reach out shortly.
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }} role="alert">
                  <i className="fa fa-exclamation-circle" style={{ fontSize: '18px' }} />
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row-two">
                  <div className="form-group-minimal">
                    <label htmlFor="contact-name">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      className="form-control-minimal"
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group-minimal">
                    <label htmlFor="contact-email">
                      Email Address <span className="req">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className="form-control-minimal"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-two">
                  <div className="form-group-minimal">
                    <label htmlFor="contact-phone">Phone Number (Optional)</label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      className="form-control-minimal"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group-minimal">
                    <label htmlFor="contact-travelDate">Approximate Travel Month / Date</label>
                    <input
                      id="contact-travelDate"
                      name="travelDate"
                      type="text"
                      className="form-control-minimal"
                      placeholder="e.g. October 2026 / 15th Nov"
                      value={form.travelDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group-minimal">
                  <label htmlFor="contact-subject">
                    Subject <span className="req">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    className="form-control-minimal"
                    placeholder="Inquiry subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group-minimal">
                  <label htmlFor="contact-message">
                    Your Travel Requirements / Message <span className="req">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="4"
                    className="form-control-minimal"
                    placeholder="Number of travelers, hotel preferences (3-star / 5-star), custom itinerary details..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="form-btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fa fa-spinner fa-spin" />
                      <span>Sending Your Request...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-paper-plane" />
                      <span>Send Inquiry Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Office Information & Map Card */}
            <aside className="contact-sidebar-panel">
              <div className="office-card-minimal">
                <div className="office-banner-image">
                  <img
                    src="/assets/images/jaipur-2.jpg"
                    alt="Maharaja Tours Junagadh Office"
                    loading="lazy"
                  />
                  <div className="office-status-pill">
                    <span className="office-status-dot" />
                    <span>Open Today: 9:00 AM – 7:00 PM</span>
                  </div>
                </div>

                <div className="office-details-body">
                  <h4>Maharaja Tours &amp; Travels</h4>
                  <p className="office-address-text">
                    Talav Gate, Zanzarda Road, Junagadh, Gujarat 362001, India.
                  </p>

                  <ul className="office-hours-list">
                    <li>
                      <span>Monday – Friday</span>
                      <strong>9:00 AM – 7:00 PM</strong>
                    </li>
                    <li>
                      <span>Saturday</span>
                      <strong>9:00 AM – 5:00 PM</strong>
                    </li>
                    <li>
                      <span>Sunday</span>
                      <strong>Closed (Emergency Support Active)</strong>
                    </li>
                  </ul>

                  <div className="action-buttons-stack">
                    <a
                      href="https://wa.me/919157355055?text=Hello%20Maharaja%20Tours,%20I%20would%20like%20to%20inquire%20about%20a%20holiday%20package."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp-direct"
                    >
                      <i className="fa fa-whatsapp" style={{ fontSize: '18px' }} />
                      <span>Chat with Travel Desk on WhatsApp</span>
                    </a>

                    <a
                      href="https://maps.google.com/?q=Maharaja+Tours+and+Travels+Junagadh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-directions-link"
                    >
                      <i className="fa fa-map-signs" />
                      <span>Get Directions on Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="map-container-minimal">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3711.703828903194!2d70.45638137505829!3d21.519317780255594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3958018d9047bc33%3A0xc4fb5ffa0257b027!2sMaharaja%20Tours%20%26%20Travels!5e0!3m2!1sen!2sin!4v1788802580691!5m2!1sen!2sin"
                  title="Maharaja Tours & Travels Location"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </aside>

          </div>

          {/* 4. HELPFUL TRAVEL PLANNING FAQ STRIP */}
          <div className="contact-faq-section">
            <div className="contact-faq-header">
              <h3>Planning Your Vacation With Us</h3>
              <p>Common questions answered by our travel planning team.</p>
            </div>

            <div className="faq-grid-3">
              <div className="faq-card-item">
                <h5>
                  <i className="fa fa-clock-o" />
                  <span>Prompt Quotations</span>
                </h5>
                <p>
                  Receive detailed cost breakdowns, day-wise itineraries, and hotel options within 2 to 4 business hours.
                </p>
              </div>

              <div className="faq-card-item">
                <h5>
                  <i className="fa fa-sliders" />
                  <span>100% Customizable</span>
                </h5>
                <p>
                  Every package can be adjusted for your group size, budget tier, preferred flight/train timings, and dietary needs.
                </p>
              </div>

              <div className="faq-card-item">
                <h5>
                  <i className="fa fa-shield" />
                  <span>24/7 On-Trip Assistance</span>
                </h5>
                <p>
                  A dedicated coordinator assists you from initial departure until you return safely home.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
