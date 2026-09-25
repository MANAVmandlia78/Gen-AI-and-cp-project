import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isMoreActive = ['/about', '/terms'].includes(location.pathname);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setNavOpen(false);
    setDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const closeAll = () => {
    setNavOpen(false);
    setDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeAll();
    navigate('/');
  };

  // On the home page: transparent until scrolled; on other pages always solid
  const solidBg = !isHomePage || scrolled;

  return (
    <header className={solidBg ? 'background-header' : ''} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999 }}>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/" onClick={closeAll}>
            <h2>Maharaja Tours <em>&amp; Travels</em></h2>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setNavOpen(prev => !prev)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse${navOpen ? ' open' : ''}`} id="navbarResponsive">
            <ul className="navbar-nav ml-auto" style={{ alignItems: 'center' }}>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/"
                  end
                  onClick={closeAll}
                >
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/ai-planner"
                  onClick={closeAll}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#f59e0b',
                    fontWeight: '700'
                  }}
                >
                  <i className="fa fa-sparkles" style={{ fontSize: '12px' }} />
                  <span>AI Planner</span>
                  <span style={{
                    fontSize: '9.5px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(135deg, #f33f3f 0%, #f59e0b 100%)',
                    color: '#fff',
                    padding: '1px 6px',
                    borderRadius: '8px',
                    fontWeight: '800'
                  }}>New</span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/packages"
                  onClick={closeAll}
                >
                  Packages
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/blog"
                  onClick={closeAll}
                >
                  Blog
                </NavLink>
              </li>

              <li className={`nav-item dropdown${dropdownOpen ? ' open' : ''}${isMoreActive ? ' active' : ''}`}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  onClick={(e) => { e.preventDefault(); setDropdownOpen(prev => !prev); }}
                >
                  More
                </a>
                <div className="dropdown-menu">
                  <NavLink
                    className={({ isActive }) => `dropdown-item${isActive ? ' active' : ''}`}
                    to="/about"
                    onClick={closeAll}
                  >
                    About Us
                  </NavLink>
                  <NavLink
                    className={({ isActive }) => `dropdown-item${isActive ? ' active' : ''}`}
                    to="/terms"
                    onClick={closeAll}
                  >
                    Terms
                  </NavLink>
                </div>
              </li>

              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/contact"
                  onClick={closeAll}
                >
                  Contact Us
                </NavLink>
              </li>

              {/* Admin Panel Link - ONLY visible to Admin */}
              {isAdmin && (
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                    to="/admin"
                    onClick={closeAll}
                    style={{
                      color: '#f59e0b',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fa fa-shield" style={{ fontSize: '13px' }} />
                    <span>Admin</span>
                  </NavLink>
                </li>
              )}

              {/* Authentication Buttons / Profile Dropdown */}
              {!isAuthenticated ? (
                <>
                  <li className="nav-item" style={{ marginLeft: '6px' }}>
                    <NavLink
                      className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                      to="/login"
                      onClick={closeAll}
                    >
                      Login
                    </NavLink>
                  </li>

                  <li className="nav-item" style={{ marginLeft: '4px' }}>
                    <Link
                      to="/register"
                      onClick={closeAll}
                      style={{
                        padding: '7px 18px',
                        background: '#f33f3f',
                        color: '#fff',
                        borderRadius: '20px',
                        fontWeight: '600',
                        fontSize: '13px',
                        textDecoration: 'none',
                        display: 'inline-block',
                        boxShadow: '0 2px 8px rgba(243, 63, 63, 0.3)',
                        transition: 'all 0.2s'
                      }}
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <li className={`nav-item dropdown${userDropdownOpen ? ' open' : ''}`} style={{ marginLeft: '10px' }}>
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: isAdmin ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.12)',
                      padding: '5px 14px',
                      borderRadius: '20px',
                      color: '#fff',
                      border: isAdmin ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(255, 255, 255, 0.18)'
                    }}
                    onClick={(e) => { e.preventDefault(); setUserDropdownOpen(prev => !prev); }}
                  >
                    <i className={isAdmin ? 'fa fa-shield' : 'fa fa-user-circle'} style={{ fontSize: '14px', color: isAdmin ? '#f59e0b' : '#fff' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.name || 'Account'}
                    </span>
                  </a>

                  <div className="dropdown-menu dropdown-menu-right" style={{ minWidth: '200px', right: 0, left: 'auto' }}>
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block' }}>{user?.name}</strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{user?.email}</span>
                      <div style={{ marginTop: '6px' }}>
                        <span style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: isAdmin ? '#fef3c7' : '#dcfce7',
                          color: isAdmin ? '#92400e' : '#166534',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <i className={isAdmin ? 'fa fa-shield' : 'fa fa-user'} style={{ fontSize: '9px' }} />
                          {isAdmin ? 'Admin' : 'Customer'}
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <NavLink
                        className="dropdown-item"
                        to="/admin"
                        onClick={closeAll}
                        style={{ color: '#d97706', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <i className="fa fa-th-large" /> Admin Control Panel
                      </NavLink>
                    )}

                    <button
                      className="dropdown-item"
                      onClick={handleLogout}
                      style={{
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <i className="fa fa-sign-out" /> Logout
                    </button>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
