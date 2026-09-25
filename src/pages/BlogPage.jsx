import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import './Blog.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const fallbackBlogs = [
  {
    id: 1,
    slug: '10-must-visit-hidden-gems-in-kerala',
    image: '/assets/images/blog-1-370x270.jpg',
    title: '10 Must-Visit Hidden Gems in Kerala That Most Tourists Miss',
    author: 'Maharaja Tours',
    created_at: '2026-08-15',
    views_count: 1245,
    summary: 'Discover uncharted backwaters, tranquil waterfalls, and secret spice villages across God’s Own Country.',
    content: 'Kerala is celebrated worldwide for its tranquil backwaters and lush tea plantations. Beyond popular hotspots like Munnar and Alleppey lie hidden sanctuaries where nature flourishes untouched. In this guide, we reveal 10 remarkable lesser-known gems in Kerala including the mystic caves of Edakkal, the secluded valley of Gavi, and the pristine golden sands of Marari beach.'
  },
  {
    id: 2,
    slug: 'guide-to-planning-first-rajasthan-road-trip',
    image: '/assets/images/blog-2-370x270.jpg',
    title: 'A Complete Guide to Planning Your First Rajasthan Road Trip',
    author: 'Maharaja Tours',
    created_at: '2026-08-10',
    views_count: 982,
    summary: 'Step-by-step route planning, essential packing tips, and royal palace stopovers across the desert state.',
    content: 'A road trip through Rajasthan is an unforgettable journey through time. Marvel at sandstone fortresses, colorful bazaars, and golden sand dunes. We cover best road routes connecting Jaipur, Jodhpur, Jaisalmer, and Udaipur, along with top highway dhabas, heritage hotel recommendations, and permit guidance.'
  },
  {
    id: 3,
    slug: 'best-time-to-visit-kashmir-season-guide',
    image: '/assets/images/blog-3-370x270.jpg',
    title: 'Best Time to Visit Kashmir: Season-by-Season Travel Guide',
    author: 'Maharaja Tours',
    created_at: '2026-08-05',
    views_count: 2134,
    summary: 'From blooming tulip gardens in spring to magical snowfall in winter — find your perfect Kashmir travel season.',
    content: 'Every season transforms the Kashmir Valley into a new paradise. Spring brings millions of blooming tulips in Srinagar. Summer offers pleasant hikes in Pahalgam and Sonmarg. Autumn paints the Chinar trees in dazzling crimson and gold. Winter turns Gulmarg into India’s premier snow wonderland.'
  },
  {
    id: 4,
    slug: 'manali-vs-shimla-which-hill-station-to-choose',
    image: '/assets/images/blog-4-370x270.jpg',
    title: 'Manali vs Shimla: Which Hill Station Is Right for Your Holiday?',
    author: 'Maharaja Tours',
    created_at: '2026-07-28',
    views_count: 876,
    summary: 'A head-to-head comparison of attractions, adventure sports, family activities, and travel budgets.',
    content: 'Choosing between Himachal’s two most famous hill towns depends on your travel style. Shimla offers colonial charm, Mall Road walks, and heritage toy train rides perfect for a relaxing family escape. Manali caters to thrill-seekers with paragliding, river rafting, and snow trips to Rohtang Pass.'
  },
  {
    id: 5,
    slug: 'top-7-vegetarian-friendly-destinations-india',
    image: '/assets/images/blog-5-370x270.jpg',
    title: 'Top 7 Vegetarian-Friendly Destinations for Indian Travellers',
    author: 'Maharaja Tours',
    created_at: '2026-07-20',
    views_count: 1567,
    summary: 'Explore culinary havens offering pure vegetarian and Jain culinary experiences with absolute peace of mind.',
    content: 'Finding authentic vegetarian and Jain food while travelling is seamless when you visit destinations renowned for their rich vegetarian food culture. From the royal thalis of Gujarat and Rajasthan to the sacred temple feasts of South India, here are top destinations with mouthwatering veg options.'
  },
  {
    id: 6,
    slug: 'how-to-pack-smart-for-week-long-indian-holiday',
    image: '/assets/images/blog-6-370x270.jpg',
    title: 'How to Pack Smart for a Week-Long Indian Holiday in Any Season',
    author: 'Maharaja Tours',
    created_at: '2026-07-15',
    views_count: 743,
    summary: 'Essential checklist of clothing, medicines, travel gadgets, and weather essentials for hassle-free travel.',
    content: 'Packing efficiently can make or break your holiday. Whether you are heading to snowy mountain passes or sunny coastal beaches, learn how to layer clothes, organize important documents, carry essential medications, and keep your luggage lightweight.'
  }
];

const CATEGORIES = ['All', 'Kerala', 'Rajasthan', 'Kashmir', 'Himachal', 'Tips'];
const ITEMS_PER_PAGE = 6;

// Helper to calculate reading time
function getReadTime(content, summary) {
  const words = ((content || '') + ' ' + (summary || '')).trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 150);
  return `${Math.max(2, minutes)} min read`;
}

// Helper to format date
function formatDate(dateStr) {
  if (!dateStr) return 'Recent';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState(fallbackBlogs);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/blogs`);
        const data = await res.json();
        if (data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
          setBlogs(data.blogs);
        }
      } catch (err) {
        console.warn('Using default fallback blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs by search term and category
  const filtered = blogs.filter(b => {
    const matchesSearch =
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'All') return true;
    const catLower = activeCategory.toLowerCase();
    return (
      b.title?.toLowerCase().includes(catLower) ||
      b.summary?.toLowerCase().includes(catLower) ||
      b.content?.toLowerCase().includes(catLower)
    );
  });

  // Featured article (first item if not searching, or first match)
  const featuredArticle = filtered.length > 0 ? filtered[0] : null;
  const remainingArticles = filtered.length > 1 ? filtered.slice(1) : [];

  // Pagination for remaining articles
  const totalPages = Math.max(1, Math.ceil(remainingArticles.length / ITEMS_PER_PAGE));
  const pagedArticles = remainingArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="blog-wrapper">
      <Preloader />
      <Navbar />

      {/* ── HERO BANNER ── */}
      <section className="blog-hero">
        <div className="blog-hero__decor" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="blog-hero__tag">
            <i className="fa fa-compass" /> Travel Stories &amp; Guides
          </span>
          <h1 className="blog-hero__title">
            Inspiration for Your Next Holiday
          </h1>
          <p className="blog-hero__sub">
            Handcrafted destination guides, seasonal advice, and cultural insights curated by our on-ground travel specialists.
          </p>

          {/* Search Input */}
          <div className="blog-search-bar">
            <div className="blog-search-bar__inner">
              <i className="fa fa-search blog-search-bar__icon" />
              <input
                type="text"
                className="blog-search-bar__input"
                placeholder="Search articles by destination, tips, or itinerary..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="blog-search-bar__clear"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="blog-filter-bar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                className={`blog-filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG CONTENT SECTION ── */}
      <section className="blog-content-section">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="blog-empty">
              <i className="fa fa-file-text-o" />
              <h4>No Articles Found</h4>
              <p>We couldn't find any travel articles matching "{searchTerm}". Try another keyword or browse all categories.</p>
              <button
                type="button"
                className="admin-action-btn primary"
                onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* ── FEATURED SPOTLIGHT ARTICLE ── */}
              {featuredArticle && !searchTerm && activeCategory === 'All' && (
                <article className="blog-featured-card">
                  <div className="blog-featured-card__image">
                    <img
                      src={featuredArticle.image || '/assets/images/kerala.jpg'}
                      alt={featuredArticle.title}
                      onError={(e) => { e.target.src = '/assets/images/kerala.jpg'; }}
                    />
                    <span className="blog-featured-card__badge">Featured Story</span>
                  </div>
                  <div className="blog-featured-card__body">
                    <div className="blog-meta-row">
                      <span className="blog-meta-item">
                        <i className="fa fa-calendar-o" />
                        {formatDate(featuredArticle.created_at)}
                      </span>
                      <span className="blog-meta-item">
                        <i className="fa fa-clock-o" />
                        {getReadTime(featuredArticle.content, featuredArticle.summary)}
                      </span>
                      <span className="blog-meta-item">
                        <i className="fa fa-eye" />
                        {featuredArticle.views_count || 120} views
                      </span>
                    </div>

                    <h2 className="blog-featured-card__title">
                      <Link to={`/blog/${featuredArticle.slug || featuredArticle.id}`}>
                        {featuredArticle.title}
                      </Link>
                    </h2>

                    <p className="blog-featured-card__excerpt">
                      {featuredArticle.summary || featuredArticle.content?.substring(0, 160) + '...'}
                    </p>

                    <div className="blog-featured-card__footer">
                      <div className="blog-author-tag">
                        <div className="blog-author-avatar">
                          {featuredArticle.author ? featuredArticle.author.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <span className="blog-author-name">{featuredArticle.author || 'Maharaja Tours'}</span>
                      </div>

                      <Link
                        to={`/blog/${featuredArticle.slug || featuredArticle.id}`}
                        className="blog-read-link"
                      >
                        Read Full Story <i className="fa fa-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </article>
              )}

              {/* ── GRID OF ARTICLES ── */}
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  {searchTerm || activeCategory !== 'All' ? `Matching Stories (${filtered.length})` : 'All Travel Articles'}
                </h3>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  Showing {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
                </span>
              </div>

              <div className="blog-grid">
                {(searchTerm || activeCategory !== 'All' ? filtered : remainingArticles).map(post => (
                  <article key={post.id} className="blog-card">
                    <div className="blog-card__image-wrap">
                      <Link to={`/blog/${post.slug || post.id}`}>
                        <img
                          src={post.image || '/assets/images/kerala.jpg'}
                          alt={post.title}
                          loading="lazy"
                          onError={(e) => { e.target.src = '/assets/images/kerala.jpg'; }}
                        />
                      </Link>
                      <div className="blog-card__duration">
                        <i className="fa fa-clock-o" />
                        {getReadTime(post.content, post.summary)}
                      </div>
                    </div>

                    <div className="blog-card__body">
                      <div className="blog-card__meta">
                        <span><i className="fa fa-calendar-o" style={{ marginRight: '4px' }} />{formatDate(post.created_at)}</span>
                        <span>&bull;</span>
                        <span><i className="fa fa-eye" style={{ marginRight: '4px' }} />{post.views_count || 0}</span>
                      </div>

                      <h3 className="blog-card__title">
                        <Link to={`/blog/${post.slug || post.id}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="blog-card__excerpt">
                        {post.summary || post.content?.substring(0, 120) + '...'}
                      </p>

                      <div className="blog-card__footer">
                        <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#64748b' }}>
                          <i className="fa fa-user-circle-o" style={{ marginRight: '5px', color: '#94a3b8' }} />
                          {post.author || 'Maharaja Tours'}
                        </span>
                        <Link to={`/blog/${post.slug || post.id}`} className="blog-read-link">
                          Read <i className="fa fa-angle-right" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* ── PAGINATION ── */}
              {totalPages > 1 && !searchTerm && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px', gap: '8px' }}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentPage(i + 1)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        border: currentPage === i + 1 ? '1px solid #f33f3f' : '1px solid #e2e8f0',
                        background: currentPage === i + 1 ? '#f33f3f' : '#ffffff',
                        color: currentPage === i + 1 ? '#ffffff' : '#1e293b',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
