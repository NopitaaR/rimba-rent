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

const IconCheckCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

function InfoAturanRental() {
  const { totalItems } = useCart();

  const RULES = [
    {
      title: 'Area Pelayanan',
      desc: 'Layanan rental berlaku untuk wilayah penggunaan yang disepakati saat transaksi pemesanan.',
    },
    {
      title: 'Pengambilan & Pengembalian Barang',
      desc: 'Pengambilan dan pengembalian barang dilakukan secara mandiri di lokasi store / basecamp kami.',
    },
    {
      title: 'Persyaratan Jaminan Identitas',
      desc: 'Penyewa wajib menyertakan identitas asli (KTP / SIM) yang masih berlaku sebagai jaminan keamanan.',
    },
    {
      title: 'Tanggung Jawab Akun & Sistem',
      desc: 'Pengguna bertanggung jawab penuh atas segala pesanan yang dikonfirmasi melalui akun masing-masing.',
    },
    {
      title: 'Kebijakan Pembatalan Pesanan',
      desc: 'Pembatalan transaksi pada H-1 atau hari H penjemputan dapat dikenakan pemotongan biaya administrasi.',
    },
    {
      title: 'Ketepatan Waktu Pengembalian',
      desc: 'Pengembalian barang wajib dilakukan sesuai dengan jadwal dan jam operasional store yang ditentukan.',
    },
    {
      title: 'Prosedur Pengecekan Bersama',
      desc: 'Pemeriksaan kondisi kelengkapan fisik dilakukan bersama tim kami saat penyerahan & pengembalian barang.',
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
          <h1 className="info-detail-title">ATURAN RENTAL</h1>
          <p className="info-detail-subtitle">
            Syarat dan ketentuan demi menjaga kualitas alat serta kenyamanan bersama.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="info-rules-grid">
          {RULES.map((rule, idx) => (
            <div key={idx} className="info-rule-card">
              <h3 className="info-rule-title">
                <span className="info-rule-title-icon"><IconCheckCircle /></span>
                <span>{rule.title}</span>
              </h3>
              <p className="info-rule-desc">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InfoAturanRental;
