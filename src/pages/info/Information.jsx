import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './InfoPages.css';

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

const IconProfile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="9" r="3"/>
    <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"/>
  </svg>
);

// Card Icons
const IconFileText = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconClipboard = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <path d="M9 12h6"/><path d="M9 16h6"/>
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconClock = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconMapPin = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconMessageSquare = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

function Information() {
  const { totalItems } = useCart();

  const INFO_CARDS = [
    {
      id: 'cara-penyewaan',
      title: 'Cara Penyewaan',
      desc: 'Langkah-langkah mudah menyewa peralatan camping & BBQ di Bara Rimba Rent.',
      icon: <IconFileText />,
      link: '/information/cara-penyewaan',
    },
    {
      id: 'aturan-rental',
      title: 'Aturan Rental',
      desc: 'Syarat dan ketentuan umum yang berlaku untuk semua transaksi penyewaan.',
      icon: <IconClipboard />,
      link: '/information/aturan-rental',
    },
    {
      id: 'denda-kerusakan',
      title: 'Denda & Kerusakan',
      desc: 'Ketentuan sanksi dan penggantian biaya untuk kerusakan atau kehilangan unit.',
      icon: <IconAlertTriangle />,
      link: '/information/denda-kerusakan',
    },
    {
      id: 'keterlambatan',
      title: 'Keterlambatan',
      desc: 'Aturan dan konsekuensi biaya tambahan atas keterlambatan pengembalian barang.',
      icon: <IconClock />,
      link: '/information/keterlambatan',
    },
    {
      id: 'lokasi-rental',
      title: 'Lokasi Rental',
      desc: 'Alamat lengkap, peta petunjuk arah, dan titik penjemputan barang rental.',
      icon: <IconMapPin />,
      link: '/information/lokasi-rental',
    },
    {
      id: 'hubungi-kami',
      title: 'Hubungi Kami',
      desc: 'Layanan bantuan pelanggan via WhatsApp, telepon, atau media sosial.',
      icon: <IconMessageSquare />,
      link: '/information/hubungi-kami',
    },
  ];

  return (
    <div className="info-page">
      {/* ── NAVBAR ── */}
      <nav className="info-navbar">
        <div className="info-navbar-inner">
          <Link to="/dashboard" className="info-brand-text">BARA RIMBA RENT</Link>
          <div className="info-navbar-right">
            <Link to="/cart" className="info-icon-btn" aria-label="Keranjang" id="info-nav-cart">
              <IconCart />
              {totalItems > 0 && (
                <span className="dash-cart-badge">{totalItems}</span>
              )}
            </Link>
            <Link to="/information" className="info-icon-btn active" aria-label="Informasi" id="info-nav-info">
              <IconInfo />
            </Link>
            <Link to="/profile" className="info-icon-btn" aria-label="Profil" id="info-nav-profile">
              <IconProfile />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div className="info-content">
        {/* Header */}
        <div className="info-header-section">
          <h1 className="info-main-title">INFORMASI</h1>
          <p className="info-main-subtitle">
            Temukan informasi lengkap mengenai cara penyewaan, aturan, dan layanan kami.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="info-grid">
          {INFO_CARDS.map((card) => (
            <Link key={card.id} to={card.link} className="info-card" id={`info-card-${card.id}`}>
              <div className="info-card-icon-wrap">{card.icon}</div>
              <h2 className="info-card-title">{card.title}</h2>
              <p className="info-card-desc">{card.desc}</p>
              <div className="info-card-arrow">
                <span>Lihat Detail</span>
                <IconArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Information;
