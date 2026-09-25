import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import BookingModal from '../components/BookingModal';
import './Blog.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const defaultFallbackBlog = {
  id: 1,
  slug: '10-must-visit-hidden-gems-in-kerala',
  title: '10 Must-Visit Hidden Gems in Kerala That Most Tourists Miss',
  image: '/assets/images/kerala.jpg',
  author: 'Maharaja Tours',
  created_at: '2026-08-15',
  views_count: 1245,
  summary: 'Discover uncharted backwaters, tranquil waterfalls, and secret spice villages across God’s Own Country.',
  content: `Kerala is one of India's most popular tourist destinations, but most visitors only scratch the surface — sticking to the well-known circuits of Munnar, Alleppey, and Kovalam. While these destinations are undeniably beautiful, the real magic of Kerala lies in its lesser-known villages, secluded beaches, and hidden natural wonders that few travellers ever discover.

In this guide, we take you beyond the guidebook to reveal hidden gems that will transform your Kerala experience from a standard holiday into an unforgettable adventure. From remote waterfalls tucked deep in the Western Ghats to centuries-old fishing villages where time seems to stand still, these destinations offer authentic Kerala experiences without the tourist crowds.

Why Explore Off-the-Beaten-Path in Kerala?

Travelling to lesser-known destinations in Kerala gives you the chance to experience authentic local culture, cuisine, and hospitality. You'll find pristine landscapes that haven't been commercialised, interact with local communities who are genuinely warm and welcoming, and discover hidden temples, tea estates, and backwater routes that offer a more intimate connection with nature.

The best part? Many of these hidden gems are easily accessible from major tourist hubs, making them perfect additions to your existing Kerala itinerary. Whether you're a first-time visitor or a seasoned traveller, these spots will give you fresh reasons to fall in love with God's Own Country all over again.`
};

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
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function BlogDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(defaultFallbackBlog);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/blogs/${id}`);
        const data = await res.json();
        if (data.success && data.blog) {
          setBlog(data.blog);
        }

        // Fetch other blogs for related section
        const listRes = await fetch(`${API_BASE_URL}/blogs?limit=4`);
        const listData = await listRes.json();
        if (listData.success && Array.isArray(listData.blogs)) {
          setRelatedBlogs(listData.blogs.filter(b => String(b.id) !== String(id) && b.slug !== id).slice(0, 3));
        }
      } catch (err) {
        console.warn('Using default blog details fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogDetails();
    }
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const paragraphs = (blog.content || '')
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div className="blog-wrapper">
      <Preloader />
      <Navbar />

      {/* ── ARTICLE HEADER ── */}
      <section className="blog-detail-hero">
        <div className="container" style={{ maxWidth: '840px' }}>
          <Link to="/blog" className="blog-back-btn">
            <i className="fa fa-arrow-left" /> Back to all articles
          </Link>

          <div>
            <span className="blog-detail-tag">Travel Guide</span>
          </div>

          <h1 className="blog-detail-title">
            {blog.title}
          </h1>

          <div className="blog-detail-meta-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="blog-detail-author-avatar">
                {blog.author ? blog.author.charAt(0).toUpperCase() : 'M'}
              </div>
              <div>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '14px' }}>
                  {blog.author || 'Maharaja Tours'}
                </strong>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Travel Specialist</span>
              </div>
            </div>

            <span style={{ color: '#cbd5e1' }}>&bull;</span>

            <span>
              <i className="fa fa-calendar-o" style={{ marginRight: '6px', color: '#94a3b8' }} />
              {formatDate(blog.created_at)}
            </span>

            <span style={{ color: '#cbd5e1' }}>&bull;</span>

            <span>
              <i className="fa fa-clock-o" style={{ marginRight: '6px', color: '#94a3b8' }} />
              {getReadTime(blog.content, blog.summary)}
            </span>

            <span style={{ color: '#cbd5e1' }}>&bull;</span>

            <span>
              <i className="fa fa-eye" style={{ marginRight: '6px', color: '#94a3b8' }} />
              {blog.views_count || 0} reads
            </span>
          </div>
        </div>
      </section>

      {/* ── ARTICLE BODY CONTENT ── */}
      <section style={{ padding: '20px 0 80px' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          {/* Cover image */}
          {blog.image && (
            <div className="blog-detail-cover">
              <img
                src={blog.image}
                alt={blog.title}
                onError={(e) => { e.target.src = '/assets/images/kerala.jpg'; }}
              />
            </div>
          )}

          {/* Lead Summary Callout */}
          {blog.summary && (
            <div className="blog-lead-box">
              <strong>Quick Summary:</strong> {blog.summary}
            </div>
          )}

          {/* Article Prose Paragraphs */}
          <article className="blog-prose">
            {paragraphs.map((para, idx) => {
              // Check if paragraph looks like a subheading (short, under 80 chars, without trailing period)
              if (para.length < 80 && !para.endsWith('.')) {
                return <h3 key={idx}>{para}</h3>;
              }
              return <p key={idx}>{para}</p>;
            })}
          </article>

          {/* Key Quote / Travel Tip Box */}
          <div className="blog-quote-box">
            <i className="fa fa-quote-left" style={{ marginRight: '8px', color: '#f33f3f', fontSize: '14px' }} />
            "Travelling is not just about seeing new places, but experiencing them with comfort, cultural connection, and peace of mind."
          </div>

          {/* Social Share & Copy Link */}
          <div className="blog-share-bar">
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
              Share this story with fellow travellers:
            </span>
            <div className="blog-share-links">
              <button
                type="button"
                className="blog-share-btn"
                onClick={handleCopyLink}
                title="Copy link to clipboard"
              >
                <i className={`fa ${copied ? 'fa-check' : 'fa-link'}`} style={{ color: copied ? '#16a34a' : 'inherit' }} />
              </button>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + ' ' + window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="blog-share-btn"
                title="Share on WhatsApp"
              >
                <i className="fa fa-whatsapp" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="blog-share-btn"
                title="Share on Twitter"
              >
                <i className="fa fa-twitter" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="blog-share-btn"
                title="Share on Facebook"
              >
                <i className="fa fa-facebook" />
              </a>
            </div>
          </div>

          {/* Author Card */}
          <div className="blog-author-card">
            <div className="blog-detail-author-avatar" style={{ width: '56px', height: '56px', fontSize: '20px', flexShrink: 0 }}>
              {blog.author ? blog.author.charAt(0).toUpperCase() : 'M'}
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>
                Written by {blog.author || 'Maharaja Tours & Travels'}
              </h4>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                Our in-house team of travel coordinators and itinerary designers dedicated to crafting bespoke holidays across India since 2012.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="blog-tour-cta">
            <h3>Ready to Experience This Destination?</h3>
            <p>
              Let our travel experts craft a tailored itinerary with verified hotel stays, private chauffeur transfers, and 24/7 dedicated support.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/packages" className="btn-minimal-primary">
                Browse Tour Packages <i className="fa fa-arrow-right" />
              </Link>
              <Link to="/contact" className="btn-minimal-outline">
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED ARTICLES ── */}
      {relatedBlogs.length > 0 && (
        <section className="blog-related-section">
          <div className="container" style={{ maxWidth: '840px' }}>
            <h3 className="blog-related-heading">More Travel Stories You Might Like</h3>
            <div className="blog-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              {relatedBlogs.map(r => (
                <article key={r.id} className="blog-card">
                  <div className="blog-card__image-wrap" style={{ aspectRatio: '16/10' }}>
                    <Link to={`/blog/${r.slug || r.id}`}>
                      <img
                        src={r.image || '/assets/images/kerala.jpg'}
                        alt={r.title}
                        onError={(e) => { e.target.src = '/assets/images/kerala.jpg'; }}
                      />
                    </Link>
                  </div>
                  <div className="blog-card__body">
                    <h4 className="blog-card__title" style={{ fontSize: '15px' }}>
                      <Link to={`/blog/${r.slug || r.id}`}>{r.title}</Link>
                    </h4>
                    <Link to={`/blog/${r.slug || r.id}`} className="blog-read-link" style={{ fontSize: '12.5px' }}>
                      Read Story <i className="fa fa-angle-right" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
