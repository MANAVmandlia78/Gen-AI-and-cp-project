import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import PageHeading from '../components/PageHeading';
import ProductCard from '../components/ProductCard';
import BookingModal from '../components/BookingModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const defaultPackages = [
  {
    id: 1,
    image: '/assets/images/kerala.jpg',
    title: 'Kerala Backwaters & Hills Escape',
    price: '₹18,999 - ₹28,999',
    description: 'Cruise through the tranquil backwaters of Alleppey, explore the misty tea plantations of Munnar, and unwind on the pristine beaches of Kovalam and Varkala.',
    season: 'Oct – Mar',
    nights: '6 Nights / 7 Days',
  },
  {
    id: 2,
    image: '/assets/images/jaipur.jpg',
    title: 'Royal Rajasthan Heritage Circuit',
    price: '₹21,499 - ₹35,999',
    description: 'Discover the majestic Amber Fort, stroll through the vibrant bazaars of the Pink City, and witness the sunset at Nahargarh Fort overlooking Jaipur.',
    season: 'Oct – Feb',
    nights: '8 Nights / 9 Days',
  },
  {
    id: 3,
    image: '/assets/images/goa-1.jpg',
    title: 'Goa Coastal Leisure Holiday',
    price: '₹12,999 - ₹22,499',
    description: 'Relax on the sun-kissed beaches of Calangute and Palolem, explore Portuguese-era churches in Old Goa, and enjoy vibrant nightlife and fresh seafood.',
    season: 'Nov – Feb',
    nights: '4 Nights / 5 Days',
  },
  {
    id: 4,
    image: '/assets/images/kashmir.jpg',
    title: 'Kashmir Paradise Valley Tour',
    price: '₹24,999 - ₹42,999',
    description: 'Experience the breathtaking beauty of Dal Lake on a traditional shikara ride, explore the Mughal Gardens, and trek through the stunning Pahalgam meadows.',
    season: 'Apr – Oct',
    nights: '7 Nights / 8 Days',
  },
  {
    id: 5,
    image: '/assets/images/manali.jpg',
    title: 'Manali & Rohtang Adventure Trip',
    price: '₹15,999 - ₹26,999',
    description: 'Drive through the snow-capped Rohtang Pass, visit the ancient Hadimba Temple nestled in cedar forests, and enjoy river rafting on the Beas River.',
    season: 'May – Oct',
    nights: '5 Nights / 6 Days',
  },
  {
    id: 6,
    image: '/assets/images/shimla.jpg',
    title: 'Shimla Colonial Hill Station Retreat',
    price: '₹14,499 - ₹24,999',
    description: 'Walk along the charming Mall Road, ride the heritage toy train from Kalka to Shimla, and enjoy panoramic Himalayan views from Jakhoo Temple.',
    season: 'Mar – Jun',
    nights: '4 Nights / 5 Days',
  },
];

const ITEMS_PER_PAGE = 6;

export default function PackagesPage() {
  const [packages, setPackages] = useState(defaultPackages);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPackages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/packages`);
        const data = await res.json();
        if (data.success && Array.isArray(data.packages) && data.packages.length > 0) {
          const formatted = data.packages.map(p => ({
            id: p.id,
            image: p.main_image || '/assets/images/kerala.jpg',
            title: p.title,
            price: p.price_range || '₹18,999',
            description: p.description || '',
            season: p.season || 'All Year',
            nights: p.nights || '5 Nights / 6 Days',
            location: p.location || ''
          }));
          setPackages(formatted);
        }
      } catch (err) {
        console.warn('Fallback to default packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPackages();
  }, []);

  // Filter packages based on search term
  const filteredPackages = packages.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.season?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredPackages.length / ITEMS_PER_PAGE));
  const paged = filteredPackages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <Preloader />
      <Navbar />

      <PageHeading
        bgImage="/assets/images/kashmir-2.jpg"
        subtitle="Explore handpicked destinations across India"
        title="Tour Packages"
      />

      <div className="products">
        <div className="container">
          {/* Search & Filter Bar */}
          <div className="row" style={{ marginBottom: '36px' }}>
            <div className="col-md-6 offset-md-3">
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search destinations, packages, seasons (e.g. Kerala, Oct, 6 Nights)..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  style={{
                    width: '100%',
                    padding: '12px 18px 12px 42px',
                    borderRadius: '24px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '13.5px',
                    color: '#0f172a',
                    outline: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'border-color 0.2s'
                  }}
                />
                <i
                  className="fa fa-search"
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
              </div>
            </div>
          </div>

          <div className="row">
            {paged.length === 0 ? (
              <div className="col-12 text-center" style={{ padding: '60px 0' }}>
                <i className="fa fa-search" style={{ fontSize: '36px', color: '#cbd5e1', marginBottom: '12px', display: 'block' }}></i>
                <h4 style={{ color: '#0f172a', fontSize: '18px', fontWeight: '700' }}>No tour packages found</h4>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Try searching with a different destination or keyword.</p>
              </div>
            ) : (
              paged.map(pkg => (
                <div key={pkg.id} className="col-md-4 col-sm-6" style={{ marginBottom: '30px' }}>
                  <ProductCard
                    image={pkg.image}
                    title={pkg.title}
                    price={pkg.price}
                    description={pkg.description}
                    season={pkg.season}
                    nights={pkg.nights}
                    location={pkg.location}
                    link={`/packages/${pkg.id}`}
                  />
                </div>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="col-md-12">
                <ul className="pages">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <li key={i} className={currentPage === i + 1 ? 'active' : ''}>
                      <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}>{i + 1}</a>
                    </li>
                  ))}
                  {currentPage < totalPages && (
                    <li>
                      <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(p + 1, totalPages)); }}>
                        <i className="fa fa-angle-double-right"></i>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
