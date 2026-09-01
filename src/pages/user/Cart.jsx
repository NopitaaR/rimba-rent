import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../data/products';
import './Cart.css';

// ── SVG Icons ─────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconCartNav = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
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

const IconInfo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8"  x2="12.01" y2="8"/>
  </svg>
);

const IconTrash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

// ── Helpers ──────────────────────────────────────────────
function toDateInput(dateStr) {
  // '20/05/2026' → '2026-05-20'
  const [d, m, y] = dateStr.split('/');
  return `${y}-${m}-${d}`;
}

function calcDuration(startStr, endStr) {
  const s = new Date(startStr);
  const e = new Date(endStr);
  const diffMs = e - s;
  if (diffMs <= 0) return null;
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const nights = days - 1;
  return { days, nights };
}

// ── Cart Item Component ───────────────────────────────────
function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-img-wrap">
        <img src={item.img} alt={item.name} className="cart-item-img" />
      </div>

      <div className="cart-item-info">
        <span className="cart-item-badge">{item.badge}</span>
        <p className="cart-item-name">{item.name}</p>
        <p className="cart-item-price">{formatPrice(item.price)} <span>/hari</span></p>
      </div>

      <div className="cart-item-qty-wrap">
        <div className="cart-qty-selector">
          <button
            className="cart-qty-btn"
            onClick={() => updateQty(item.productId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Kurangi"
          >
            −
          </button>
          <span className="cart-qty-value">{item.quantity}</span>
          <button
            className="cart-qty-btn"
            onClick={() => updateQty(item.productId, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            aria-label="Tambah"
          >
            +
          </button>
        </div>
      </div>

      <button
        className="cart-item-delete"
        onClick={() => removeItem(item.productId)}
        aria-label={`Hapus ${item.name}`}
        title="Hapus produk"
      >
        <IconTrash />
      </button>
    </div>
  );
}

// ── Cart Page ─────────────────────────────────────────────
function Cart() {
  const { items, totalItems } = useCart();
  const navigate = useNavigate();

  // Default tanggal: 20 Mei 2026 – 22 Mei 2026
  const [startDate, setStartDate] = useState(toDateInput('20/05/2026'));
  const [endDate, setEndDate]     = useState(toDateInput('22/05/2026'));
  const [dateError, setDateError] = useState('');

  const duration = calcDuration(startDate, endDate);

  // Total pembayaran = Σ (harga × qty) × durasi hari
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalPayment = subtotal * (duration?.days || 0);

  const handleStartChange = (e) => {
    setStartDate(e.target.value);
    setDateError('');
  };

  const handleEndChange = (e) => {
    if (e.target.value < startDate) {
      setDateError('Tanggal pengembalian tidak boleh lebih awal dari tanggal pengambilan.');
    } else {
      setDateError('');
    }
    setEndDate(e.target.value);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Keranjang kosong. Tambahkan produk terlebih dahulu.');
      return;
    }
    if (!startDate || !endDate) {
      alert('Pilih tanggal pengambilan dan pengembalian terlebih dahulu.');
      return;
    }
    if (endDate <= startDate) {
      setDateError('Tanggal pengembalian tidak boleh lebih awal dari tanggal pengambilan.');
      return;
    }
    // Kirim data tanggal ke halaman Payment via location.state
    navigate('/payment', { state: { startDate, endDate } });
  };

  return (
    <div className="cart-page">
      {/* ── NAVBAR ────────────────────────────────────── */}
      <nav className="cart-navbar">
        <div className="cart-navbar-inner">
          <Link to="/dashboard" className="cart-brand-text">BARA RIMBA RENT</Link>
          <div className="cart-navbar-right">
            <Link to="/cart" className="cart-icon-btn active" aria-label="Keranjang" id="cart-nav-cart">
              <IconCartNav />
              {totalItems > 0 && (
                <span className="cart-nav-badge">{totalItems}</span>
              )}
            </Link>
            <Link to="/riwayat" className="cart-icon-btn" aria-label="Riwayat Pesanan" title="Riwayat Pesanan" id="cart-nav-history">
              <IconHistory />
            </Link>
            <Link to="/information" className="cart-icon-btn" aria-label="Informasi" title="Informasi" id="cart-nav-info">
              <IconInfo />
            </Link>
            <Link to="/profile" className="cart-icon-btn" aria-label="Profil" id="cart-nav-profile">
              <IconProfile />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── CONTENT ────────────────────────────────────── */}
      <div className="cart-content">
        {/* Link Lanjut Belanja */}
        <Link to="/dashboard" className="cart-continue-link" id="cart-continue-shopping">
          <IconArrowLeft />
          <span>Lanjut Belanja</span>
        </Link>

        {/* Judul */}
        <h1 className="cart-title">KERANJANG</h1>

        {/* Layout dua kolom */}
        <div className="cart-layout">
          {/* ── KOLOM KIRI ───────────────────────── */}
          <div className="cart-left">
            {/* Daftar Produk */}
            <div className="cart-items-card">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <p className="cart-empty-icon">🛒</p>
                  <p className="cart-empty-title">Keranjang kosong</p>
                  <p className="cart-empty-desc">Tambahkan produk dari halaman produk.</p>
                  <Link to="/dashboard" className="cart-empty-btn">Mulai Belanja</Link>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={item.productId}>
                    <CartItem item={item} />
                    {idx < items.length - 1 && <hr className="cart-item-divider" />}
                  </div>
                ))
              )}
            </div>

            {/* Card Tanggal Penyewaan */}
            <div className="cart-date-card">
              <h2 className="cart-date-title">TANGGAL PENYEWAAN</h2>

              <div className="cart-date-row">
                <div className="cart-date-field">
                  <label className="cart-date-label" htmlFor="cart-start-date">
                    TANGGAL PENGAMBILAN
                  </label>
                  <input
                    id="cart-start-date"
                    type="date"
                    className="cart-date-input"
                    value={startDate}
                    onChange={handleStartChange}
                  />
                </div>
                <div className="cart-date-field">
                  <label className="cart-date-label" htmlFor="cart-end-date">
                    TANGGAL PENGEMBALIAN
                  </label>
                  <input
                    id="cart-end-date"
                    type="date"
                    className="cart-date-input"
                    value={endDate}
                    min={startDate}
                    onChange={handleEndChange}
                  />
                </div>
              </div>

              {dateError && (
                <p className="cart-date-error">{dateError}</p>
              )}

              <div className="cart-duration">
                <IconCalendar />
                <span>
                  {duration
                    ? `Durasi: ${duration.days} Hari${duration.nights > 0 ? ` ${duration.nights} Malam` : ''}`
                    : 'Pilih tanggal yang valid'}
                </span>
              </div>
            </div>
          </div>

          {/* ── KOLOM KANAN: Ringkasan ────────────── */}
          <div className="cart-right">
            <div className="cart-summary-card">
              <h2 className="cart-summary-title">RINGKASAN PESANAN</h2>

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Jumlah Barang</span>
                  <span className="cart-summary-value">{items.reduce((s,i)=>s+i.quantity,0)} Item</span>
                </div>
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Durasi</span>
                  <span className="cart-summary-value">
                    {duration ? `${duration.days} Hari` : '—'}
                  </span>
                </div>
              </div>

              <hr className="cart-summary-divider" />

              <div className="cart-summary-total-label">Total Pembayaran:</div>
              <div className="cart-summary-total">
                {formatPrice(totalPayment)}
              </div>

              <button
                className="cart-checkout-btn"
                onClick={handleCheckout}
                id="cart-checkout-btn"
              >
                Lanjut ke Pembayaran
              </button>

              <div className="cart-secure-badge">
                <IconLock />
                <span>Pembayaran Aman &amp; Terenkripsi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

