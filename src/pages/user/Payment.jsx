import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { createOrder } from '../../api/OrdersApi';
import './Payment.css';

// SVG Icons
const IconCart = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconHistory = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconProfile = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="9" r="3" />
    <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" />
  </svg>
);

const IconInfo = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconArrowLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconBank = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const IconCalendar = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconCheck = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconLock = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconUpload = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconCopy = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconFileText = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
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

  const {
    items: cartItems,
    totalItems,
    clearCart,
  } = useCart();

  const { addNotif } = useNotification();

  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data dari halaman sebelumnya
  const checkoutData = location.state || {};

  const startDate = checkoutData.startDate || '2026-05-20';
  const endDate = checkoutData.endDate || '2026-05-22';

  // Hitung durasi
  const durationDays =
    checkoutData.durationDays ||
    (() => {
      if (!startDate || !endDate) return 1;

      const s = new Date(startDate);
      const e = new Date(endDate);

      const diff = Math.round(
        (e - s) / (1000 * 60 * 60 * 24)
      );

      return diff > 0 ? diff : 1;
    })();

  // Subtotal produk
  const subtotal = cartItems.reduce(
    (total, item) => {
      return (
        total +
        Number(item.price) *
        Number(item.quantity) *
        durationDays
      );
    },
    0
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // =========================
  // PILIH FILE BUKTI
  // =========================

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Maksimal 5MB
    if (file.size > 5 * 1024 * 1024) {
      addNotif({
        type: 'error',
        title: 'Ukuran File Terlalu Besar',
        body:
          'Maksimal ukuran file bukti pembayaran adalah 5MB.',
      });

      e.target.value = '';
      return;
    }

    setProofFile(file);

    // Preview hanya untuk gambar
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setProofPreview(previewUrl);
    } else {
      setProofPreview(null);
    }
  };

  // =========================
  // HAPUS FILE
  // =========================

  const handleRemoveFile = () => {
    setProofFile(null);
    setProofPreview(null);

    const input = document.getElementById(
      'payment-proof-input'
    );

    if (input) {
      input.value = '';
    }
  };

  // =========================
  // COPY REKENING
  // =========================

  const handleCopyAccount = async (text) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedAccount(true);

      addNotif({
        type: 'success',
        title: 'Nomor Rekening Disalin',
        body: `No. Rekening ${text} berhasil disalin ke clipboard.`,
      });

      setTimeout(
        () => setCopiedAccount(false),
        2000
      );
    } catch (error) {
      console.error(
        'Gagal menyalin nomor rekening:',
        error
      );

      addNotif({
        type: 'error',
        title: 'Gagal Menyalin',
        body:
          'Nomor rekening tidak dapat disalin otomatis.',
      });
    }
  };

  // =========================
  // SUBMIT PEMBAYARAN
  // =========================

  const handlePayment = async () => {
    // ---------------------------------
    // VALIDASI BUKTI
    // ---------------------------------

    if (!proofFile) {
      addNotif({
        type: 'error',
        title: 'Bukti Pembayaran Wajib Diunggah',
        body:
          'Silakan lakukan transfer dan unggah bukti transaksi terlebih dahulu.',
      });

      return;
    }

    // ---------------------------------
    // VALIDASI KERANJANG
    // ---------------------------------

    if (cartItems.length === 0) {
      addNotif({
        type: 'error',
        title: 'Keranjang Kosong',
        body:
          'Tidak ada produk yang dapat dipesan.',
      });

      navigate('/cart');

      return;
    }

    try {
      setLoading(true);

      // ---------------------------------
      // AMBIL USER
      // ---------------------------------

      const currentUser = JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );

      const userId = currentUser.id || 1;

      // ---------------------------------
      // DATA ORDER
      // ---------------------------------

      const orderData = {
        user_id: userId,

        start_date: startDate,

        end_date: endDate,

        duration_days: durationDays,

        total_payment: subtotal,

        payment_method: 'Transfer Bank',

        payment_status: 'Menunggu Verifikasi',

        // PENTING:
        // Kirim File asli.
        // Jangan Base64.
        payment_proof: proofFile,

        items: cartItems.map((item) => ({
          product_id:
            item.productId || item.id,

          quantity: Number(item.quantity),
        })),
      };

      console.log(
        'DATA PESANAN YANG DIKIRIM KE LARAVEL:',
        orderData
      );

      // ---------------------------------
      // KIRIM KE LARAVEL
      // ---------------------------------

      const result = await createOrder(
        orderData
      );

      console.log(
        'ORDER BERHASIL DIBUAT:',
        result
      );

      // ---------------------------------
      // KOSONGKAN KERANJANG
      // ---------------------------------

      clearCart();

      // ---------------------------------
      // NOTIFIKASI
      // ---------------------------------

      addNotif({
        type: 'success',
        title:
          'Bukti Pembayaran Berhasil Dikirim',
        body:
          'Pesanan berhasil dibuat dan bukti pembayaran sedang diverifikasi oleh admin.',
      });

      // ---------------------------------
      // KE RIWAYAT
      // ---------------------------------

      navigate('/riwayat', {
        state: {
          order: result,
        },
      });

    } catch (error) {
      console.error(
        'GAGAL MEMBUAT PESANAN:',
        error
      );

      addNotif({
        type: 'error',
        title: 'Pesanan Gagal',
        body:
          error.message ||
          'Terjadi kesalahan saat mengirim pesanan.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="payment-navbar">
        <div className="payment-navbar-inner">

          <Link
            to="/dashboard"
            className="payment-brand-text"
          >
            BARA RIMBA RENT
          </Link>

          <div className="payment-navbar-right">

            <Link
              to="/cart"
              className="payment-icon-btn"
              aria-label="Keranjang"
              id="payment-nav-cart"
            >
              <IconCart />

              {totalItems > 0 && (
                <span className="payment-nav-badge">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              to="/riwayat"
              className="payment-icon-btn"
              aria-label="Riwayat Pesanan"
              title="Riwayat Pesanan"
              id="payment-nav-history"
            >
              <IconHistory />
            </Link>

            <Link
              to="/information"
              className="payment-icon-btn"
              aria-label="Informasi"
              title="Informasi"
              id="payment-nav-info"
            >
              <IconInfo />
            </Link>

            <Link
              to="/profile"
              className="payment-icon-btn"
              aria-label="Profil"
              id="payment-nav-profile"
            >
              <IconProfile />
            </Link>

          </div>
        </div>
      </nav>

      {/* =========================
          CONTENT
      ========================= */}

      <div className="payment-content">

        {/* HEADER */}

        <div className="payment-header-group">

          <button
            className="payment-back-btn"
            onClick={() => navigate(-1)}
            id="payment-back-btn"
          >
            <IconArrowLeft />

            <span>
              KEMBALI KE KERANJANG
            </span>
          </button>

          <h1 className="payment-title">
            PEMBAYARAN
          </h1>

          <p className="payment-subtitle">
            Lengkapi pembayaran untuk
            menyelesaikan pesanan Anda.
          </p>

        </div>

        <div className="payment-layout">

          {/* =========================
              BAGIAN KIRI
          ========================= */}

          <div className="payment-left">

            {/* INFORMASI PENYEWAAN */}

            <div className="payment-card">

              <h2 className="payment-card-title">
                INFORMASI PENYEWAAN
              </h2>

              <div className="payment-rental-grid">

                <div className="payment-date-box">

                  <span className="payment-date-label">
                    TANGGAL PENGAMBILAN
                  </span>

                  <strong className="payment-date-value">
                    {formatDateDisplay(startDate)}
                  </strong>

                </div>

                <div className="payment-date-arrow">
                  <span>→</span>
                </div>

                <div className="payment-date-box">

                  <span className="payment-date-label">
                    TANGGAL PENGEMBALIAN
                  </span>

                  <strong className="payment-date-value">
                    {formatDateDisplay(endDate)}
                  </strong>

                </div>

              </div>

              <div className="payment-duration-badge">

                <div className="payment-duration-left">

                  <IconCalendar />

                  <span>
                    Total Durasi Sewa:
                  </span>

                </div>

                <strong>
                  {durationDays} Hari
                </strong>

              </div>

            </div>

            {/* PRODUK YANG DISEWA */}

            <div className="payment-card">

              <h2 className="payment-card-title">
                PRODUK YANG DISEWA
              </h2>

              <div className="payment-product-list">

                {cartItems.length === 0 ? (

                  <p className="payment-no-items">
                    Tidak ada produk dalam keranjang.
                  </p>

                ) : (

                  cartItems.map((item, idx) => {

                    const itemSubtotal =
                      Number(item.price) *
                      Number(item.quantity) *
                      durationDays;

                    return (
                      <div
                        className="payment-product-item"
                        key={
                          item.productId ||
                          item.id ||
                          idx
                        }
                      >

                        <img
                          src={item.img}
                          alt={item.name}
                          className="payment-product-image"
                        />

                        <div className="payment-product-info">

                          <span className="payment-product-badge">
                            {item.badge || 'PRODUK'}
                          </span>

                          <h3 className="payment-product-name">
                            {item.name}
                          </h3>

                          <p className="payment-product-calc">
                            {formatPrice(item.price)}
                            {' × '}
                            {item.quantity}
                            {' unit × '}
                            {durationDays}
                            {' hari'}
                          </p>

                        </div>

                        <div className="payment-product-price-col">

                          <span className="payment-product-price-label">
                            Subtotal
                          </span>

                          <strong className="payment-product-price-val">
                            {formatPrice(
                              itemSubtotal
                            )}
                          </strong>

                        </div>

                      </div>
                    );
                  })
                )}

              </div>
            </div>

            {/* BUKTI PEMBAYARAN */}

            <div className="payment-card">

              <h2 className="payment-card-title">
                BUKTI PEMBAYARAN
              </h2>

              {/* INFORMASI REKENING */}

              <div className="payment-bank-info-card">

                <div className="payment-bank-header">

                  <div className="payment-bank-logo">

                    <IconBank />

                    <span>
                      Bank BCA
                    </span>

                  </div>

                  <span className="payment-bank-tag">
                    Rekening Resmi BARA RIMBA
                  </span>

                </div>

                <div className="payment-bank-details">

                  <div className="payment-bank-row">

                    <span className="payment-bank-label">
                      Nomor Rekening:
                    </span>

                    <div className="payment-bank-no-group">

                      <strong className="payment-bank-no">
                        8293019283
                      </strong>

                      <button
                        type="button"
                        className="payment-copy-btn"
                        onClick={() =>
                          handleCopyAccount(
                            '8293019283'
                          )
                        }
                        title="Salin Nomor Rekening"
                      >

                        {copiedAccount ? (
                          <IconCheck />
                        ) : (
                          <IconCopy />
                        )}

                        <span>
                          {copiedAccount
                            ? 'Tersalin'
                            : 'Salin'}
                        </span>

                      </button>

                    </div>

                  </div>

                  <div className="payment-bank-row">

                    <span className="payment-bank-label">
                      Atas Nama:
                    </span>

                    <strong className="payment-bank-name">
                      BARA RIMBA RENT
                    </strong>

                  </div>

                </div>

              </div>

              <p className="payment-proof-instruction">
                Silakan lakukan pembayaran sesuai
                total pembayaran di atas, kemudian
                upload bukti transaksi.
              </p>

              {/* UPLOAD BOX */}

              <div className="payment-upload-area">

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={handleFileChange}
                  id="payment-proof-input"
                  className="payment-file-input-hidden"
                />

                {!proofFile ? (

                  <label
                    htmlFor="payment-proof-input"
                    className="payment-upload-dropzone"
                  >

                    <div className="payment-upload-icon-wrapper">
                      <IconUpload />
                    </div>

                    <span className="payment-upload-title">
                      Pilih Bukti Pembayaran
                    </span>

                    <span className="payment-upload-sub">
                      Format yang didukung:
                      JPG, JPEG, PNG, PDF
                      (Maks. 5MB)
                    </span>

                  </label>

                ) : (

                  <div className="payment-proof-selected-box">

                    {proofPreview ? (

                      <div className="payment-proof-preview-wrapper">

                        <img
                          src={proofPreview}
                          alt="Bukti Transaksi"
                          className="payment-proof-preview-img"
                        />

                      </div>

                    ) : (

                      <div className="payment-proof-pdf-badge">

                        <IconFileText />

                        <span>
                          Dokumen PDF
                        </span>

                      </div>

                    )}

                    <div className="payment-proof-file-info">

                      <span className="payment-proof-file-name">
                        {proofFile.name}
                      </span>

                      <span className="payment-proof-file-size">
                        {(proofFile.size / 1024).toFixed(1)}
                        {' KB'}
                      </span>

                    </div>

                    <div className="payment-proof-actions">

                      <label
                        htmlFor="payment-proof-input"
                        className="payment-change-file-btn"
                      >
                        Ganti File
                      </label>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="payment-remove-file-btn"
                      >
                        Hapus
                      </button>

                    </div>

                  </div>

                )}

              </div>

              <button
                type="button"
                className="payment-submit-btn payment-submit-left-btn"
                onClick={handlePayment}
                disabled={loading}
                id="payment-submit-proof-btn"
              >
                {loading
                  ? 'Memproses Pesanan...'
                  : 'Kirim Bukti Pembayaran'}
              </button>

            </div>

          </div>

          {/* =========================
              BAGIAN KANAN
          ========================= */}

          <div className="payment-right">

            <div className="payment-summary-card">

              <h2 className="payment-summary-title">
                RINGKASAN PEMBAYARAN
              </h2>

              <div className="payment-summary-row">

                <span>
                  Subtotal Produk
                </span>

                <strong>
                  {formatPrice(subtotal)}
                </strong>

              </div>

              <div className="payment-summary-row">

                <span>
                  Durasi Penyewaan
                </span>

                <strong>
                  {durationDays} Hari
                </strong>

              </div>

              <hr className="payment-summary-divider" />

              <div className="payment-total-group">

                <span className="payment-total-label">
                  Total Pembayaran
                </span>

                <strong className="payment-total-amount">
                  {formatPrice(subtotal)}
                </strong>

              </div>

              <button
                className="payment-submit-btn"
                onClick={handlePayment}
                disabled={loading}
                id="payment-submit-btn"
              >
                {loading
                  ? 'Memproses Pesanan...'
                  : 'Kirim Bukti Pembayaran'}
              </button>

              <div className="payment-secure-badge">

                <IconLock />

                <span>
                  Transaksi 100% Aman &
                  Terverifikasi
                </span>

              </div>

              <p className="payment-note">
                Dengan melanjutkan pembayaran,
                Anda menyetujui ketentuan
                penyewaan BARA RIMBA RENT.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Payment;