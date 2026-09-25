import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import AITravelIntelligenceSection from '../components/ai/AITravelIntelligenceSection';
import './HomePage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/* ─── Default 6 Packages Fallback Data ─────────────────────── */
const defaultLatestPackages = [
  {
    id: 1,
    image: '/assets/images/kerala.jpg',
    destination: 'Kerala, India',
    title: 'Kerala Backwaters & Hills Escape',
    price: '₹18,999',
    nights: '6 Nights / 7 Days',
    description: 'Cruise through tranquil backwaters of Alleppey, explore the misty hills of Munnar, and unwind on the serene beaches of Kovalam.',
  },
  {
    id: 2,
    image: '/assets/images/jaipur.jpg',
    destination: 'Jaipur, Rajasthan',
    title: 'Royal Rajasthan Heritage Circuit',
    price: '₹21,499',
    nights: '8 Nights / 9 Days',
    description: 'Discover the majestic Amber Fort, explore the vibrant bazaars of the Pink City, and experience royal Rajasthani hospitality.',
  },
  {
    id: 3,
    image: '/assets/images/goa-1.jpg',
    destination: 'Goa, India',
    title: 'Goa Coastal Leisure Holiday',
    price: '₹12,999',
    nights: '4 Nights / 5 Days',
    description: 'Relax on sun-kissed beaches, explore Portuguese heritage churches, and enjoy vibrant nightlife and fresh seafood.',
  },
  {
    id: 4,
    image: '/assets/images/kashmir.jpg',
    destination: 'Srinagar, J&K',
    title: 'Kashmir Paradise Valley Tour',
    price: '₹24,999',
    nights: '7 Nights / 8 Days',
    description: 'Experience Dal Lake on a traditional shikara, explore Mughal Gardens, and trek through stunning Pahalgam pine meadows.',
  },
  {
    id: 5,
    image: '/assets/images/manali.jpg',
    destination: 'Manali, Himachal Pradesh',
    title: 'Manali & Rohtang Adventure Trip',
    price: '₹15,999',
    nights: '5 Nights / 6 Days',
    description: 'Drive through snow-capped Rohtang Pass, visit ancient Hadimba Temple in cedar forests, and enjoy thrilling river rafting.',
  },
  {
    id: 6,
    image: '/assets/images/shimla.jpg',
    destination: 'Shimla, Himachal Pradesh',
    title: 'Shimla Colonial Hill Station Retreat',
    price: '₹14,499',
    nights: '4 Nights / 5 Days',
    description: 'Walk along the charming Mall Road, ride the UNESCO heritage toy train from Kalka, and enjoy panoramic Himalayan views.',
  },
];

const travelExperiences = [
  {
    id: 1,
    tag: 'Heritage',
    title: 'Jaipur — The Pink City',
    region: 'Rajasthan',
    image: '/assets/images/jaipur-2.jpg',
  },
  {
    id: 2,
    tag: 'Mountain',
    title: 'Kashmir — Paradise on Earth',
    region: 'Jammu & Kashmir',
    image: '/assets/images/kashmir.jpg',
  },
  {
    id: 3,
    tag: 'Serenity',
    title: 'Manali — Valley of the Gods',
    region: 'Himachal Pradesh',
    image: '/assets/images/manali.jpg',
  },
  {
    id: 4,
    tag: 'Desert',
    title: 'Jaisalmer — The Golden City',
    region: 'Rajasthan',
    image: '/assets/images/jeselmer.avif',
  },
];

const principles = [
  {
    icon: 'fa-compass',
    title: 'Hand-Crafted Itineraries',
    desc: 'Each trip is thoughtfully planned around your schedule, preferred pace, and dietary needs.',
  },
  {
    icon: 'fa-building-o',
    title: 'Verified Partner Stays',
    desc: 'We personally inspect our partner hotels, resorts, and private chauffeurs for consistent quality.',
  },
  {
    icon: 'fa-shield',
    title: 'Dedicated On-Trip Support',
    desc: 'A single dedicated coordinator assists you from initial booking until you return safely.',
  },
];

export default function HomePage() {
  const [packages, setPackages] = useState(defaultLatestPackages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPackages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/packages`);
        const data = await res.json();
        if (data.success && Array.isArray(data.packages) && data.packages.length > 0) {
          // Sort packages by latest (highest ID / created_at DESC) and select top 6
          const sorted = [...data.packages].sort((a, b) => (b.id || 0) - (a.id || 0));
          const latest6 = sorted.slice(0, 6).map(p => ({
            id: p.id,
            image: p.main_image || '/assets/images/kerala.jpg',
            destination: p.location || 'India',
            title: p.title,
            price: p.price_range?.split('-')[0]?.trim() || p.price_range || '₹18,999',
            nights: p.nights || '5 Nights / 6 Days',
            description: p.description?.length > 130 ? p.description.substring(0, 130) + '...' : (p.description || ''),
          }));
          setPackages(latest6);
        }
      } catch (err) {
        console.warn('Using default 6 packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPackages();
  }, []);

  return (
    <>
      <Preloader />
      <Navbar />

      {/* ── HERO BANNER ── */}
      <section
        className="hp-hero-minimal"
        style={{ backgroundImage: "url('/assets/images/kashmir-2.jpg')" }}
      >
        <div className="hp-hero-minimal__overlay" />
        <div className="container">
          <div className="hp-hero-minimal__content">
            <span className="hp-hero-minimal__tag">Maharaja Tours &amp; Travels</span>
            <h1 className="hp-hero-minimal__title">
              Curated Holidays &amp;<br />Bespoke Journeys
            </h1>
            <p className="hp-hero-minimal__sub">
              Handpicked vacation packages, verified hotel stays, and private travel arrangements across India. Headquartered in Junagadh, Gujarat.
            </p>
            <div className="hp-hero-minimal__actions">
              <a href="#ai-travel-intelligence" className="btn-minimal-primary" style={{ background: 'linear-gradient(135deg, #f33f3f 0%, #f59e0b 100%)' }}>
                <i className="fa fa-sparkles"></i> Try AI Trip Planner
              </a>
              <Link to="/packages" className="btn-minimal-outline">
                Explore Packages <i className="fa fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLAGSHIP GENERATIVE AI TRAVEL INTELLIGENCE SECTION ── */}
      <AITravelIntelligenceSection />

      {/* ── LATEST 6 TOUR PACKAGES ── */}
      <section className="hp-section-minimal">
        <div className="container">
          <div className="hp-section-header">
            <div>
              <h2>Latest Tour Packages</h2>
              <p>Explore our 6 newest handpicked holiday packages with verified hotels &amp; private transport.</p>
            </div>
            <Link to="/packages" className="hp-link-more">
              View All Packages ({packages.length}+) <i className="fa fa-arrow-right"></i>
            </Link>
          </div>

          <div className="hp-pkg-grid-minimal">
            {packages.map((pkg) => (
              <article key={pkg.id} className="hp-pkg-card-minimal">
                <div className="hp-pkg-card-minimal__image">
                  <Link to={`/packages/${pkg.id}`} tabIndex={-1}>
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      loading="lazy"
                      onError={(e) => { e.target.src = '/assets/images/kerala.jpg'; }}
                    />
                  </Link>
                  <span className="hp-pkg-card-minimal__duration">
                    <i className="fa fa-clock-o" style={{ marginRight: '4px' }} />
                    {pkg.nights}
                  </span>
                </div>
                <div className="hp-pkg-card-minimal__body">
                  <div className="hp-pkg-card-minimal__location">
                    <i className="fa fa-map-marker" /> {pkg.destination}
                  </div>
                  <h3 className="hp-pkg-card-minimal__title">
                    <Link to={`/packages/${pkg.id}`}>{pkg.title}</Link>
                  </h3>
                  <p className="hp-pkg-card-minimal__desc">{pkg.description}</p>
                  <div className="hp-pkg-card-minimal__footer">
                    <div className="hp-pkg-card-minimal__price">
                      <span>Starting from</span>
                      <strong>{pkg.price}</strong>
                    </div>
                    <Link to={`/packages/${pkg.id}`} className="hp-pkg-card-minimal__btn">
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPONENT 1: TRAVEL EXPERIENCES (PHOTO TILES) ── */}
      <section className="hp-section-minimal hp-section-minimal--white">
        <div className="container">
          <div className="hp-section-header">
            <div>
              <h2>Explore by Experience</h2>
              <p>Browse signature travel styles tailored to different holiday preferences.</p>
            </div>
            <Link to="/packages" className="hp-link-more">
              All Destinations <i className="fa fa-arrow-right"></i>
            </Link>
          </div>

          <div className="hp-exp-grid">
            {travelExperiences.map((exp) => (
              <Link key={exp.id} to="/packages" className="hp-exp-card">
                <img src={exp.image} alt={exp.title} loading="lazy" />
                <div className="hp-exp-card__overlay">
                  <span>{exp.tag}</span>
                  <h3>{exp.title}</h3>
                  <p>{exp.region}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPONENT 2: EDITORIAL SPLIT WITH IMAGE ── */}
      <section className="hp-section-minimal">
        <div className="container">
          <div className="hp-editorial-split">
            <div className="hp-editorial-image">
              <img
                src="/assets/images/shimla.jpg"
                alt="Shimla Hill Station"
                loading="lazy"
              />
            </div>
            <div className="hp-editorial-body">
              <span className="hp-editorial-tag">About Maharaja Tours</span>
              <h2>A Legacy of Dependable Travel Since 2012</h2>
              <p>
                Founded in the historic city of Junagadh, Maharaja Tours &amp; Travels began with a simple belief: every journey across India should be smooth, culturally rich, and genuinely personalized.
              </p>
              <p>
                Whether you are exploring the backwaters of Kerala, the royal palaces of Rajasthan, or the snow-clad peaks of Kashmir, our team handles all logistics so you can focus entirely on making memories.
              </p>
              <div className="hp-editorial-stats">
                <div className="hp-stat-cell">
                  <span className="hp-stat-cell__num">12+</span>
                  <span className="hp-stat-cell__label">Years of Service</span>
                </div>
                <div className="hp-stat-cell">
                  <span className="hp-stat-cell__num">5,000+</span>
                  <span className="hp-stat-cell__label">Satisfied Travelers</span>
                </div>
                <div className="hp-stat-cell">
                  <span className="hp-stat-cell__num">24/7</span>
                  <span className="hp-stat-cell__label">On-Trip Support</span>
                </div>
              </div>
              <div style={{ marginTop: '24px' }}>
                <Link to="/about" className="btn-minimal-primary">
                  Read Our Story <i className="fa fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPONENT 3: WHY CHOOSE US (ICON PRINCIPLES) ── */}
      <section className="hp-section-minimal hp-section-minimal--white">
        <div className="container">
          <div className="hp-section-header">
            <div>
              <h2>The Maharaja Standard</h2>
              <p>Three commitments that guide how we organize every holiday.</p>
            </div>
            <Link to="/about" className="hp-link-more">
              Learn More <i className="fa fa-arrow-right"></i>
            </Link>
          </div>

          <div className="hp-principles-grid">
            {principles.map((p, idx) => (
              <div key={idx} className="hp-principle-card">
                <div className="hp-principle-card__icon">
                  <i className={`fa ${p.icon}`}></i>
                </div>
                <h3 className="hp-principle-card__title">{p.title}</h3>
                <p className="hp-principle-card__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
