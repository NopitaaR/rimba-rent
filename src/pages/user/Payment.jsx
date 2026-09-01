import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { createOrder } from '../../api/OrdersApi';
import './Payment.css';

// SVG Icons
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const IconBank = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <circle cx="12" cy="12" r="2"/>
    <path d="M6 12h.01M18 12h.01"/>
  </svg>
);

const IconWallet = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7h-7L10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>
    <circle cx="16" cy="14" r="1"/>
  </svg>
);

const IconCash = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="6" y1="12" x2="6.01" y2="12"/>
    <line x1="18" y1="12" x2="18.01" y2="12"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

function formatDateDisplay(isoDate) {
  if (!isoDate) return '-';
  if (isoDate.includes('-')) {
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  }
  return isoDate;
}

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const { items: cartItems, totalItems, clearCart } = useCart();
  const { addNotif } = useNotification();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  // Data dari halaman sebelumnya
  const checkoutData = location.state || {};

  const startDate = checkoutData.startDate || '2026-05-20';
  const endDate = checkoutData.endDate || '2026-05-22';
  
  // Hitung durasi
  const durationDays = checkoutData.durationDays || (() => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  })();

  // Subtotal produk (harga x qty x durasi)
  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.price) * Number(item.quantity) * durationDays;
  }, 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      addNotif({
        type: 'error',
        title: 'Metode Pembayaran Belum Dipilih',
        body: 'Silakan pilih metode pembayaran terlebih dahulu.',
      });
      return;
    }

    if (cartItems.length === 0) {
      addNotif({
        type: 'error',
        title: 'Keranjang Kosong',
        body: 'Tidak ada produk yang dapat dipesan.',
      });
      navigate('/cart');
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        user_id: 1,
        start_date: startDate,
        end_date: endDate,
        duration_days: durationDays,
        total_payment: subtotal,
        payment_method: paymentMethod,
        items: cartItems.map((item) => ({
          product_id: item.productId || item.id,
          quantity: Number(item.quantity),
        })),
      };

      console.log('DATA PESANAN:', orderData);

      // Simpan ke bara_history lokal untuk sinkronisasi riwayat
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const history = JSON.parse(localStorage.getItem('bara_history') || '[]');
      const newOrderId = `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      history.unshift({
        orderId: newOrderId,
        customerName: currentUser.name || 'User Pelanggan',
        phone: currentUser.phone || '081234567890',
        email: currentUser.email || 'user@gmail.com',
        address: currentUser.address || 'Jl. Rimba Raya No. 45, Bandung',
        items: cartItems.map(i => ({ ...i })),
        startDate,
        endDate,
        duration: { days: durationDays, nights: Math.max(0, durationDays - 1) },
        totalPayment: subtotal,
        paymentMethod,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('bara_history', JSON.stringify(history));

      let result = null;
      try {
        result = await createOrder(orderData);
      } catch (apiErr) {
        console.warn('Backend API error fallback local order:', apiErr);
        result = { id: newOrderId, ...orderData };
      }

      console.log('ORDER BERHASIL:', result);

      clearCart();

      addNotif({
        type: 'success',
        title: 'Pesanan Berhasil Dibuat',
        body: 'Pesanan Anda berhasil dibuat dan menunggu pembayaran.',
      });

      navigate('/riwayat', {
        state: {
          order: result || { id: newOrderId, total_payment: subtotal },
        },
      });
    } catch (error) {
      console.error(error);
      addNotif({
        type: 'error',
        title: 'Pesanan Gagal',
        body: error.message || 'Terjadi kesalahan saat membuat pesanan.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      {/* NAVBAR */}
      <nav className="payment-navbar">
        <div className="payment-navbar-inner">
          <Link to="/dashboard" className="payment-brand-text">BARA RIMBA RENT</Link>
          <div className="payment-navbar-right">
            <Link to="/cart" className="payment-icon-btn" aria-label="Keranjang" id="payment-nav-cart">
              <IconCart />
              {totalItems > 0 && <span className="payment-nav-badge">{totalItems}</span>}
            </Link>
            <Link to="/riwayat" className="payment-icon-btn" aria-label="Riwayat Pesanan" title="Riwayat Pesanan" id="payment-nav-history">
              <IconHistory />
            </Link>
            <Link to="/information" className="payment-icon-btn" aria-label="Informasi" title="Informasi" id="payment-nav-info">
              <IconInfo />
            </Link>
            <Link to="/profile" className="payment-icon-btn" aria-label="Profil" id="payment-nav-profile">
              <IconProfile />
            </Link>
          </div>
        </div>
      </nav>

      {/* CONTENT CONTAINER */}
      <div className="payment-content">
        {/* HEADER */}
        <div className="payment-header-group">
          <button
            className="payment-back-btn"
            onClick={() => navigate(-1)}
            id="payment-back-btn"
          >
            <IconArrowLeft />
            <span>KEMBALI KE KERANJANG</span>
          </button>

          <h1 className="payment-title">PEMBAYARAN</h1>
          <p className="payment-subtitle">Lengkapi pembayaran untuk menyelesaikan pesanan Anda.</p>
        </div>

        <div className="payment-layout">
          {/* BAGIAN KIRI */}
          <div className="payment-left">

            {/* INFORMASI PENYEWAAN */}
            <div className="payment-card">
              <h2 className="payment-card-title">INFORMASI PENYEWAAN</h2>

              <div className="payment-rental-grid">
                <div className="payment-date-box">
                  <span className="payment-date-label">TANGGAL PENGAMBILAN</span>
                  <strong className="payment-date-value">{formatDateDisplay(startDate)}</strong>
                </div>

                <div className="payment-date-arrow">
                  <span>→</span>
                </div>

                <div className="payment-date-box">
                  <span className="payment-date-label">TANGGAL PENGEMBALIAN</span>
                  <strong className="payment-date-value">{formatDateDisplay(endDate)}</strong>
                </div>
              </div>

              <div className="payment-duration-badge">
                <div className="payment-duration-left">
                  <IconCalendar />
                  <span>Total Durasi Sewa:</span>
                </div>
                <strong>{durationDays} Hari</strong>
              </div>
            </div>

            {/* PRODUK YANG DISEWA */}
            <div className="payment-card">
              <h2 className="payment-card-title">PRODUK YANG DISEWA</h2>

              <div className="payment-product-list">
                {cartItems.length === 0 ? (
                  <p className="payment-no-items">Tidak ada produk dalam keranjang.</p>
                ) : (
                  cartItems.map((item, idx) => {
                    const itemSubtotal = Number(item.price) * Number(item.quantity) * durationDays;
                    return (
                      <div className="payment-product-item" key={item.productId || item.id || idx}>
                        <img
                          src={item.img}
                          alt={item.name}
                          className="payment-product-image"
                        />

                        <div className="payment-product-info">
                          <span className="payment-product-badge">{item.badge || 'PRODUK'}</span>
                          <h3 className="payment-product-name">{item.name}</h3>
                          <p className="payment-product-calc">
                            {formatPrice(item.price)} × {item.quantity} unit × {durationDays} hari
                          </p>
                        </div>

                        <div className="payment-product-price-col">
                          <span className="payment-product-price-label">Subtotal</span>
                          <strong className="payment-product-price-val">
                            {formatPrice(itemSubtotal)}
                          </strong>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* METODE PEMBAYARAN */}
            <div className="payment-card">
              <h2 className="payment-card-title">METODE PEMBAYARAN</h2>

              <div className="payment-method-list">
                {/* TRANSFER BANK */}
                <label
                  className={`payment-method-card ${paymentMethod === 'Transfer Bank' ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Transfer Bank"
                    checked={paymentMethod === 'Transfer Bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-method-icon">
                    <IconBank />
                  </div>
                  <div className="payment-method-text">
                    <h3>Transfer Bank</h3>
                    <p>Pembayaran via transfer Virtual Account / ATM (BCA / Mandiri / BNI)</p>
                  </div>
                  {paymentMethod === 'Transfer Bank' && (
                    <div className="payment-method-check">
                      <IconCheck />
                    </div>
                  )}
                </label>

                {/* E-WALLET */}
                <label
                  className={`payment-method-card ${paymentMethod === 'E-Wallet' ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="E-Wallet"
                    checked={paymentMethod === 'E-Wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-method-icon">
                    <IconWallet />
                  </div>
                  <div className="payment-method-text">
                    <h3>E-Wallet & QRIS</h3>
                    <p>Pembayaran cepat via GoPay, OVO, Dana, ShopeePay, atau QRIS</p>
                  </div>
                  {paymentMethod === 'E-Wallet' && (
                    <div className="payment-method-check">
                      <IconCheck />
                    </div>
                  )}
                </label>

                {/* CASH */}
                <label
                  className={`payment-method-card ${paymentMethod === 'Cash' ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    checked={paymentMethod === 'Cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-method-icon">
                    <IconCash />
                  </div>
                  <div className="payment-method-text">
                    <h3>Bayar di Tempat (Cash)</h3>
                    <p>Pembayaran tunai dilakukan saat mengambil barang di store Bara Rimba</p>
                  </div>
                  {paymentMethod === 'Cash' && (
                    <div className="payment-method-check">
                      <IconCheck />
                    </div>
                  )}
                </label>
              </div>
            </div>

          </div>

          {/* BAGIAN KANAN */}
          <div className="payment-right">
            <div className="payment-summary-card">
              <h2 className="payment-summary-title">RINGKASAN PEMBAYARAN</h2>

              <div className="payment-summary-row">
                <span>Subtotal Produk</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div className="payment-summary-row">
                <span>Durasi Penyewaan</span>
                <strong>{durationDays} Hari</strong>
              </div>

              <hr className="payment-summary-divider" />

              <div className="payment-total-group">
                <span className="payment-total-label">Total Pembayaran</span>
                <strong className="payment-total-amount">{formatPrice(subtotal)}</strong>
              </div>

              <button
                className="payment-submit-btn"
                onClick={handlePayment}
                disabled={loading}
                id="payment-submit-btn"
              >
                {loading ? 'Memproses Pesanan...' : 'Buat Pesanan'}
              </button>

              <div className="payment-secure-badge">
                <IconLock />
                <span>Transaksi 100% Aman & Terverifikasi</span>
              </div>

              <p className="payment-note">
                Dengan melanjutkan pembayaran, Anda menyetujui ketentuan penyewaan BARA RIMBA RENT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;