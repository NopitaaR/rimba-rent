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

const IconShoppingBag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

function InfoCaraPenyewaan() {
  const { totalItems } = useCart();

  const STEPS = [
    {
      step: 1,
      title: 'Login / Registrasi',
      desc: 'Buat akun baru atau masuk ke sistem Bara Rimba Rent untuk dapat memulai proses pemesanan peralatan.',
    },
    {
      step: 2,
      title: 'Pilih Perlengkapan Camping',
      desc: 'Jelajahi katalog produk kami dan pilih alat camping atau paket BBQ yang Anda butuhkan.',
    },
    {
      step: 3,
      title: 'Masukkan ke Keranjang',
      desc: 'Atur jumlah barang yang ingin disewa lalu klik tombol "Tambah ke Keranjang".',
    },
    {
      step: 4,
      title: 'Atur Tanggal Penyewaan',
      desc: 'Pilih tanggal pengambilan dan tanggal pengembalian pada halaman Keranjang belanja.',
    },
    {
      step: 5,
      title: 'Lakukan Pembayaran & Upload Bukti',
      desc: 'Scan QRIS pembayaran sesuai total harga lalu unggah foto bukti pembayaran sebelum batas waktu habis.',
    },
    {
      step: 6,
      title: 'Konfirmasi Verifikasi Admin',
      desc: 'Tim admin kami akan memverifikasi bukti transaksi Anda dan menyiapkan perlengkapan sewa.',
    },
    {
      step: 7,
      title: 'Pengambilan Barang di Basecamp',
      desc: 'Tunjukkan bukti pesanan digital Anda saat mengambil barang di lokasi store kami.',
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
          <h1 className="info-detail-title">CARA PENYEWAAN</h1>
          <p className="info-detail-subtitle">
            Ikuti 7 langkah praktis berikut untuk menyewa peralatan camping & BBQ di Bara Rimba Rent.
          </p>
        </div>

        {/* Steps List */}
        <div className="info-timeline">
          {STEPS.map((item) => (
            <div key={item.step} className="info-timeline-step">
              <div className="info-step-number">{item.step}</div>
              <div className="info-step-body">
                <h3 className="info-step-title">{item.title}</h3>
                <p className="info-step-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="info-action-center">
          <Link to="/dashboard" className="info-primary-btn" id="info-mulai-sewa-btn">
            <IconShoppingBag />
            <span>Mulai Sewa Sekarang</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InfoCaraPenyewaan;
