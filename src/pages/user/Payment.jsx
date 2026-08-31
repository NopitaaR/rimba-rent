import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { formatPrice } from '../../data/products';
import './Payment.css';

// ── Constants ────────────────────────────────────────────
const COUNTDOWN_SECONDS = 3 * 60; // 3 menit
const PAYMENT_ORDER_KEY = 'bara_payment_order';

// ── SVG Icons ────────────────────────────────────────────
const IconCart = () => (
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

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const IconUpload = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const IconCheck = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconHourglass = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 22h14"/><path d="M5 2h14"/>
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/>
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>
  </svg>
);

const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ── Helpers ──────────────────────────────────────────────
function padTwo(n) { return String(n).padStart(2, '0'); }

function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${padTwo(m)}:${padTwo(s)}`;
}

function formatDateDisplay(isoDate) {
  if (!isoDate) return '-';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

function calcDuration(startStr, endStr) {
  if (!startStr || !endStr) return null;
  const s = new Date(startStr);
  const e = new Date(endStr);
  const diffMs = e - s;
  if (diffMs <= 0) return null;
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const nights = days - 1;
  return { days, nights };
}

function generateOrderId() {
  const ts = Date.now().toString().slice(-6);
  return `#${ts}`;
}

// ── QRIS QR Code (SVG placeholder mirip Figma) ───────────
function QRCodeDisplay() {
  return (
    <div className="pay-qr-wrap">
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pay-qr-svg"
      >
        {/* Outer border */}
        <rect x="0" y="0" width="160" height="160" fill="white"/>
        {/* Top-left finder */}
        <rect x="8" y="8" width="44" height="44" rx="4" fill="#1a1a1a"/>
        <rect x="14" y="14" width="32" height="32" rx="2" fill="white"/>
        <rect x="20" y="20" width="20" height="20" rx="1" fill="#1a1a1a"/>
        {/* Top-right finder */}
        <rect x="108" y="8" width="44" height="44" rx="4" fill="#1a1a1a"/>
        <rect x="114" y="14" width="32" height="32" rx="2" fill="white"/>
        <rect x="120" y="20" width="20" height="20" rx="1" fill="#1a1a1a"/>
        {/* Bottom-left finder */}
        <rect x="8" y="108" width="44" height="44" rx="4" fill="#1a1a1a"/>
        <rect x="14" y="114" width="32" height="32" rx="2" fill="white"/>
        <rect x="20" y="120" width="20" height="20" rx="1" fill="#1a1a1a"/>
        {/* Data modules — random pattern */}
        {[60,68,76,84,92,100].map((x, i) =>
          [8,16,24,32,40,48].map((y, j) => (
            (i + j) % 3 !== 0 && <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" fill="#1a1a1a"/>
          ))
        )}
        {[8,16,24,32,40,48].map((x, i) =>
          [60,68,76,84,92,100,108,116,124].map((y, j) => (
            (i * 2 + j) % 3 !== 1 && <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" fill="#1a1a1a"/>
          ))
        )}
        {[60,68,76,84,92,100,108,116,124].map((x, i) =>
          [60,68,76,84,92,100,108,116,124].map((y, j) => (
            (i + j * 3) % 4 !== 2 && <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" fill="#1a1a1a"/>
          ))
        )}
        {[108,116,124,132,140].map((x, i) =>
          [60,68,76,84,92,100,108,116,124,132,140].map((y, j) => (
            (i * 3 + j) % 3 !== 0 && <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" fill="#1a1a1a"/>
          ))
        )}
        {/* QRIS label area - white box in center */}
        <rect x="55" y="55" width="50" height="50" fill="white"/>
        <text x="80" y="76" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1a1a1a">QRIS</text>
        <text x="80" y="88" textAnchor="middle" fontSize="5" fill="#555">Bara Rimba</text>
        <text x="80" y="98" textAnchor="middle" fontSize="5" fill="#555">Rent</text>
      </svg>
    </div>
  );
}

// ── Screen: Success ───────────────────────────────────────
function SuccessScreen({ orderId, total, onHome }) {
  return (
    <div className="pay-overlay-screen pay-success">
      <div className="pay-overlay-icon pay-icon-success">
        <IconCheck />
      </div>
      <h2 className="pay-overlay-title">BUKTI PEMBAYARAN BERHASIL DIKIRIM</h2>
      <p className="pay-overlay-subtitle">
        Pembayaran kamu sedang menunggu konfirmasi dari admin.
      </p>
      <div className="pay-receipt-box">
        <div className="pay-receipt-row">
          <span>No. Pesanan</span>
          <span className="pay-receipt-val">{orderId}</span>
        </div>
        <hr className="pay-receipt-divider"/>
        <div className="pay-receipt-row">
          <span>Total Pembayaran</span>
          <span className="pay-receipt-val">{formatPrice(total)}</span>
        </div>
      </div>
      <button className="pay-home-btn" onClick={onHome} id="pay-success-home-btn">
        <IconHome />
        <span>Kembali ke Beranda</span>
      </button>
    </div>
  );
}

// ── Screen: Timeout ───────────────────────────────────────
function TimeoutScreen({ onHome, onRetry }) {
  return (
    <div className="pay-overlay-screen pay-timeout">
      <div className="pay-overlay-icon pay-icon-timeout">
        <IconHourglass />
      </div>
      <h2 className="pay-overlay-title">WAKTU PEMBAYARAN HABIS</h2>
      <p className="pay-overlay-subtitle">
        Pesanan kamu dibatalkan karena waktu pembayaran telah habis. Silakan lakukan pemesanan ulang.
      </p>
      <div className="pay-timeout-actions">
        <button className="pay-home-btn" onClick={onHome} id="pay-timeout-home-btn">
          <IconHome />
          <span>Kembali ke Beranda</span>
        </button>
        <button className="pay-retry-btn" onClick={onRetry} id="pay-timeout-retry-btn">
          <span>Sewa Ulang</span>
        </button>
      </div>
    </div>
  );
}

// ── Main Payment Page ─────────────────────────────────────
function Payment() {
  const { items, totalItems, clearCart } = useCart();
  const { addNotif } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  // Data tanggal & durasi dikirim dari Cart via location.state
  const orderData = location.state ?? JSON.parse(localStorage.getItem(PAYMENT_ORDER_KEY) ?? 'null');

  const startDate = orderData?.startDate ?? '';
  const endDate   = orderData?.endDate   ?? '';
  const duration  = calcDuration(startDate, endDate);

  // Kalkulasi total (sama seperti Cart)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalPayment = subtotal * (duration?.days || 0);

  // Persist data ke localStorage agar refresh tidak hilang
  useEffect(() => {
    if (orderData) {
      localStorage.setItem(PAYMENT_ORDER_KEY, JSON.stringify(orderData));
    }
  }, []);

  // Validasi: jika keranjang kosong atau tanggal tidak valid, kembali ke cart
  useEffect(() => {
    if (items.length === 0 || !duration) {
      navigate('/cart', { replace: true });
    }
  }, []);

  // Countdown timer
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef(null);

  // Upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver]         = useState(false);
  const fileInputRef = useRef(null);

  // Screen state: 'payment' | 'success' | 'timeout'
  const [screen, setScreen] = useState('payment');
  const [orderId] = useState(generateOrderId);

  // Start countdown on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          addNotif({
            type: 'warning',
            title: 'Waktu Pembayaran Habis',
            body: 'Pesanan kamu dibatalkan karena waktu pembayaran telah habis.',
          });
          setScreen('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Handlers
  const handleFileSelect = (file) => {
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan PNG, JPG, atau PDF.');
      return;
    }
    setUploadedFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  }, []);

  const handleSelesai = () => {
    if (!uploadedFile) {
      alert('Upload bukti pembayaran terlebih dahulu.');
      return;
    }
    clearInterval(timerRef.current);
    // Simpan pesanan ke localStorage riwayat
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const history = JSON.parse(localStorage.getItem('bara_history') ?? '[]');
    history.unshift({
      orderId,
      customerName: currentUser.name || 'User Pelanggan',
      phone: currentUser.phone || '081234567890',
      email: currentUser.email || 'user@gmail.com',
      address: currentUser.address || 'Jl. Rimba Raya No. 45, Bandung',
      items: items.map(i => ({ ...i })),
      startDate,
      endDate,
      duration,
      totalPayment,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('bara_history', JSON.stringify(history));
    localStorage.removeItem(PAYMENT_ORDER_KEY);
    window.dispatchEvent(new Event('bara_orders_updated'));
    addNotif({
      type: 'success',
      title: 'Bukti Pembayaran Berhasil Dikirim',
      body: `Pembayaran pesanan ${orderId} sedang menunggu konfirmasi dari admin.`,
    });
    clearCart();
    setScreen('success');
  };

  const handleHome = () => {
    localStorage.removeItem(PAYMENT_ORDER_KEY);
    navigate('/dashboard');
  };

  const handleRetry = () => {
    localStorage.removeItem(PAYMENT_ORDER_KEY);
    navigate('/dashboard');
  };

  // ── Render overlay screens ─────────────────────────────
  if (screen === 'success') {
    return (
      <div className="pay-page">
        <SuccessScreen orderId={orderId} total={totalPayment} onHome={handleHome} />
      </div>
    );
  }

  if (screen === 'timeout') {
    return (
      <div className="pay-page">
        <TimeoutScreen onHome={handleHome} onRetry={handleRetry} />
      </div>
    );
  }

  // ── Main payment render ────────────────────────────────
  const isWarning = countdown <= 60;
  const totalQty  = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="pay-page">
      {/* ── NAVBAR ── */}
      <nav className="pay-navbar">
        <div className="pay-navbar-inner">
          <Link to="/dashboard" className="pay-brand-text">BARA RIMBA RENT</Link>
          <div className="pay-navbar-right">
            <Link to="/cart" className="pay-icon-btn" aria-label="Keranjang" id="pay-nav-cart">
              <IconCart />
              {totalItems > 0 && <span className="pay-nav-badge">{totalItems}</span>}
            </Link>
            <Link to="/information" className="pay-icon-btn" aria-label="Informasi" title="Informasi" id="pay-nav-info">
              <IconInfo />
            </Link>
            <Link to="/profile" className="pay-icon-btn" aria-label="Profil" id="pay-nav-profile">
              <IconProfile />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div className="pay-content">
        {/* Kembali */}
        <Link to="/cart" className="pay-back-link" id="pay-back-btn">
          <IconArrowLeft />
          <span>KEMBALI KE KERANJANG</span>
        </Link>

        {/* Judul */}
        <h1 className="pay-title">PEMBAYARAN</h1>
        <p className="pay-subtitle">Silakan lakukan pembayaran sesuai total pesanan.</p>

        {/* Layout dua kolom */}
        <div className="pay-layout">
          {/* ── KOLOM KIRI ── */}
          <div className="pay-left">

            {/* Total Pembayaran Card */}
            <div className="pay-total-card">
              <div className="pay-total-label">TOTAL PEMBAYARAN</div>
              <div className="pay-total-amount">{formatPrice(totalPayment)}</div>
            </div>

            {/* QRIS Card */}
            <div className="pay-qris-card">
              <div className="pay-qris-header">
                <span className="pay-qris-badge">QRIS</span>
                <span className="pay-qris-merchant">Bara Rimba Rent</span>
              </div>
              <QRCodeDisplay />
              <p className="pay-qris-hint">Scan QRIS untuk melakukan pembayaran.</p>
              <div className="pay-qris-total-row">
                <span className="pay-qris-total-label">Total</span>
                <span className="pay-qris-total-val">{formatPrice(totalPayment)}</span>
              </div>
            </div>

            {/* Countdown Card */}
            <div className={`pay-timer-card${isWarning ? ' warning' : ''}`}>
              <div className={`pay-timer-display${isWarning ? ' warning' : ''}`}>
                {formatCountdown(countdown)}
              </div>
              <p className="pay-timer-label">SELESAIKAN PEMBAYARAN DALAM WAKTU TERSEBUT.</p>
              <p className="pay-timer-hint">
                Pembayaran dan upload bukti harus dilakukan sebelum waktu habis.
              </p>
            </div>

            {/* Upload Bukti */}
            <div className="pay-upload-card">
              <div className="pay-upload-title">Upload Bukti Pembayaran</div>
              <div
                className={`pay-upload-zone${dragOver ? ' drag-over' : ''}${uploadedFile ? ' uploaded' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                id="pay-upload-zone"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  id="pay-file-input"
                />
                {uploadedFile ? (
                  <div className="pay-upload-done">
                    <span className="pay-upload-done-icon">✓</span>
                    <span className="pay-upload-filename">{uploadedFile.name}</span>
                    <span className="pay-upload-change">Klik untuk ganti</span>
                  </div>
                ) : (
                  <>
                    <IconUpload />
                    <p className="pay-upload-text">Klik atau seret foto bukti ke sini</p>
                    <p className="pay-upload-formats">JPG, PNG, PDF — Maks 5MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Tombol Selesai */}
            <button
              className="pay-selesai-btn"
              onClick={handleSelesai}
              id="pay-selesai-btn"
            >
              <span>Selesai</span>
              <IconArrowRight />
            </button>

          </div>

          {/* ── KOLOM KANAN ── */}
          <div className="pay-right">

            {/* Ringkasan Pesanan */}
            <div className="pay-summary-card">
              <h2 className="pay-summary-title">RINGKASAN PESANAN</h2>

              {/* Daftar produk */}
              <div className="pay-summary-items">
                {items.map((item) => {
                  const itemSubtotal = item.price * item.quantity * (duration?.days || 0);
                  return (
                    <div key={item.productId} className="pay-summary-item">
                      <img src={item.img} alt={item.name} className="pay-summary-img" />
                      <div className="pay-summary-info">
                        <span className="pay-summary-badge">{item.badge}</span>
                        <p className="pay-summary-name">{item.name}</p>
                        <p className="pay-summary-calc">
                          {formatPrice(item.price)} × {item.quantity} × {duration?.days || 0} hari
                        </p>
                        <p className="pay-summary-subtotal">
                          Subtotal: <strong>{formatPrice(itemSubtotal)}</strong>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <hr className="pay-summary-divider"/>

              {/* Informasi Penyewaan */}
              <div className="pay-rental-info">
                <div className="pay-rental-row">
                  <span className="pay-rental-label">Jumlah Barang</span>
                  <span className="pay-rental-val">{totalQty} Item</span>
                </div>
                <div className="pay-rental-row">
                  <span className="pay-rental-label">Durasi</span>
                  <span className="pay-rental-val">
                    {duration
                      ? `${duration.days} Hari${duration.nights > 0 ? ` ${duration.nights} Malam` : ''}`
                      : '-'}
                  </span>
                </div>
              </div>

              <hr className="pay-summary-divider"/>

              {/* Tanggal Penyewaan */}
              <div className="pay-dates-section">
                <div className="pay-dates-title">TANGGAL PENYEWAAN</div>
                <div className="pay-dates-row">
                  <div className="pay-date-box">
                    <span className="pay-date-lbl">Pengambilan</span>
                    <span className="pay-date-val">{formatDateDisplay(startDate)}</span>
                  </div>
                  <div className="pay-date-arrow">→</div>
                  <div className="pay-date-box">
                    <span className="pay-date-lbl">Pengembalian</span>
                    <span className="pay-date-val">{formatDateDisplay(endDate)}</span>
                  </div>
                </div>
              </div>

              <hr className="pay-summary-divider"/>

              {/* Total */}
              <div className="pay-summary-total-label">Total Pembayaran</div>
              <div className="pay-summary-total">{formatPrice(totalPayment)}</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
