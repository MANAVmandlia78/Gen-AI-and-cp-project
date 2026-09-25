import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import PageHeading from '../components/PageHeading';
import BookingModal from '../components/BookingModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/* ─── Fallback Data Keyed by ID ─── */
const fallbackPackageData = {
  1: {
    id: 1,
    title: 'Kerala Backwaters & Hills Escape',
    price: '₹18,999 – ₹28,999',
    mainImage: '/assets/images/kerala.jpg',
    galleryImages: ['/assets/images/kerala.jpg', '/assets/images/goa-1.jpg', '/assets/images/shimla.jpg'],
    season: 'Oct – Mar',
    nights: '6 Nights / 7 Days',
    location: 'Kochi – Munnar – Alleppey – Kovalam, Kerala',
    description: `Kerala, often called "God's Own Country," is a tropical paradise on the southwestern coast of India. This carefully curated package takes you through the misty tea plantations of Munnar, the tranquil backwaters of Alleppey where you'll stay overnight on a traditional houseboat, and the golden-sand beaches of Kovalam.

You'll experience authentic Kerala cuisine including fresh seafood and traditional sadya meals served on banana leaves. The trip includes visits to spice gardens, a Kathakali dance performance, and an Ayurvedic wellness session at a certified centre.`,
    highlights: ['Overnight houseboat stay on Alleppey Backwaters', 'Guided tea plantation tour in Munnar', 'Kathakali cultural performance', 'Ayurvedic wellness session', 'Kovalam beach sunset experience'],
    includes: ['Private AC vehicle with experienced chauffeur', 'Handpicked 3-star / 4-star hotel stays', 'Daily breakfast at all hotels', 'One night houseboat with full board meals', 'All sightseeing as per itinerary'],
    pricing: [
      { pkg: 'Standard (3-Star)', from: 'Oct 1', to: 'Mar 31', price: '₹18,999 per person' },
      { pkg: 'Deluxe (4-Star)', from: 'Oct 1', to: 'Mar 31', price: '₹24,499 per person' },
      { pkg: 'Premium (5-Star)', from: 'Oct 1', to: 'Mar 31', price: '₹28,999 per person' },
      { pkg: 'Family Pack (4 pax)', from: 'Oct 1', to: 'Mar 31', price: '₹72,999 total' },
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4017058.895483896!2d74.00582439999999!3d10.4510439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0812fcebd4d391%3A0x56b404753be23e4!2sKerala!5e0!3m2!1sen!2sin!4v1692000000000!5m2!1sen!2sin',
  },
  2: {
    id: 2,
    title: 'Royal Rajasthan Heritage Circuit',
    price: '₹21,499 – ₹35,999',
    mainImage: '/assets/images/jaipur.jpg',
    galleryImages: ['/assets/images/jaipur-2.jpg', '/assets/images/jeselmer.avif', '/assets/images/jaipur.jpg'],
    season: 'Oct – Feb',
    nights: '8 Nights / 9 Days',
    location: 'Jaipur – Jodhpur – Jaisalmer – Udaipur, Rajasthan',
    description: `Rajasthan is the land of kings, where every fort tells a story and every palace whispers of royal grandeur. This heritage circuit takes you through the iconic Pink City of Jaipur with its stunning Amber Fort and Hawa Mahal, to the Blue City of Jodhpur dominated by the imposing Mehrangarh Fort.

Continue to the golden dunes of Jaisalmer for a magical desert camping experience under the stars, complete with traditional folk music and Rajasthani cuisine. The journey concludes in the romantic city of Udaipur, where you'll cruise on Lake Pichola surrounded by stunning palace architecture.`,
    highlights: ['Elephant ride at Amber Fort, Jaipur', 'Desert safari & overnight camping in Jaisalmer', 'Lake Pichola sunset cruise in Udaipur', 'Mehrangarh Fort guided heritage walk', 'Traditional Rajasthani folk dinner'],
    includes: ['Private AC vehicle throughout the circuit', 'Heritage / boutique hotel stays', 'Daily breakfast and 2 dinners', 'Desert camp with cultural program', 'All monument entry tickets'],
    pricing: [
      { pkg: 'Standard Heritage', from: 'Oct 1', to: 'Feb 28', price: '₹21,499 per person' },
      { pkg: 'Deluxe Heritage', from: 'Oct 1', to: 'Feb 28', price: '₹29,999 per person' },
      { pkg: 'Royal Heritage (Palace stays)', from: 'Oct 1', to: 'Feb 28', price: '₹35,999 per person' },
      { pkg: 'Group Discount (6+ pax)', from: 'Oct 1', to: 'Feb 28', price: '₹18,999 per person' },
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.667847384078!2d75.78195!3d26.92207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1692000000001!5m2!1sen!2sin',
  },
  3: {
    id: 3,
    title: 'Goa Coastal Leisure Holiday',
    price: '₹12,999 – ₹22,499',
    mainImage: '/assets/images/goa-1.jpg',
    galleryImages: ['/assets/images/goa-1.jpg', '/assets/images/kerala.jpg'],
    season: 'Nov – Feb',
    nights: '4 Nights / 5 Days',
    location: 'North Goa – South Goa, India',
    description: `Goa is India's smallest state but its most vibrant coastal destination, blending Portuguese colonial heritage with sun-drenched beaches and a laid-back tropical lifestyle. This leisure package covers the best of both North and South Goa.

Explore the bustling beaches of Calangute and Baga in the north, visit the UNESCO-listed Basilica of Bom Jesus and Se Cathedral in Old Goa, and then escape to the quieter, palm-fringed shores of Palolem and Agonda in the south. Evenings come alive with beachside shacks, live music, and fresh Goan seafood.`,
    highlights: ['North Goa beach hopping – Calangute, Baga, Anjuna', 'Old Goa heritage church tour (UNESCO site)', 'South Goa serene beaches – Palolem & Agonda', 'Spice plantation visit with traditional lunch', 'Dudhsagar Falls day excursion'],
    includes: ['Airport / station transfers', 'Beach-facing resort accommodation', 'Daily breakfast', 'North & South Goa sightseeing by AC vehicle', 'Complimentary water sports voucher'],
    pricing: [
      { pkg: 'Budget Beach', from: 'Nov 1', to: 'Feb 28', price: '₹12,999 per person' },
      { pkg: 'Comfort Resort', from: 'Nov 1', to: 'Feb 28', price: '₹17,499 per person' },
      { pkg: 'Luxury Beach Villa', from: 'Nov 1', to: 'Feb 28', price: '₹22,499 per person' },
      { pkg: 'Honeymoon Special', from: 'Nov 1', to: 'Feb 28', price: '₹32,999 per couple' },
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d492245.9753999704!2d73.63853!3d15.34989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfba106336b741%3A0xeaf887ff62f34092!2sGoa!5e0!3m2!1sen!2sin!4v1692000000002!5m2!1sen!2sin',
  }
};

export default function PackageDetailsPage() {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [pkg, setPkg] = useState(fallbackPackageData[id] || fallbackPackageData[1]);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: '', email: '', phone: '', date1: '', date2: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/packages/${id}`);
        const data = await res.json();
        if (data.success && data.package) {
          const p = data.package;
          const formatted = {
            id: p.id,
            title: p.title,
            price: p.price_range,
            mainImage: p.main_image || '/assets/images/kerala.jpg',
            galleryImages: p.galleryImages && p.galleryImages.length > 0 ? p.galleryImages : [p.main_image || '/assets/images/kerala.jpg'],
            season: p.season || 'All Year',
            nights: p.nights || '6 Nights / 7 Days',
            location: p.location || 'India',
            description: p.description || '',
            highlights: p.highlights || [],
            includes: p.includes || [],
            pricing: p.pricing || [],
            mapSrc: p.map_src || ''
          };
          setPkg(formatted);
          setActiveImage(formatted.mainImage);
        } else if (fallbackPackageData[id]) {
          setPkg(fallbackPackageData[id]);
          setActiveImage(fallbackPackageData[id].mainImage);
        }
      } catch (err) {
        console.warn('Using fallback package details:', err);
        if (fallbackPackageData[id]) {
          setPkg(fallbackPackageData[id]);
          setActiveImage(fallbackPackageData[id].mainImage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: pkg.id,
          package_title: pkg.title,
          name: form.name,
          email: form.email,
          phone: form.phone,
          date1: form.date1,
          date2: form.date2,
          travel_date: form.date1 ? (form.date2 ? `${form.date1} to ${form.date2}` : form.date1) : '',
          message: form.message
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit enquiry');
      }

      setEnquirySent(true);
      setForm({ name: '', email: '', phone: '', date1: '', date2: '', message: '' });
      setTimeout(() => setEnquirySent(false), 8000);
    } catch (err) {
      alert(err.message || 'Error submitting enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Preloader />
      <Navbar />

      <PageHeading
        bgImage={pkg.mainImage || '/assets/images/kashmir-2.jpg'}
        subtitle={pkg.price}
        title={pkg.title}
      />

      {/* Product Images & Details */}
      <div className="products">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div>
                <img
                  src={activeImage || pkg.mainImage}
                  alt={pkg.title}
                  className="img-fluid wc-image"
                  style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '12px' }}
                  onError={(e) => { e.target.src = '/assets/images/kerala.jpg'; }}
                />
              </div>
              <br />
              <div className="row">
                {pkg.galleryImages && pkg.galleryImages.map((img, i) => (
                  <div key={i} className="col-sm-4 col-6" style={{ marginBottom: '15px' }}>
                    <img
                      src={img}
                      alt={`${pkg.title} gallery ${i + 1}`}
                      className="img-fluid"
                      style={{
                        height: '90px',
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: activeImage === img ? '2px solid #f33f3f' : '1px solid #ddd'
                      }}
                      onClick={() => setActiveImage(img)}
                      onError={(e) => { e.target.src = '/assets/images/kerala.jpg'; }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-6">
              <p className="lead" style={{ fontSize: '15px', color: '#475569' }}>
                <i className="fa fa-calendar" style={{ color: '#f33f3f' }}></i> Available: <strong>{pkg.season}</strong> &nbsp;&nbsp;
                <i className="fa fa-clock-o" style={{ color: '#f33f3f' }}></i> <strong>{pkg.nights}</strong> &nbsp;&nbsp;
                <i className="fa fa-car" style={{ color: '#f33f3f' }}></i> Private Chauffeur
              </p>
              <br />
              <p style={{ fontSize: '16px' }}>
                <i className="fa fa-map-marker" style={{ color: '#f33f3f', marginRight: '6px' }}></i>
                <strong>{pkg.location}</strong>
              </p>
              <br />
              {pkg.description && pkg.description.split('\n\n').map((para, i) => (
                <p key={i} style={{ color: '#64748b', lineHeight: '1.7' }}>{para}</p>
              ))}
              <br />

              {pkg.highlights && pkg.highlights.length > 0 && (
                <>
                  <h5 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
                    <strong>Key Trip Highlights</strong>
                  </h5>
                  <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                    {pkg.highlights.map((h, i) => (
                      <li key={i} style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#334155' }}>
                        <i className="fa fa-check-circle" style={{ color: '#16a34a', marginTop: '3px' }}></i>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div style={{ marginTop: '25px' }}>
                <button
                  type="button"
                  className="filled-button"
                  onClick={() => setModalOpen(true)}
                  style={{ padding: '12px 28px', fontSize: '15px', fontWeight: '700' }}
                >
                  Book This Package Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What's Included */}
      {pkg.includes && pkg.includes.length > 0 && (
        <div className="section" style={{ background: '#f8fafc', padding: '50px 0' }}>
          <div className="container">
            <div className="section-heading" style={{ border: 0, marginBottom: '25px' }}>
              <h2>What&apos;s Included</h2>
            </div>
            <div className="row">
              {pkg.includes.map((item, i) => (
                <div key={i} className="col-md-6 col-lg-4" style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <i className="fa fa-check-circle" style={{ color: '#16a34a', fontSize: '16px' }}></i>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Availability & Prices */}
      {pkg.pricing && pkg.pricing.length > 0 && (
        <div className="section" style={{ padding: '50px 0' }}>
          <div className="container">
            <div className="section-heading" style={{ border: 0, marginBottom: '25px' }}>
              <h2>Availability &amp; Prices</h2>
            </div>
            <div className="table-responsive">
              <table width="100%" border="0" cellSpacing="0" cellPadding="0" className="table table-striped">
                <thead>
                  <tr style={{ background: '#1e293b', color: '#fff' }}>
                    <th>Package Tier</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {pkg.pricing.map((row, i) => (
                    <tr key={i}>
                      <td><strong>{row.pkg || row.pkg_tier}</strong></td>
                      <td>{row.from || row.from_date || 'All Year'}</td>
                      <td>{row.to || row.to_date || 'All Year'}</td>
                      <td><strong style={{ color: '#f33f3f' }}>{row.price}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Google Map Section */}
      {pkg.mapSrc && (
        <div className="section" style={{ padding: '30px 0' }}>
          <div className="container">
            <div className="section-heading" style={{ border: 0, marginBottom: '20px' }}>
              <h2>Tour Location Map</h2>
            </div>
            <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <iframe
                src={pkg.mapSrc}
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Tour Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Form */}
      <div className="send-message" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-heading">
                <h2>Send an Enquiry for {pkg.title}</h2>
              </div>
            </div>
            <div className="col-md-8">
              <div className="contact-form">
                {enquirySent && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa fa-check-circle" /> Your enquiry has been received! Our travel specialist will get in touch with you shortly.
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <fieldset>
                        <input name="name" type="text" className="form-control" placeholder="Full Name" value={form.name} onChange={handleChange} required />
                      </fieldset>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <fieldset>
                        <input name="email" type="email" className="form-control" placeholder="E-Mail Address" value={form.email} onChange={handleChange} required />
                      </fieldset>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <fieldset>
                        <input name="phone" type="text" className="form-control" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
                      </fieldset>
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <fieldset>
                        <input name="date1" type="text" className="form-control" placeholder="From Date (e.g. 15/10/2026)" value={form.date1} onChange={handleChange} />
                      </fieldset>
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <fieldset>
                        <input name="date2" type="text" className="form-control" placeholder="To Date (e.g. 22/10/2026)" value={form.date2} onChange={handleChange} />
                      </fieldset>
                    </div>
                    <div className="col-lg-12">
                      <fieldset>
                        <textarea name="message" rows="6" className="form-control" placeholder="Special requirements, number of adults/children, customized itinerary requests..." value={form.message} onChange={handleChange} required></textarea>
                      </fieldset>
                    </div>
                    <div className="col-lg-12">
                      <fieldset>
                        <button type="submit" className="filled-button" disabled={submitting}>
                          {submitting ? 'Sending Enquiry...' : 'Send Enquiry'}
                        </button>
                      </fieldset>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-4">
              <img src={pkg.mainImage} className="img-fluid" alt={pkg.title} style={{ borderRadius: '12px', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = '/assets/images/kerala.jpg'; }} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        packageId={pkg.id}
        packageTitle={pkg.title}
      />
    </>
  );
}
