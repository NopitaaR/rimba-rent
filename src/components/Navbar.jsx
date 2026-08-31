import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

// ── Icons ──────────────────────────────────────────────
const IconCampfire = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26-.77.74zM11.71 19c-1.78-.02-3.47-1.13-4.19-2.76 0 0 1.17.3 2.04-.43.86-.73.62-1.81.62-1.81.88.26 1.56.82 2.14 1.48.33-.26.57-.66.38-1.34-.01-.07-.08-.41-.08-.41.81.32 1.63.88 1.85 1.76.22.93-.08 1.87-.69 2.56C13.16 18.8 12.44 19 11.71 19z"/>
  </svg>
);

const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconHistory = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4"/>
  </svg>
);

const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ── Helpers ────────────────────────────────────────────
const getInitials = (name = '') =>
  name.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

// ── Component ──────────────────────────────────────────
/**
 * Navbar component
 * @param {{ user?: { nama: string, email: string } }} props
 *   Pass `user` prop when the user is logged in.
 *   Omit (or pass null) for the guest/public version.
 */
function Navbar({ user = null }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMobile = () => setMobileOpen((v) => !v);
  const closeMobile = () => setMobileOpen(false);
  const toggleDropdown = () => setDropdownOpen((v) => !v);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    closeMobile();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/dashboard" className="navbar-brand" onClick={closeMobile}>
          <div className="navbar-brand-icon"><IconCampfire /></div>
          <div className="navbar-brand-text">
            <span className="navbar-brand-name">Bara Rimba Rent</span>
            <span className="navbar-brand-tagline">Camping &amp; BBQ</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="navbar-links">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Beranda
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Produk
          </NavLink>
        </div>

        {/* Desktop right-side actions */}
        <div className="navbar-actions">
          {user ? (
            /* ── LOGGED-IN: user avatar + dropdown ── */
            <div className="navbar-user" ref={dropdownRef}>
              <button
                id="navbar-user-btn"
                className="navbar-user-btn"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <div className="navbar-user-avatar">{getInitials(user.nama)}</div>
                <span className="navbar-user-name">{user.nama.split(' ')[0]}</span>
                <span className={`navbar-user-chevron${dropdownOpen ? ' open' : ''}`}>
                  <IconChevronDown />
                </span>
              </button>

              {dropdownOpen && (
                <div className="navbar-dropdown" role="menu">
                  <div className="navbar-dropdown-header">
                    <div className="navbar-dropdown-name">{user.nama}</div>
                    <div className="navbar-dropdown-email">{user.email}</div>
                  </div>
                  <div className="navbar-dropdown-items">
                    <Link to="/profile" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <IconUser /> Profil Saya
                    </Link>
                    <Link to="/riwayat" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <IconHistory /> Riwayat Sewa
                    </Link>
                    <div className="navbar-dropdown-divider" />
                    <button className="navbar-dropdown-item danger" onClick={handleLogout}>
                      <IconLogout /> Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── GUEST: masuk / daftar ── */
            <>
              <Link to="/" className="btn-nav-outline">Masuk</Link>
              <Link to="/register" className="btn-nav-solid">Daftar</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="navbar-hamburger"
          onClick={toggleMobile}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar-mobile-menu${mobileOpen ? ' open' : ''}`}>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={closeMobile}>
          Beranda
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={closeMobile}>
          Produk
        </NavLink>

        {user ? (
          /* Mobile logged-in section */
          <div className="navbar-mobile-user">
            <div className="navbar-mobile-user-info">
              <div className="navbar-user-avatar">{getInitials(user.nama)}</div>
              <div className="navbar-mobile-user-texts">
                <span className="navbar-dropdown-name">{user.nama}</span>
                <span className="navbar-dropdown-email">{user.email}</span>
              </div>
            </div>
            <Link to="/profile" className="navbar-dropdown-item" onClick={closeMobile}>
              <IconUser /> Profil Saya
            </Link>
            <Link to="/riwayat" className="navbar-dropdown-item" onClick={closeMobile}>
              <IconHistory /> Riwayat Sewa
            </Link>
            <button className="navbar-mobile-logout" onClick={handleLogout}>
              <IconLogout /> Keluar
            </button>
          </div>
        ) : (
          <div className="navbar-mobile-actions">
            <Link to="/" className="btn-nav-outline" onClick={closeMobile}>Masuk</Link>
            <Link to="/register" className="btn-nav-solid" onClick={closeMobile}>Daftar</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
