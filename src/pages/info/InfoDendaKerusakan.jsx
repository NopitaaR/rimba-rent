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

const IconAlertTriangle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

function InfoDendaKerusakan() {
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
          <h1 className="info-detail-title">DENDA & KERUSAKAN</h1>
          <p className="info-detail-subtitle">
            Ketentuan kompensasi dan penanganan atas kerusakan atau kehilangan unit sewa.
          </p>
        </div>

        {/* Section Cards Grid */}
        <div className="info-timeline">
          {/* Kerusakan Ringan */}
          <div className="info-section-card">
            <span className="info-tag warning">EVALUASI BERTAHAP</span>
            <div className="info-section-header">
              <h2 className="info-section-title">
                <IconAlertTriangle /> Kerusakan Ringan
              </h2>
            </div>
            <p className="info-step-desc">
              Kerusakan kecil atau kondisi barang yang membutuhkan perawatan khusus (seperti kotor berlebih akibat lumpur, tali tenda putus, pasak bengkok, atau zipper tersendat) akan dikenakan biaya pembersihan/perbaikan sebesar <strong>Rp 20.000 – Rp 50.000</strong> per unit.
            </p>
          </div>

          {/* Barang Hilang / Rusak Total */}
          <div className="info-section-card">
            <span className="info-tag danger">GANTI HARGA PENUH</span>
            <div className="info-section-header">
              <h2 className="info-section-title">
                <IconAlertTriangle /> Barang Hilang atau Rusak Total
              </h2>
            </div>
            <p className="info-step-desc">
              Peralatan yang hilang, robek parah, patah, terbakar, atau mengalami kerusakan permanen sehingga tidak dapat disewakan kembali wajib diganti dengan <strong>unit baru yang setara atau mengganti uang tunai sebesar harga pasar barang tersebut</strong>.
            </p>
          </div>

          {/* Pemeriksaan & Validasi */}
          <div className="info-section-card">
            <span className="info-tag info">PENGECEKAN BASECAMP</span>
            <div className="info-section-header">
              <h2 className="info-section-title">
                <IconAlertTriangle /> Prosedur Pemeriksaan & Validasi
              </h2>
            </div>
            <p className="info-step-desc">
              Tim admin Bara Rimba Rent akan melakukan inspeksi fisik barang secara transparan bersama penyewa saat proses pengembalian di basecamp untuk menentukan kondisi akhir alat sewa.
            </p>
          </div>
        </div>

        {/* Home Button */}
        <div className="info-action-center">
          <Link to="/dashboard" className="info-primary-btn" id="info-home-btn">
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InfoDendaKerusakan;
