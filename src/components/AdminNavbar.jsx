import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

const IconProfile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="9" r="3"/>
    <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"/>
  </svg>
);

const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconInfo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8"  x2="12.01" y2="8"/>
  </svg>
);

function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleOutsideClick = useCallback((e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setProfileOpen(false);
    }
  }, []);

  useEffect(() => {
    if (profileOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [profileOpen, handleOutsideClick]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-inner">
        {/* Brand */}
        <div className="admin-navbar-left">
          <Link to="/admin/dashboard" className="admin-brand-text">
            BARA RIMBA RENT
            <span className="admin-badge-role">ADMIN</span>
          </Link>
        </div>

        {/* Center Tabs */}
        <div className="admin-navbar-center">
          <Link
            to="/admin/dashboard"
            className={`admin-nav-tab${isActive('/admin/dashboard') ? ' active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className={`admin-nav-tab${isActive('/admin/products') ? ' active' : ''}`}
          >
            Produk
          </Link>
          <Link
            to="/admin/orders"
            className={`admin-nav-tab${isActive('/admin/orders') ? ' active' : ''}`}
          >
            Pesanan
          </Link>
        </div>

        {/* Right Actions */}
        <div className="admin-navbar-right">
          <button className="admin-icon-btn" aria-label="Informasi" title="Informasi" id="admin-nav-info" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', borderRadius: '8px' }}>
            <IconInfo />
          </button>

          <div className="admin-profile-wrap" ref={profileRef}>
            <button
              className={`admin-profile-btn${profileOpen ? ' active' : ''}`}
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-label="Menu Admin"
            >
              <div className="admin-avatar">
                <IconProfile />
              </div>
              <span className="admin-profile-name">Admin</span>
              <IconChevronDown />
            </button>

            {profileOpen && (
              <div className="admin-profile-dropdown">
                <div className="admin-profile-dropdown-header">
                  <p className="admin-profile-title">Admin Bara Rimba</p>
                  <p className="admin-profile-sub">admin@bara.com</p>
                </div>
                <div className="admin-profile-dropdown-divider" />
                <button className="admin-logout-btn" onClick={handleLogout}>
                  <IconLogout />
                  <span>Keluar / Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
