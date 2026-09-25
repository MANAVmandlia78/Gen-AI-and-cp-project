import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Admin.css';

const defaultPackageForm = {
  id: null,
  title: '',
  price_range: '',
  season: 'Oct – Mar',
  nights: '6 Nights / 7 Days',
  location: '',
  main_image: '/assets/images/kerala.jpg',
  description: '',
  highlights: [''],
  includes: [''],
  map_src: '',
  is_featured: true,
  pricing: [
    { pkg_tier: 'Standard (3-Star)', from_date: 'Oct 1', to_date: 'Mar 31', price: '₹18,999 per person' },
    { pkg_tier: 'Deluxe (4-Star)', from_date: 'Oct 1', to_date: 'Mar 31', price: '₹24,499 per person' },
  ],
  gallery: ['/assets/images/kerala.jpg', '/assets/images/jaipur.jpg']
};

const defaultBlogForm = {
  id: null,
  title: '',
  slug: '',
  image: '/assets/images/blog-1-370x270.jpg',
  author: 'Maharaja Tours',
  summary: '',
  content: '',
  is_published: true
};

export default function AdminDashboardPage() {
  const { user, token, logout, apiUrl } = useAuth();

  const [activeTab, setActiveTab] = useState('packages');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalBookings: 0,
    totalEnquiries: 0,
    totalPackages: 0,
    totalBlogs: 0
  });

  const [packagesList, setPackagesList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Package Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pkgForm, setPkgForm] = useState(defaultPackageForm);
  const [savingPkg, setSavingPkg] = useState(false);

  // Blog Modal State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isBlogEditMode, setIsBlogEditMode] = useState(false);
  const [blogForm, setBlogForm] = useState(defaultBlogForm);
  const [savingBlog, setSavingBlog] = useState(false);

  // Fetch all admin data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Packages
      const pkgRes = await fetch(`${apiUrl}/packages`);
      const pkgData = await pkgRes.json();
      if (pkgData.success) {
        setPackagesList(pkgData.packages || []);
      }

      // Fetch Blogs
      const blogRes = await fetch(`${apiUrl}/blogs?all=true`);
      const blogData = await blogRes.json();
      if (blogData.success) {
        setBlogsList(blogData.blogs || []);
      }

      // Fetch Stats
      const statsRes = await fetch(`${apiUrl}/admin/stats`, { headers });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(prev => ({
          ...prev,
          ...statsData.stats,
          totalPackages: pkgData.count || (pkgData.packages ? pkgData.packages.length : 0),
          totalBlogs: blogData.count || (blogData.blogs ? blogData.blogs.length : 0)
        }));
      }

      // Fetch Registered Users
      const usersRes = await fetch(`${apiUrl}/admin/users`, { headers });
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsersList(usersData.users || []);
      }

      // Fetch Bookings
      const bookingsRes = await fetch(`${apiUrl}/admin/bookings`, { headers });
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) {
        setBookingsList(bookingsData.bookings || []);
      }

      // Fetch Enquiries
      const enquiriesRes = await fetch(`${apiUrl}/admin/enquiries`, { headers });
      const enquiriesData = await enquiriesRes.json();
      if (enquiriesData.success) {
        setEnquiriesList(enquiriesData.enquiries || []);
      }
    } catch (err) {
      setError('Failed to load dashboard data from server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Open modal for new package
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setPkgForm(defaultPackageForm);
    setIsModalOpen(true);
  };

  // Open modal for editing package
  const handleOpenEditModal = async (pkgId) => {
    try {
      const res = await fetch(`${apiUrl}/packages/${pkgId}`);
      const data = await res.json();
      if (data.success && data.package) {
        const p = data.package;
        setPkgForm({
          id: p.id,
          title: p.title || '',
          price_range: p.price_range || '',
          season: p.season || '',
          nights: p.nights || '',
          location: p.location || '',
          main_image: p.main_image || '/assets/images/kerala.jpg',
          description: p.description || '',
          highlights: p.highlights && p.highlights.length > 0 ? p.highlights : [''],
          includes: p.includes && p.includes.length > 0 ? p.includes : [''],
          map_src: p.map_src || '',
          is_featured: !!p.is_featured,
          pricing: p.pricing && p.pricing.length > 0 ? p.pricing.map(pr => ({
            pkg_tier: pr.pkg || pr.pkg_tier || 'Standard',
            from_date: pr.from || pr.from_date || 'All Year',
            to_date: pr.to || pr.to_date || 'All Year',
            price: pr.price || ''
          })) : [{ pkg_tier: 'Standard', from_date: 'Oct 1', to_date: 'Mar 31', price: p.price_range }],
          gallery: p.galleryImages && p.galleryImages.length > 0 ? p.galleryImages : [p.main_image]
        });
        setIsEditMode(true);
        setIsModalOpen(true);
      }
    } catch (err) {
      alert('Could not fetch package details.');
    }
  };

  // Save package handler (Create or Update)
  const handleSavePackage = async (e) => {
    e.preventDefault();
    if (!pkgForm.title || !pkgForm.price_range) {
      alert('Please fill in Title and Price Range.');
      return;
    }

    setSavingPkg(true);
    try {
      const payload = {
        ...pkgForm,
        highlights: pkgForm.highlights.filter(h => h.trim() !== ''),
        includes: pkgForm.includes.filter(i => i.trim() !== ''),
        gallery: pkgForm.gallery.filter(g => g.trim() !== '')
      };

      const url = isEditMode ? `${apiUrl}/packages/${pkgForm.id}` : `${apiUrl}/packages`;
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(isEditMode ? 'Package updated successfully!' : 'New package created and saved to database!');
        setIsModalOpen(false);
        fetchData();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.message || 'Error saving package.');
      }
    } catch (err) {
      alert('Network or server error while saving package.');
      console.error(err);
    } finally {
      setSavingPkg(false);
    }
  };

  // Delete package handler
  const handleDeletePackage = async (pkgId, pkgTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${pkgTitle}" from the database?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/packages/${pkgId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`Package "${pkgTitle}" deleted from database.`);
        setPackagesList(prev => prev.filter(p => p.id !== pkgId));
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.message || 'Could not delete package.');
      }
    } catch (err) {
      alert('Error deleting package.');
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}" from the database?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`User "${userName}" deleted successfully.`);
        setUsersList(prev => prev.filter(u => u.id !== userId));
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.message || 'Could not delete user.');
      }
    } catch (err) {
      alert('Error deleting user from database.');
    }
  };

  // Helpers for dynamic repeatable lists
  const handleHighlightChange = (idx, val) => {
    const list = [...pkgForm.highlights];
    list[idx] = val;
    setPkgForm(prev => ({ ...prev, highlights: list }));
  };
  const addHighlight = () => setPkgForm(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
  const removeHighlight = (idx) => setPkgForm(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== idx) }));

  const handleIncludeChange = (idx, val) => {
    const list = [...pkgForm.includes];
    list[idx] = val;
    setPkgForm(prev => ({ ...prev, includes: list }));
  };
  const addInclude = () => setPkgForm(prev => ({ ...prev, includes: [...prev.includes, ''] }));
  const removeInclude = (idx) => setPkgForm(prev => ({ ...prev, includes: prev.includes.filter((_, i) => i !== idx) }));

  const handlePricingChange = (idx, field, val) => {
    const list = [...pkgForm.pricing];
    list[idx] = { ...list[idx], [field]: val };
    setPkgForm(prev => ({ ...prev, pricing: list }));
  };
  const addPricingTier = () => setPkgForm(prev => ({
    ...prev,
    pricing: [...prev.pricing, { pkg_tier: 'New Tier', from_date: 'Oct 1', to_date: 'Mar 31', price: '₹19,999' }]
  }));
  const removePricingTier = (idx) => setPkgForm(prev => ({ ...prev, pricing: prev.pricing.filter((_, i) => i !== idx) }));

  const handleGalleryChange = (idx, val) => {
    const list = [...pkgForm.gallery];
    list[idx] = val;
    setPkgForm(prev => ({ ...prev, gallery: list }));
  };
  const addGalleryImage = () => setPkgForm(prev => ({ ...prev, gallery: [...prev.gallery, '/assets/images/jaipur.jpg'] }));
  const removeGalleryImage = (idx) => setPkgForm(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }));

  // ── BLOG HANDLERS ──
  const handleOpenAddBlogModal = () => {
    setIsBlogEditMode(false);
    setBlogForm({
      ...defaultBlogForm,
      author: user?.name || 'Maharaja Tours'
    });
    setIsBlogModalOpen(true);
  };

  const handleOpenEditBlogModal = async (blogId) => {
    try {
      const res = await fetch(`${apiUrl}/blogs/${blogId}`);
      const data = await res.json();
      if (data.success && data.blog) {
        const b = data.blog;
        setBlogForm({
          id: b.id,
          title: b.title || '',
          slug: b.slug || '',
          image: b.image || '/assets/images/blog-1-370x270.jpg',
          author: b.author || 'Maharaja Tours',
          summary: b.summary || '',
          content: b.content || '',
          is_published: !!b.is_published
        });
        setIsBlogEditMode(true);
        setIsBlogModalOpen(true);
      } else {
        alert('Could not retrieve blog details.');
      }
    } catch (err) {
      alert('Could not fetch blog details from server.');
    }
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.title.trim()) {
      alert('Please fill in the Blog Title.');
      return;
    }

    setSavingBlog(true);
    try {
      const url = isBlogEditMode ? `${apiUrl}/blogs/${blogForm.id}` : `${apiUrl}/blogs`;
      const method = isBlogEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(blogForm)
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(isBlogEditMode ? 'Blog updated successfully!' : 'New blog article published to website!');
        setIsBlogModalOpen(false);
        fetchData();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.message || 'Error saving blog article.');
      }
    } catch (err) {
      alert('Network or server error while saving blog post.');
      console.error(err);
    } finally {
      setSavingBlog(false);
    }
  };

  const handleDeleteBlog = async (blogId, blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"? This will permanently remove it from the website.`)) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/blogs/${blogId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`Blog "${blogTitle}" deleted successfully.`);
        setBlogsList(prev => prev.filter(b => b.id !== blogId));
        setStats(prev => ({ ...prev, totalBlogs: Math.max(0, (prev.totalBlogs || 1) - 1) }));
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.message || 'Could not delete blog.');
      }
    } catch (err) {
      alert('Error deleting blog.');
    }
  };

  const handleToggleBlogPublish = async (blog) => {
    try {
      const updatedStatus = !blog.is_published;
      const res = await fetch(`${apiUrl}/blogs/${blog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_published: updatedStatus })
      });
      const data = await res.json();
      if (data.success) {
        setBlogsList(prev => prev.map(b => b.id === blog.id ? { ...b, is_published: updatedStatus } : b));
        setSuccessMsg(`Blog status changed to ${updatedStatus ? 'Published' : 'Draft'}.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert('Failed to toggle publish status.');
    }
  };

  // Filtered packages, users, and blogs
  const filteredPackages = packagesList.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.season?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = usersList.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlogs = blogsList.filter(b =>
    b.title?.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
    b.author?.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
    b.summary?.toLowerCase().includes(blogSearchTerm.toLowerCase())
  );

  return (
    <div className="admin-wrapper">
      <Navbar />

      {/* Admin Hero Bar */}
      <div className="admin-header-bar">
        <div className="admin-header-decor" />
        <div className="container">
          <div className="admin-header-inner">
            <div className="admin-title-area">
              <h1>
                <span><i className="fa fa-shield" style={{ color: '#f59e0b', marginRight: '8px' }} />Admin Control Center</span>
                <span className="admin-badge-gold">Admin Portal</span>
              </h1>
              <p className="admin-subtitle">
                Welcome, <strong>{user?.name || 'Admin'}</strong> — Manage tour packages, travel blogs, registered users, and customer bookings.
              </p>
            </div>
            <div className="admin-header-actions">
              <button
                className="admin-action-btn primary"
                onClick={handleOpenAddModal}
              >
                <i className="fa fa-plus" /> Add Package
              </button>
              <button
                className="admin-action-btn primary"
                onClick={handleOpenAddBlogModal}
                style={{ background: '#2563eb' }}
              >
                <i className="fa fa-pencil" /> Write Blog
              </button>
              <button
                className="admin-action-btn secondary"
                onClick={fetchData}
                title="Refresh database records"
              >
                <i className="fa fa-refresh" /> Refresh
              </button>
              <Link to="/blog" className="admin-action-btn secondary">
                <i className="fa fa-external-link" /> View Site Blog
              </Link>
              <button className="admin-action-btn danger" onClick={logout}>
                <i className="fa fa-sign-out" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ flex: 1, paddingBottom: '40px' }}>
        {/* Stat Metric Cards */}
        <div className="admin-stats-grid">
          <div className="stat-card-custom">
            <div className="stat-icon-wrapper rose">
              <i className="fa fa-map" />
            </div>
            <div className="stat-details">
              <span className="stat-value">{packagesList.length}</span>
              <span className="stat-label">Tour Packages</span>
            </div>
          </div>

          <div className="stat-card-custom">
            <div className="stat-icon-wrapper teal" style={{ background: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
              <i className="fa fa-pencil-square-o" />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.totalBlogs || blogsList.length}</span>
              <span className="stat-label">Travel Blogs</span>
            </div>
          </div>

          <div className="stat-card-custom">
            <div className="stat-icon-wrapper blue">
              <i className="fa fa-users" />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.totalUsers || usersList.length}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>

          <div className="stat-card-custom">
            <div className="stat-icon-wrapper green">
              <i className="fa fa-user" />
            </div>
            <div className="stat-details">
              <span className="stat-value">
                {stats.totalCustomers || usersList.filter(u => u.role === 'customer').length}
              </span>
              <span className="stat-label">Customers</span>
            </div>
          </div>

          <div className="stat-card-custom">
            <div className="stat-icon-wrapper purple">
              <i className="fa fa-calendar-check-o" />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.totalBookings || bookingsList.length}</span>
              <span className="stat-label">Bookings</span>
            </div>
          </div>

          <div className="stat-card-custom">
            <div className="stat-icon-wrapper amber">
              <i className="fa fa-comments-o" />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.totalEnquiries || enquiriesList.length}</span>
              <span className="stat-label">Enquiries</span>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa fa-exclamation-circle" /> {error}
          </div>
        )}

        {successMsg && (
          <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa fa-check-circle" /> {successMsg}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            <i className="fa fa-suitcase" />
            <span>Tour Packages</span>
            <span className="tab-badge">{packagesList.length}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'blogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            <i className="fa fa-newspaper-o" />
            <span>Travel Blogs</span>
            <span className="tab-badge">{blogsList.length}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fa fa-database" />
            <span>Registered Users</span>
            <span className="tab-badge">{usersList.length}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="fa fa-ticket" />
            <span>Bookings</span>
            <span className="tab-badge">{bookingsList.length}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('enquiries')}
          >
            <i className="fa fa-envelope-open" />
            <span>Enquiries</span>
            <span className="tab-badge">{enquiriesList.length}</span>
          </button>
        </div>

        {/* TAB 1: Tour Packages Management */}
        {activeTab === 'packages' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <i className="fa fa-map-marker" style={{ color: '#f33f3f' }} />
                <span>Tour Packages Directory (Live in Home &amp; Packages Section)</span>
              </h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div className="admin-search-box">
                  <i className="fa fa-search" />
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search package, location, season..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  className="admin-action-btn primary"
                  onClick={handleOpenAddModal}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <i className="fa fa-plus" /> Add Package
                </button>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <i className="fa fa-spinner fa-spin" />
                <p>Loading tour packages...</p>
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="empty-state">
                <i className="fa fa-suitcase" />
                <p>No packages found. Click "+ Add New Package" to create one!</p>
              </div>
            ) : (
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Image</th>
                      <th>Package Title</th>
                      <th>Places / Route</th>
                      <th>Duration</th>
                      <th>Price Range</th>
                      <th>Season</th>
                      <th>Home Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPackages.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: '700', color: '#64748b' }}>#{p.id}</td>
                        <td>
                          <img
                            src={p.main_image || '/assets/images/kerala.jpg'}
                            alt={p.title}
                            className="pkg-thumb-admin"
                            onError={(e) => { e.target.src = '/assets/images/kerala.jpg'; }}
                          />
                        </td>
                        <td>
                          <Link to={`/packages/${p.id}`} target="_blank" style={{ color: '#1e293b', fontWeight: '700', textDecoration: 'none' }}>
                            {p.title}
                          </Link>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', color: '#475569' }}>{p.location || 'India'}</span>
                        </td>
                        <td>{p.nights || 'N/A'}</td>
                        <td>
                          <strong style={{ color: '#f33f3f' }}>{p.price_range}</strong>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                            {p.season || 'All Year'}
                          </span>
                        </td>
                        <td>
                          {p.is_featured ? (
                            <span className="badge-featured"><i className="fa fa-star" style={{ marginRight: '4px' }} /> Featured</span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '12px' }}>Standard</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-edit-row"
                            onClick={() => handleOpenEditModal(p.id)}
                            title="Edit package details"
                          >
                            <i className="fa fa-pencil" /> Edit
                          </button>
                          <button
                            className="btn-delete-row"
                            onClick={() => handleDeletePackage(p.id, p.title)}
                            title="Delete package"
                          >
                            <i className="fa fa-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: Travel Blogs Management */}
        {activeTab === 'blogs' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <i className="fa fa-newspaper-o" style={{ color: '#2563eb' }} />
                <span>Travel Articles &amp; Blog Posts (Live on /blog)</span>
              </h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div className="admin-search-box">
                  <i className="fa fa-search" />
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search blogs by title, summary, author..."
                    value={blogSearchTerm}
                    onChange={(e) => setBlogSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  className="admin-action-btn primary"
                  onClick={handleOpenAddBlogModal}
                  style={{ background: '#2563eb', whiteSpace: 'nowrap' }}
                >
                  <i className="fa fa-plus" /> Write New Blog
                </button>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <i className="fa fa-spinner fa-spin" />
                <p>Loading blogs from database...</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="empty-state">
                <i className="fa fa-pencil-square-o" />
                <p>No blog articles found. Click "+ Write New Blog" to publish your first post!</p>
              </div>
            ) : (
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Cover</th>
                      <th>Article Title</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.map(b => (
                      <tr key={b.id}>
                        <td style={{ fontWeight: '700', color: '#64748b' }}>#{b.id}</td>
                        <td>
                          <img
                            src={b.image || '/assets/images/blog-1-370x270.jpg'}
                            alt={b.title}
                            className="pkg-thumb"
                            onError={(e) => { e.target.src = '/assets/images/kerala.jpg'; }}
                          />
                        </td>
                        <td style={{ maxWidth: '300px' }}>
                          <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>
                            {b.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            /{b.slug || b.id}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', color: '#334155' }}>{b.author || 'Maharaja Tours'}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleToggleBlogPublish(b)}
                            title="Click to toggle status"
                            style={{
                              padding: '3px 10px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              border: 'none',
                              cursor: 'pointer',
                              background: b.is_published ? '#dcfce7' : '#fef3c7',
                              color: b.is_published ? '#166534' : '#92400e',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: b.is_published ? '#16a34a' : '#d97706' }} />
                            {b.is_published ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                            <i className="fa fa-eye" style={{ marginRight: '4px' }} />
                            {b.views_count || 0}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: '#64748b' }}>
                          {b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="admin-table-actions">
                          <Link
                            to={`/blog/${b.slug || b.id}`}
                            target="_blank"
                            className="btn-edit-row"
                            title="View on site"
                            style={{ background: '#f1f5f9', color: '#475569' }}
                          >
                            <i className="fa fa-external-link" />
                          </Link>
                          <button
                            className="btn-edit-row"
                            onClick={() => handleOpenEditBlogModal(b.id)}
                            title="Edit blog"
                          >
                            <i className="fa fa-pencil" />
                          </button>
                          <button
                            className="btn-delete-row"
                            onClick={() => handleDeleteBlog(b.id, b.title)}
                            title="Delete blog"
                          >
                            <i className="fa fa-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Registered Users */}
        {activeTab === 'users' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <i className="fa fa-users" style={{ color: '#f33f3f' }} />
                <span>Registered Users Database (MySQL)</span>
              </h3>
              <div className="admin-search-box">
                <i className="fa fa-search" />
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <i className="fa fa-spinner fa-spin" />
                <p>Loading registered users from database...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="empty-state">
                <i className="fa fa-user-times" />
                <p>No registered users found matching your search.</p>
              </div>
            ) : (
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Registered On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => {
                      const isOwner = u.role === 'admin';
                      const initials = u.name ? u.name.substring(0, 2).toUpperCase() : 'U';
                      const createdDate = u.created_at
                        ? new Date(u.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'N/A';

                      return (
                        <tr key={u.id}>
                          <td style={{ fontWeight: '700', color: '#64748b' }}>#{u.id}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className="user-avatar-pill" style={{
                                background: isOwner ? '#fef3c7' : '#eff6ff',
                                color: isOwner ? '#b45309' : '#2563eb'
                              }}>
                                {initials}
                              </div>
                              <div>
                                <strong style={{ color: '#1e293b' }}>{u.name}</strong>
                                {isOwner && (
                                  <span style={{ fontSize: '11px', color: '#d97706', display: 'block', fontWeight: '600' }}>
                                    (Administrator)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <a href={`mailto:${u.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                              {u.email}
                            </a>
                          </td>
                          <td>{u.phone || <span style={{ color: '#94a3b8' }}>Not provided</span>}</td>
                          <td>
                            <span className={`user-role-badge ${u.role}`}>
                              <i className={u.role === 'admin' ? 'fa fa-shield' : 'fa fa-user'} style={{ marginRight: '4px' }} />
                              {u.role === 'admin' ? 'Admin' : 'Customer'}
                            </span>
                          </td>
                          <td>{createdDate}</td>
                          <td>
                            {isOwner ? (
                              <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Protected</span>
                            ) : (
                              <button
                                className="btn-delete-row"
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                title="Delete user from database"
                              >
                                <i className="fa fa-trash" /> Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Bookings */}
        {activeTab === 'bookings' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <i className="fa fa-calendar-check-o" style={{ color: '#10b981' }} />
                <span>Customer Bookings</span>
              </h3>
            </div>

            {loading ? (
              <div className="empty-state">
                <i className="fa fa-spinner fa-spin" />
                <p>Loading bookings...</p>
              </div>
            ) : bookingsList.length === 0 ? (
              <div className="empty-state">
                <i className="fa fa-calendar-o" />
                <p>No customer bookings submitted yet.</p>
              </div>
            ) : (
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Customer Name</th>
                      <th>Email &amp; Phone</th>
                      <th>Package</th>
                      <th>Pickup - Return</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsList.map(b => (
                      <tr key={b.id}>
                        <td style={{ fontWeight: '700', color: '#64748b' }}>#{b.id}</td>
                        <td><strong>{b.full_name}</strong></td>
                        <td>
                          <div>{b.email}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{b.phone}</div>
                        </td>
                        <td>{b.package_title || 'General Tour Booking'}</td>
                        <td>
                          <div style={{ fontSize: '13px' }}><strong>From:</strong> {b.pickup_location || 'N/A'} ({b.pickup_date || ''})</div>
                          <div style={{ fontSize: '13px' }}><strong>To:</strong> {b.return_location || 'N/A'} ({b.return_date || ''})</div>
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            background: b.status === 'confirmed' ? '#dcfce7' : '#fef3c7',
                            color: b.status === 'confirmed' ? '#166534' : '#92400e'
                          }}>
                            {b.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <i className="fa fa-envelope-open" style={{ color: '#f59e0b' }} />
                <span>Tour Enquiries</span>
              </h3>
            </div>

            {loading ? (
              <div className="empty-state">
                <i className="fa fa-spinner fa-spin" />
                <p>Loading enquiries...</p>
              </div>
            ) : enquiriesList.length === 0 ? (
              <div className="empty-state">
                <i className="fa fa-inbox" />
                <p>No package enquiries received yet.</p>
              </div>
            ) : (
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Package</th>
                      <th>Message</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiriesList.map(e => (
                      <tr key={e.id}>
                        <td style={{ fontWeight: '700', color: '#64748b' }}>#{e.id}</td>
                        <td><strong>{e.name}</strong></td>
                        <td>
                          <div>{e.email}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{e.phone}</div>
                        </td>
                        <td>{e.package_title || 'General Enquiry'}</td>
                        <td style={{ maxWidth: '300px' }}>{e.message}</td>
                        <td style={{ fontSize: '12px', color: '#64748b' }}>
                          {e.created_at ? new Date(e.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── ADD / EDIT PACKAGE MODAL ── */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="admin-modal-container">
            <div className="admin-modal-header">
              <h3>
                <i className={`fa ${isEditMode ? 'fa-pencil-square-o' : 'fa-plus-circle'}`} style={{ color: '#f33f3f' }} />
                <span>{isEditMode ? 'Edit Tour Package' : 'Add New Tour Package'}</span>
              </h3>
              <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSavePackage} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="admin-modal-body">
                {/* Basic Details */}
                <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  1. General Package Information
                </h5>

                <div className="pkg-form-grid">
                  <div className="pkg-form-group full-width">
                    <label className="pkg-form-label">Package Title *</label>
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="e.g. Kerala Backwaters & Hills Escape"
                      value={pkgForm.title}
                      onChange={(e) => setPkgForm({ ...pkgForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Price Range / Starting Price *</label>
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="e.g. ₹18,999 - ₹28,999"
                      value={pkgForm.price_range}
                      onChange={(e) => setPkgForm({ ...pkgForm, price_range: e.target.value })}
                      required
                    />
                  </div>

                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Duration (Nights &amp; Days)</label>
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="e.g. 6 Nights / 7 Days"
                      value={pkgForm.nights}
                      onChange={(e) => setPkgForm({ ...pkgForm, nights: e.target.value })}
                    />
                  </div>

                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Best Season to Visit</label>
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="e.g. Oct – Mar"
                      value={pkgForm.season}
                      onChange={(e) => setPkgForm({ ...pkgForm, season: e.target.value })}
                    />
                  </div>

                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Places Covered / Location Route</label>
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="e.g. Kochi – Munnar – Alleppey – Kovalam, Kerala"
                      value={pkgForm.location}
                      onChange={(e) => setPkgForm({ ...pkgForm, location: e.target.value })}
                    />
                  </div>
                </div>

                {/* Media & Images */}
                <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginTop: '16px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  2. Images &amp; Location Map
                </h5>

                <div className="pkg-form-grid">
                  <div className="pkg-form-group full-width">
                    <label className="pkg-form-label">Main Image URL or Asset Path</label>
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="e.g. /assets/images/kerala.jpg or https://images.unsplash.com/..."
                      value={pkgForm.main_image}
                      onChange={(e) => setPkgForm({ ...pkgForm, main_image: e.target.value })}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Quick image presets:</span>
                      {['/assets/images/kerala.jpg', '/assets/images/jaipur.jpg', '/assets/images/goa-1.jpg', '/assets/images/kashmir.jpg', '/assets/images/manali.jpg', '/assets/images/shimla.jpg', '/assets/images/jeselmer.avif'].map(img => (
                        <button
                          key={img}
                          type="button"
                          onClick={() => setPkgForm({ ...pkgForm, main_image: img })}
                          style={{ fontSize: '11px', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          {img.split('/').pop()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pkg-form-group full-width">
                    <label className="pkg-form-label">Google Maps Embed URL</label>
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      value={pkgForm.map_src}
                      onChange={(e) => setPkgForm({ ...pkgForm, map_src: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginTop: '16px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  3. Tour Overview &amp; Description
                </h5>

                <div className="pkg-form-group full-width">
                  <textarea
                    className="pkg-form-textarea"
                    placeholder="Provide detailed description of the tour experience, destinations, and activities..."
                    value={pkgForm.description}
                    onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* Highlights */}
                <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginTop: '16px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  4. Key Tour Highlights (Bullet Points)
                </h5>

                {pkgForm.highlights.map((h, i) => (
                  <div key={i} className="repeatable-item-row">
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder={`Highlight #${i + 1} (e.g. Overnight houseboat stay on Alleppey Backwaters)`}
                      value={h}
                      onChange={(e) => handleHighlightChange(i, e.target.value)}
                    />
                    {pkgForm.highlights.length > 1 && (
                      <button type="button" className="btn-remove-item" onClick={() => removeHighlight(i)} title="Remove highlight">
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add-item" onClick={addHighlight}>
                  <i className="fa fa-plus" /> Add Another Highlight
                </button>

                {/* Inclusions */}
                <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  5. What's Included in Package (Includes)
                </h5>

                {pkgForm.includes.map((inc, i) => (
                  <div key={i} className="repeatable-item-row">
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder={`Included feature #${i + 1} (e.g. Private AC vehicle with chauffeur)`}
                      value={inc}
                      onChange={(e) => handleIncludeChange(i, e.target.value)}
                    />
                    {pkgForm.includes.length > 1 && (
                      <button type="button" className="btn-remove-item" onClick={() => removeInclude(i)} title="Remove inclusion">
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add-item" onClick={addInclude}>
                  <i className="fa fa-plus" /> Add Another Inclusion
                </button>

                {/* Pricing Tiers Table */}
                <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  6. Pricing Tiers (Standard, Deluxe, Premium, Family)
                </h5>

                {pkgForm.pricing.map((tier, i) => (
                  <div key={i} className="pricing-tier-grid">
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="Tier Name (e.g. Standard 3-Star)"
                      value={tier.pkg_tier}
                      onChange={(e) => handlePricingChange(i, 'pkg_tier', e.target.value)}
                    />
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="From (e.g. Oct 1)"
                      value={tier.from_date}
                      onChange={(e) => handlePricingChange(i, 'from_date', e.target.value)}
                    />
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="To (e.g. Mar 31)"
                      value={tier.to_date}
                      onChange={(e) => handlePricingChange(i, 'to_date', e.target.value)}
                    />
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="Price (e.g. ₹18,999 per person)"
                      value={tier.price}
                      onChange={(e) => handlePricingChange(i, 'price', e.target.value)}
                    />
                    {pkgForm.pricing.length > 1 && (
                      <button type="button" className="btn-remove-item" onClick={() => removePricingTier(i)} title="Remove tier">
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add-item" onClick={addPricingTier}>
                  <i className="fa fa-plus" /> Add Pricing Tier
                </button>

                {/* Gallery Images */}
                <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginTop: '20px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  7. Gallery Image URLs
                </h5>

                {pkgForm.gallery.map((g, i) => (
                  <div key={i} className="repeatable-item-row">
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="Image URL or Path (/assets/images/...)"
                      value={g}
                      onChange={(e) => handleGalleryChange(i, e.target.value)}
                    />
                    {pkgForm.gallery.length > 1 && (
                      <button type="button" className="btn-remove-item" onClick={() => removeGalleryImage(i)} title="Remove gallery image">
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add-item" onClick={addGalleryImage}>
                  <i className="fa fa-plus" /> Add Gallery Image
                </button>

                {/* Featured Status Toggle */}
                <div style={{ marginTop: '24px', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    id="is_featured_chk"
                    checked={pkgForm.is_featured}
                    onChange={(e) => setPkgForm({ ...pkgForm, is_featured: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="is_featured_chk" style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0, cursor: 'pointer' }}>
                    Feature this package on the Home Page top recommendations
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-action-btn secondary"
                  style={{ color: '#475569', background: '#e2e8f0' }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-action-btn primary"
                  disabled={savingPkg}
                >
                  {savingPkg ? (
                    <>
                      <i className="fa fa-spinner fa-spin" /> Saving to Database...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check" /> {isEditMode ? 'Update Package' : 'Save & Publish Package'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT BLOG MODAL ── */}
      {isBlogModalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsBlogModalOpen(false); }}>
          <div className="admin-modal-container" style={{ maxWidth: '800px' }}>
            <div className="admin-modal-header">
              <h3>
                <i className={`fa ${isBlogEditMode ? 'fa-pencil-square-o' : 'fa-pencil'}`} style={{ color: '#2563eb' }} />
                <span>{isBlogEditMode ? 'Edit Blog Article' : 'Write New Travel Blog'}</span>
              </h3>
              <button className="admin-modal-close" onClick={() => setIsBlogModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveBlog} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="admin-modal-body">
                {/* General Info */}
                <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  1. Article Details
                </h5>

                <div className="pkg-form-grid">
                  <div className="pkg-form-group full-width">
                    <label className="pkg-form-label">Blog Title *</label>
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="e.g. 10 Must-Visit Hidden Gems in Kerala That Most Tourists Miss"
                      value={blogForm.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setBlogForm(prev => ({
                          ...prev,
                          title: newTitle,
                          slug: !isBlogEditMode || !prev.slug
                            ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                            : prev.slug
                        }));
                      }}
                      required
                    />
                  </div>

                  <div className="pkg-form-group">
                    <label className="pkg-form-label">URL Slug (Friendly URL)</label>
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="e.g. 10-must-visit-hidden-gems-in-kerala"
                      value={blogForm.slug}
                      onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    />
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Public URL: /blog/{blogForm.slug || 'slug'}</span>
                  </div>

                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Author Name</label>
                    <input
                      type="text"
                      className="pkg-form-input"
                      placeholder="e.g. Maharaja Tours Team"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    />
                  </div>
                </div>

                {/* Featured Image */}
                <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginTop: '16px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  2. Cover / Featured Image
                </h5>

                <div className="pkg-form-group full-width">
                  <label className="pkg-form-label">Image URL or Asset Path</label>
                  <input
                    type="text"
                    className="pkg-form-input"
                    placeholder="e.g. /assets/images/blog-1-370x270.jpg or https://images.unsplash.com/..."
                    value={blogForm.image}
                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center' }}>Presets:</span>
                    {[
                      { name: 'Blog 1 (Kerala)', path: '/assets/images/blog-1-370x270.jpg' },
                      { name: 'Blog 2 (Rajasthan)', path: '/assets/images/blog-2-370x270.jpg' },
                      { name: 'Blog 3 (Kashmir)', path: '/assets/images/blog-3-370x270.jpg' },
                      { name: 'Blog 4 (Manali)', path: '/assets/images/blog-4-370x270.jpg' },
                      { name: 'Blog 5 (Food)', path: '/assets/images/blog-5-370x270.jpg' },
                      { name: 'Blog 6 (Tips)', path: '/assets/images/blog-6-370x270.jpg' },
                      { name: 'Goa Coast', path: '/assets/images/goa-1.jpg' },
                      { name: 'Kashmir Valley', path: '/assets/images/kashmir-2.jpg' },
                    ].map(preset => (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => setBlogForm({ ...blogForm, image: preset.path })}
                        style={{
                          fontSize: '11px',
                          background: blogForm.image === preset.path ? '#2563eb' : '#f1f5f9',
                          color: blogForm.image === preset.path ? '#fff' : '#334155',
                          border: '1px solid #cbd5e1',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary / Excerpt */}
                <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginTop: '16px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  3. Summary / Short Excerpt
                </h5>

                <div className="pkg-form-group full-width">
                  <textarea
                    className="pkg-form-textarea"
                    placeholder="Brief 1-2 sentence teaser shown on the blog cards and search listings..."
                    value={blogForm.summary}
                    onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                    rows={2}
                  />
                </div>

                {/* Full Content */}
                <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginTop: '16px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  4. Full Article Story / Content
                </h5>

                <div className="pkg-form-group full-width">
                  <textarea
                    className="pkg-form-textarea"
                    placeholder="Write your complete travel story, advice, itinerary tips, and highlights here. Use blank lines between paragraphs..."
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    rows={8}
                    style={{ minHeight: '180px', lineHeight: '1.6' }}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Tip: Separate paragraphs with blank lines. They will be formatted cleanly on the reader page.
                  </span>
                </div>

                {/* Published Status Toggle */}
                <div style={{ marginTop: '20px', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    id="is_blog_published_chk"
                    checked={blogForm.is_published}
                    onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="is_blog_published_chk" style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0, cursor: 'pointer' }}>
                    Publish this blog live on the website immediately (Uncheck to save as Draft)
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-action-btn secondary"
                  style={{ color: '#475569', background: '#e2e8f0' }}
                  onClick={() => setIsBlogModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-action-btn primary"
                  style={{ background: '#2563eb' }}
                  disabled={savingBlog}
                >
                  {savingBlog ? (
                    <>
                      <i className="fa fa-spinner fa-spin" /> Publishing...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check" /> {isBlogEditMode ? 'Update Blog Article' : 'Publish Blog to Website'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
