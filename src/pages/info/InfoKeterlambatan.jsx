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

const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

function InfoKeterlambatan() {
  const { totalItems } = useCart();

  const DELAY_RULES = [
    {
      title: 'Terlambat 1 Hari',
      tag: 'DENDA 10% / HARI',
      tagType: 'warning',
      desc: 'Pengembalian yang melebihi jadwal pada hari pertama akan dikenakan biaya tambahan denda sebesar 10% dari tarif sewa harian produk.',
    },
    {
      title: 'Terlambat 2 - 3 Hari',
      tag: 'DENDA 25% / HARI',
      tagType: 'danger',
      desc: 'Dikenakan tarif denda keterlambatan sebesar 25% per hari. Tim admin kami akan menghubungi nomor kontak penyewa untuk mengonfirmasi keberadaan barang.',
    },
    {
      title: 'Lebih dari 3 Hari Tanpa Konfirmasi',
      tag: 'GANTI HARGA PENUH / HUKUM',
      tagType: 'danger',
      desc: 'Penyewa yang tidak memberikan kejelasan posisi barang lebih dari 3 hari dianggap melakukan pelanggaran berat. Identitas jaminan (KTP/SIM) akan ditindaklanjuti secara hukum.',
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
          <h1 className="info-detail-title">KETERLAMBATAN</h1>
          <p className="info-detail-subtitle">
            Aturan perhitungan biaya denda dan sanksi akibat keterlambatan pengembalian unit sewa.
          </p>
        </div>

        {/* Delay Rules List */}
        <div className="info-timeline">
          {DELAY_RULES.map((item, idx) => (
            <div key={idx} className="info-section-card">
              <span className={`info-tag ${item.tagType}`}>{item.tag}</span>
              <div className="info-section-header">
                <h2 className="info-section-title">
                  <IconClock /> {item.title}
                </h2>
              </div>
              <p className="info-step-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="info-action-center">
          <Link to="/dashboard" className="info-primary-btn" id="info-home-btn">
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InfoKeterlambatan;
