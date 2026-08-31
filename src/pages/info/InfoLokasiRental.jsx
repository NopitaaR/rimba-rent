import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './InfoPages.css';

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

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconMapPin = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconExternalLink = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

function InfoLokasiRental() {
  const { totalItems } = useCart();

  return (
    <div className="info-page">
      {/* ── NAVBAR ── */}
      <nav className="info-navbar">
        <div className="info-navbar-inner">
          <Link to="/dashboard" className="info-brand-text">BARA RIMBA RENT</Link>
          <div className="info-navbar-right">
            <Link to="/cart" className="info-icon-btn" aria-label="Keranjang" id="info-nav-cart">
              <IconCart />
              {totalItems > 0 && <span className="dash-cart-badge">{totalItems}</span>}
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
        <Link to="/information" className="info-back-btn" id="info-back-btn">
          <IconArrowLeft />
          <span>Kembali ke Informasi</span>
        </Link>

        <div className="info-detail-header">
          <h1 className="info-detail-title">LOKASI RENTAL</h1>
          <p className="info-detail-subtitle">
            Alamat fisik store, petunjuk arah penjemputan, dan jam operasional layanan kami.
          </p>
        </div>

        {/* Two-Column Section */}
        <div className="info-two-col">
          {/* Card 1: Informasi Alamat */}
          <div className="info-section-card">
            <span className="info-tag success">BASECAMP UTAMA</span>
            <div className="info-section-header">
              <h2 className="info-section-title">
                <IconMapPin /> Bara Rimba Rent Store
              </h2>
            </div>
            
            <div className="info-contact-list">
              <div className="info-contact-item">
                <div className="info-contact-icon">📍</div>
                <div>
                  <p className="info-contact-label">Alamat Lengkap</p>
                  <p className="info-contact-value">
                    Jl. Rimba Raya No. 45, Kecamatan Camp Outdoor, Kota Bandung, Jawa Barat 40123
                  </p>
                </div>
              </div>

              <div className="info-contact-item">
                <div className="info-contact-icon">⏰</div>
                <div>
                  <p className="info-contact-label">Jam Operasional Toko</p>
                  <p className="info-contact-value">
                    08:00 – 21:00 WIB (Buka Setiap Hari)
                  </p>
                </div>
              </div>

              <div className="info-contact-item">
                <div className="info-contact-icon">🚗</div>
                <div>
                  <p className="info-contact-label">Petunjuk Akses</p>
                  <p className="info-contact-value">
                    Berjarak 5 menit dari pusat kota, berada di samping Kedai Kopi Rimba. Parkir luas untuk kendaraan motor dan mobil.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Peta Visual Placeholder */}
          <div className="info-section-card">
            <span className="info-tag info">PETA PETUNJUK ARAH</span>
            <div className="info-section-header">
              <h2 className="info-section-title">
                <IconMapPin /> Titik Pengambilan Barang
              </h2>
            </div>

            <div className="info-map-placeholder">
              <IconMapPin />
              <p style={{ margin: 0, fontWeight: 700 }}>Map Preview — Bara Rimba Rent Basecamp</p>
              <span style={{ fontSize: '13px', color: '#666' }}>Kota Bandung, Jawa Barat</span>
            </div>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="info-primary-btn"
              style={{ marginTop: 'auto', width: '100%', textDecoration: 'none' }}
              id="info-gmaps-btn"
            >
              <IconExternalLink />
              <span>Buka di Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoLokasiRental;
