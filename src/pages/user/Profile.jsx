import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Profile.css';

// SVG Icons
const IconCart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const IconInfo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const IconHistory = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconProfile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="9" r="3"/>
    <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"/>
  </svg>
);

const IconEdit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconCamera = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const DEFAULT_PROFILE = {
  name: 'Bara Camper',
  username: 'baracamper',
  email: 'camper@bararimba.com',
  phone: '0812-3456-7890',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  memberSince: 'Januari 2026',
  role: 'Customer Premium',
};

function Profile() {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  // Load profile from localStorage or default
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sync formData when entering edit mode
  const handleStartEdit = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser(formData);
    localStorage.setItem('currentUser', JSON.stringify(formData));
    window.dispatchEvent(new Event('bara_user_updated'));
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="profile-page">
      {/* ── NAVBAR ── */}
      <nav className="profile-navbar">
        <div className="profile-navbar-inner">
          <Link to="/dashboard" className="profile-brand-text">BARA RIMBA RENT</Link>
          <div className="profile-navbar-right">
            <Link to="/cart" className="profile-icon-btn" aria-label="Keranjang" id="profile-nav-cart">
              <IconCart />
              {totalItems > 0 && <span className="dash-cart-badge">{totalItems}</span>}
            </Link>
            <Link to="/riwayat" className="profile-icon-btn" aria-label="Riwayat Pesanan" title="Riwayat Pesanan" id="profile-nav-history">
              <IconHistory />
            </Link>
            <Link to="/information" className="profile-icon-btn" aria-label="Informasi" id="profile-nav-info">
              <IconInfo />
            </Link>
            <Link to="/profile" className="profile-icon-btn active" aria-label="Profil" id="profile-nav-profile">
              <IconProfile />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div className="profile-content">
        <div className="profile-header-section">
          <h1 className="profile-main-title">PROFIL SAYA</h1>
          <p className="profile-main-subtitle">
            Kelola informasi data diri dan pengaturan akun pelanggan Anda.
          </p>
        </div>

        {/* Alert Success Notification */}
        {showSuccess && (
          <div className="profile-alert-success" role="alert">
            <IconCheck />
            <span>Perubahan data profil berhasil disimpan!</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="profile-container-grid">
          {/* LEFT SIDEBAR CARD */}
          <div className="profile-sidebar-card">
            <div className="profile-avatar-wrapper">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              {isEditing && (
                <button
                  type="button"
                  className="profile-avatar-edit-btn"
                  title="Ganti Foto Avatar"
                  onClick={() => {
                    const newUrl = prompt('Masukkan URL foto profil baru:', user.avatar);
                    if (newUrl !== null) {
                      setFormData((prev) => ({ ...prev, avatar: newUrl.trim() }));
                    }
                  }}
                >
                  <IconCamera />
                </button>
              )}
            </div>

            <h2 className="profile-user-name">{user.name}</h2>
            <p className="profile-user-handle">@{user.username}</p>
            <span className="profile-member-badge">{user.role || 'Customer Active'}</span>

            <div className="profile-sidebar-divider" />

            <div className="profile-sidebar-info-list">
              <div className="profile-info-mini-item">
                <span className="profile-info-mini-icon"><IconMail /></span>
                <span>{user.email}</span>
              </div>
              <div className="profile-info-mini-item">
                <span className="profile-info-mini-icon"><IconPhone /></span>
                <span>{user.phone}</span>
              </div>
              <div className="profile-info-mini-item">
                <span className="profile-info-mini-icon">🗓️</span>
                <span>Bergabung: {user.memberSince || '2026'}</span>
              </div>
            </div>

            <button
              id="profile-logout-btn"
              type="button"
              className="profile-logout-btn"
              onClick={() => setShowLogoutModal(true)}
            >
              <IconLogout />
              <span>Keluar dari Akun</span>
            </button>
          </div>

          {/* RIGHT DETAIL CARD / FORM */}
          <div className="profile-detail-card">
            <div className="profile-card-header">
              <h2 className="profile-card-title">
                <IconUser /> Informasi Akun
              </h2>
              {!isEditing && (
                <button
                  id="profile-edit-btn"
                  type="button"
                  className="profile-edit-toggle-btn"
                  onClick={handleStartEdit}
                >
                  <IconEdit />
                  <span>Edit Profil</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSave}>
              <div className="profile-form-grid">
                {/* Nama Lengkap */}
                <div className="profile-field-group">
                  <label className="profile-label" htmlFor="profile-name">Nama Lengkap</label>
                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    className="profile-input"
                    value={isEditing ? formData.name : user.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                {/* Username */}
                <div className="profile-field-group">
                  <label className="profile-label" htmlFor="profile-username">Username</label>
                  <input
                    id="profile-username"
                    type="text"
                    name="username"
                    className="profile-input"
                    value={isEditing ? formData.username : user.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                {/* Email */}
                <div className="profile-field-group">
                  <label className="profile-label" htmlFor="profile-email">Alamat Email</label>
                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    className="profile-input"
                    value={isEditing ? formData.email : user.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                {/* Nomor Telepon */}
                <div className="profile-field-group">
                  <label className="profile-label" htmlFor="profile-phone">Nomor WhatsApp / HP</label>
                  <input
                    id="profile-phone"
                    type="text"
                    name="phone"
                    className="profile-input"
                    value={isEditing ? formData.phone : user.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              {/* Action Buttons in Edit Mode */}
              {isEditing && (
                <div className="profile-action-bar">
                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={handleCancelEdit}
                  >
                    Batal
                  </button>
                  <button
                    id="profile-save-btn"
                    type="submit"
                    className="profile-save-btn"
                  >
                    <IconCheck />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ── LOGOUT MODAL ── */}
      {showLogoutModal && (
        <div className="profile-modal-overlay" role="dialog" aria-modal="true">
          <div className="profile-modal-card">
            <div className="profile-modal-icon">
              <IconLogout />
            </div>
            <h3 className="profile-modal-title">Konfirmasi Logout</h3>
            <p className="profile-modal-text">
              Apakah Anda yakin ingin keluar dari akun Bara Rimba Rent?
            </p>
            <div className="profile-modal-actions">
              <button
                type="button"
                className="profile-modal-btn-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Batal
              </button>
              <button
                id="profile-modal-logout-confirm"
                type="button"
                className="profile-modal-btn-confirm"
                onClick={handleConfirmLogout}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
