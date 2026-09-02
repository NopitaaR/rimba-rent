import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { formatPrice } from '../../data/products';
import {
  fetchOrderById,
  updateOrder,
  verifyPayment,
  rejectPayment,
} from '../../api/OrdersApi';
import './AdminOrderDetail.css';

// ======================================================
// SVG ICONS
// ======================================================

const IconArrowLeft = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconCheck = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconCross = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconAlertCircle = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconWhatsApp = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

// ======================================================
// HELPER
// ======================================================

const API_BASE_URL = 'http://127.0.0.1:8000';

function getStatusClass(status) {
  switch (status) {
    case 'Menunggu Konfirmasi':
      return 'status-warning';

    case 'Dikonfirmasi':
      return 'status-success';

    case 'Sedang Disewa':
      return 'status-info';

    case 'Terlambat':
      return 'status-danger';

    case 'Selesai':
      return 'status-muted';

    case 'Dibatalkan':
      return 'status-danger';

    case 'Menunggu Pembayaran':
      return 'status-warning';

    default:
      return 'status-muted';
  }
}

function formatDate(date) {
  if (!date) return '-';

  const dateObj = new Date(date);

  if (Number.isNaN(dateObj.getTime())) {
    return date;
  }

  return dateObj.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getDuration(order) {
  if (order?.duration_days) {
    return `${order.duration_days} Hari`;
  }

  return '-';
}

function getOverdueDays(order) {
  if (!order?.end_date) return 0;

  const end = new Date(order.end_date);
  const today = new Date();

  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff =
    Math.floor(
      (today.getTime() - end.getTime()) /
      (1000 * 60 * 60 * 24)
    );

  return diff > 0 ? diff : 0;
}

function getProductImage(item) {
  if (item?.product?.image) {
    const image = item.product.image;

    if (image.startsWith('http')) {
      return image;
    }

    return `${API_BASE_URL}/storage/${image}`;
  }

  return (
    item?.image ||
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=300'
  );
}

function getPaymentProofUrl(order) {
  if (!order?.payment_proof) {
    return null;
  }

  if (order.payment_proof.startsWith('http')) {
    return order.payment_proof;
  }

  return `${API_BASE_URL}/storage/${order.payment_proof}`;
}

function getPhone(order) {
  return (
    order?.user?.phone ||
    order?.phone ||
    '-'
  );
}

// ======================================================
// COMPONENT
// ======================================================

function AdminOrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  // ====================================================
  // LOAD ORDER DARI LARAVEL
  // ====================================================

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Mengambil detail order:', id);

      const data = await fetchOrderById(id);

      console.log('DETAIL ORDER DARI LARAVEL:', data);

      setOrder(data);
    } catch (err) {
      console.error(
        'Gagal mengambil detail pesanan:',
        err
      );

      setError(
        err.message ||
        'Gagal mengambil detail pesanan.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  // ====================================================
  // UPDATE STATUS UMUM
  // ====================================================

  const handleUpdateStatus = async (newStatus) => {
    if (!order) return;

    try {
      setActionLoading(true);

      const updatedOrder = await updateOrder(
        order.id,
        {
          status: newStatus,
        }
      );

      console.log(
        'STATUS ORDER BERHASIL DIUPDATE:',
        updatedOrder
      );

      setOrder(updatedOrder);
      setModalType(null);

      alert(
        `Status pesanan berhasil diubah menjadi "${newStatus}".`
      );
    } catch (err) {
      console.error(
        'Gagal mengubah status:',
        err
      );

      alert(
        err.message ||
        'Gagal mengubah status pesanan.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // KONFIRMASI PEMBAYARAN
  // ====================================================

  const handleVerifyPayment = async () => {
    if (!order) return;

    try {
      setActionLoading(true);

      console.log(
        'Memverifikasi pembayaran order:',
        order.id
      );

      const updatedOrder =
        await verifyPayment(order.id);

      console.log(
        'PEMBAYARAN BERHASIL DIVERIFIKASI:',
        updatedOrder
      );

      setOrder(updatedOrder);
      setModalType(null);

      alert(
        'Pembayaran berhasil dikonfirmasi.'
      );
    } catch (err) {
      console.error(
        'Gagal verifikasi pembayaran:',
        err
      );

      alert(
        err.message ||
        'Gagal mengkonfirmasi pembayaran.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // TOLAK PEMBAYARAN
  // ====================================================

  const handleRejectPayment = async () => {
    if (!order) return;

    try {
      setActionLoading(true);

      console.log(
        'Menolak pembayaran order:',
        order.id
      );

      const updatedOrder =
        await rejectPayment(order.id);

      console.log(
        'PEMBAYARAN DITOLAK:',
        updatedOrder
      );

      setOrder(updatedOrder);
      setModalType(null);

      alert(
        'Pembayaran berhasil ditolak.'
      );
    } catch (err) {
      console.error(
        'Gagal menolak pembayaran:',
        err
      );

      alert(
        err.message ||
        'Gagal menolak pembayaran.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="admin-order-detail-page">
        <AdminNavbar />

        <main className="admin-order-detail-main">
          <p
            style={{
              textAlign: 'center',
              padding: '60px',
            }}
          >
            Memuat pesanan...
          </p>
        </main>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error || !order) {
    return (
      <div className="admin-order-detail-page">
        <AdminNavbar />

        <main className="admin-order-detail-main">
          <Link
            to="/admin/orders"
            className="admin-back-btn"
          >
            <IconArrowLeft />
            <span>Kembali ke Pesanan</span>
          </Link>

          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}
          >
            <h2>
              Pesanan tidak ditemukan
            </h2>

            <p
              style={{
                color: '#6b7280',
                marginTop: '8px',
              }}
            >
              {error ||
                'Data pesanan tidak tersedia.'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ====================================================
  // DATA
  // ====================================================

  const customerName =
    order.user?.name ||
    order.customer ||
    '-';

  const customerEmail =
    order.user?.email ||
    order.email ||
    '-';

  const customerPhone =
    getPhone(order);

  const orderCode =
    order.order_code ||
    order.orderCode ||
    `ORD-${order.id}`;

  const status =
    order.status ||
    'Menunggu Konfirmasi';

  const statusClass =
    getStatusClass(status);

  const startDate =
    order.start_date ||
    order.startDate;

  const endDate =
    order.end_date ||
    order.endDate;

  const totalPayment =
    Number(
      order.total_payment ||
      order.totalPayment ||
      order.total ||
      0
    );

  const paymentProof =
    getPaymentProofUrl(order);

  const items =
    order.items || [];

  const overdueDays =
    getOverdueDays(order);

  const cleanPhone =
    customerPhone !== '-'
      ? String(customerPhone).replace(
        /[^0-9]/g,
        ''
      )
      : '';

  const formattedWa =
    cleanPhone.startsWith('0')
      ? '62' + cleanPhone.slice(1)
      : cleanPhone;

  const waUrl = formattedWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent(
      `Halo ${customerName}, mengenai pesanan ${orderCode} di Bara Rimba Rent.`
    )}`
    : '#';

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="admin-order-detail-page">
      <AdminNavbar />

      <main className="admin-order-detail-main">

        {/* ==================================================
            BACK
        ================================================== */}

        <Link
          to="/admin/orders"
          className="admin-back-btn"
          id="admin-detail-back-btn"
        >
          <IconArrowLeft />
          <span>Kembali ke Pesanan</span>
        </Link>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="admin-detail-header-row">
          <h1 className="admin-detail-title">
            DETAIL PESANAN #{orderCode}
          </h1>

          <span
            className={`status-badge ${statusClass} admin-detail-badge`}
          >
            {status}
          </span>
        </div>

        {/* ==================================================
            STATUS ACTION BANNER
        ================================================== */}

        <div className="admin-status-banner-card">

          <div className="admin-status-step-info">

            {/* MENUNGGU KONFIRMASI */}

            {status ===
              'Menunggu Konfirmasi' && (
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#92400e',
                  }}
                >
                  ⏳ Menunggu verifikasi bukti
                  pembayaran dari customer.
                </span>
              )}

            {/* DIKONFIRMASI */}

            {status ===
              'Dikonfirmasi' && (
                <span className="admin-status-indicator-tag">
                  <IconCheck />
                  Pembayaran Dikonfirmasi
                </span>
              )}

            {/* SEDANG DISEWA */}

            {status ===
              'Sedang Disewa' && (
                <>
                  <span className="admin-status-indicator-tag">
                    <IconCheck />
                    Pembayaran Dikonfirmasi
                  </span>

                  <span className="admin-status-indicator-tag">
                    <IconCheck />
                    Barang Sedang Disewa
                  </span>
                </>
              )}

            {/* TERLAMBAT */}

            {status === 'Terlambat' && (
              <span className="admin-status-indicator-tag cancel">
                <IconAlertCircle />
                Pesanan Terlambat
              </span>
            )}

            {/* SELESAI */}

            {status === 'Selesai' && (
              <>
                <span className="admin-status-indicator-tag">
                  <IconCheck />
                  Pembayaran Dikonfirmasi
                </span>

                <span className="admin-status-indicator-tag">
                  <IconCheck />
                  Barang Sudah Dikembalikan
                </span>

                <span className="admin-status-indicator-tag">
                  <IconCheck />
                  Penyewaan Selesai
                </span>
              </>
            )}

            {/* DIBATALKAN */}

            {status === 'Dibatalkan' && (
              <span className="admin-status-indicator-tag cancel">
                <IconCross />
                Pesanan Dibatalkan
              </span>
            )}

          </div>

          {/* ==================================================
              ACTION BUTTONS
          ================================================== */}

          <div className="admin-status-actions-wrapper">

            {/* MENUNGGU KONFIRMASI */}

            {status ===
              'Menunggu Konfirmasi' && (
                <>
                  <button
                    id="btn-confirm-payment"
                    className="btn-confirm-pay"
                    onClick={handleVerifyPayment}
                    disabled={actionLoading}
                  >
                    <IconCheck />

                    <span>
                      {actionLoading
                        ? 'Memproses...'
                        : 'Konfirmasi Pembayaran'}
                    </span>
                  </button>

                  <button
                    id="btn-reject-payment"
                    className="btn-reject-pay"
                    onClick={() =>
                      setModalType('reject')
                    }
                    disabled={actionLoading}
                  >
                    <IconCross />

                    <span>
                      Tolak Pembayaran
                    </span>
                  </button>
                </>
              )}

            {/* DIKONFIRMASI */}

            {status === 'Dikonfirmasi' && (
              <button
                id="btn-confirm-pickup"
                className="btn-confirm-pay"
                onClick={() =>
                  setModalType('pickup')
                }
                disabled={actionLoading}
              >
                <IconCheck />

                <span>
                  Konfirmasi Pengambilan Barang
                </span>
              </button>
            )}

            {/* SEDANG DISEWA */}

            {status ===
              'Sedang Disewa' && (
                <button
                  id="btn-confirm-return"
                  className="btn-confirm-pay"
                  onClick={() =>
                    setModalType('return')
                  }
                  disabled={actionLoading}
                >
                  <IconCheck />

                  <span>
                    Konfirmasi Pengembalian Barang
                  </span>
                </button>
              )}

            {/* TERLAMBAT */}

            {status === 'Terlambat' && (
              <button
                id="btn-late-return"
                className="btn-confirm-pay"
                onClick={() =>
                  setModalType('late_return')
                }
                disabled={actionLoading}
              >
                <IconCheck />

                <span>
                  Barang Sudah Dikembalikan
                </span>
              </button>
            )}

          </div>
        </div>

        {/* ==================================================
            KETERLAMBATAN
        ================================================== */}

        {status === 'Terlambat' && (
          <div
            className="late-info-card"
            id="late-info-card"
          >
            <div className="late-info-header">
              <IconAlertCircle />

              <span>
                KETERLAMBATAN PENGEMBALIAN
              </span>
            </div>

            <div className="late-info-body">
              <h2 className="late-days-title">
                Terlambat {overdueDays} Hari
              </h2>

              <p className="late-return-date">
                Seharusnya dikembalikan:{' '}
                <strong>
                  {formatDate(endDate)}
                </strong>
              </p>
            </div>
          </div>
        )}

        {/* ==================================================
            GRID
        ================================================== */}

        <div className="admin-order-detail-grid">

          {/* ==================================================
              LEFT COLUMN
          ================================================== */}

          <div className="admin-detail-col">

            {/* CUSTOMER */}

            <div className="detail-section-card">

              <h2 className="detail-card-title">
                DATA CUSTOMER
              </h2>

              <div className="customer-info-list">

                <div className="customer-info-row">
                  <span className="customer-info-label">
                    Nama Lengkap
                  </span>

                  <span className="customer-info-val">
                    {customerName}
                  </span>
                </div>

                <div className="customer-info-row">
                  <span className="customer-info-label">
                    Nomor WhatsApp
                  </span>

                  <span className="customer-info-val">
                    {customerPhone}
                  </span>
                </div>

                <div className="customer-info-row">
                  <span className="customer-info-label">
                    Email
                  </span>

                  <span className="customer-info-val">
                    {customerEmail}
                  </span>
                </div>

              </div>

              {formattedWa && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-chat"
                  id="btn-chat-whatsapp"
                >
                  <IconWhatsApp />

                  <span>
                    Chat WhatsApp
                  </span>
                </a>
              )}

            </div>

            {/* DETAIL PENYEWAAN */}

            <div className="detail-section-card">

              <h2 className="detail-card-title">
                DETAIL PENYEWAAN
              </h2>

              <div className="rent-items-list">

                {items.length === 0 ? (
                  <p
                    style={{
                      color: '#9ca3af',
                      textAlign: 'center',
                      padding: '20px',
                    }}
                  >
                    Tidak ada item pesanan.
                  </p>
                ) : (
                  items.map((item, index) => {

                    const qty =
                      Number(
                        item.quantity ||
                        item.qty ||
                        1
                      );

                    const rentalDays =
                      Number(
                        item.duration_days ||
                        order.duration_days ||
                        1
                      );

                    const unitPrice =
                      Number(
                        item.price || 0
                      );

                    const subtotal =
                      Number(
                        item.subtotal ??
                        unitPrice *
                        qty *
                        rentalDays
                      );

                    return (
                      <div
                        className="rent-item-row"
                        key={
                          item.id ||
                          index
                        }
                      >

                        <img
                          src={getProductImage(
                            item
                          )}
                          alt={
                            item.product_name ||
                            item.product?.name ||
                            'Produk'
                          }
                          className="rent-item-img"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=300';
                          }}
                        />

                        <div className="rent-item-details">

                          <h3 className="rent-item-name">
                            {item.product_name ||
                              item.product?.name ||
                              'Produk'}
                          </h3>

                          <p className="rent-item-sub">
                            {qty} unit ×{' '}
                            {rentalDays} Hari
                          </p>

                        </div>

                        <div className="rent-item-price">
                          {formatPrice(
                            subtotal
                          )}
                        </div>

                      </div>
                    );
                  })
                )}

              </div>
            </div>

          </div>

          {/* ==================================================
              RIGHT COLUMN
          ================================================== */}

          <div className="admin-detail-col">

            {/* TANGGAL */}

            <div className="detail-section-card">

              <h2 className="detail-card-title">
                TANGGAL PENYEWAAN
              </h2>

              <div className="date-info-list">

                <div className="date-info-row">
                  <span className="date-info-label">
                    Tanggal Pengambilan
                  </span>

                  <span className="date-info-val">
                    {formatDate(startDate)}
                  </span>
                </div>

                <div className="date-info-row">
                  <span className="date-info-label">
                    Tanggal Pengembalian
                  </span>

                  <span className="date-info-val">
                    {formatDate(endDate)}
                  </span>
                </div>

                <div className="date-info-row">
                  <span className="date-info-label">
                    Durasi Penyewaan
                  </span>

                  <span className="date-info-val">
                    {getDuration(order)}
                  </span>
                </div>

              </div>
            </div>

            {/* BUKTI PEMBAYARAN */}

            <div className="detail-section-card">

              <h2 className="detail-card-title">
                BUKTI PEMBAYARAN
              </h2>

              <div className="payment-proof-wrapper">

                {!paymentProof ? (
                  <div
                    style={{
                      padding: '30px',
                      textAlign: 'center',
                      color: '#9ca3af',
                    }}
                  >
                    Belum ada bukti pembayaran.
                  </div>
                ) : (
                  <>
                    {paymentProof
                      .toLowerCase()
                      .match(
                        /\.(jpg|jpeg|png|webp)$/i
                      ) ? (
                      <img
                        src={paymentProof}
                        alt="Bukti Pembayaran"
                        className="payment-proof-img"
                        onClick={() =>
                          window.open(
                            paymentProof,
                            '_blank'
                          )
                        }
                        title="Klik untuk memperbesar"
                      />
                    ) : (
                      <div
                        style={{
                          padding: '30px',
                          textAlign: 'center',
                        }}
                      >
                        <p
                          style={{
                            marginBottom: '15px',
                            fontWeight: 600,
                          }}
                        >
                          Dokumen Bukti Pembayaran
                        </p>

                        <a
                          href={paymentProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-action-detail"
                          style={{
                            textDecoration:
                              'none',
                            display:
                              'inline-block',
                          }}
                        >
                          Lihat Bukti Pembayaran
                        </a>
                      </div>
                    )}
                  </>
                )}

              </div>

              <div className="payment-total-box">

                <span className="payment-total-label">
                  Total Pembayaran
                </span>

                <span className="payment-total-value">
                  {formatPrice(
                    totalPayment
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ======================================================
          MODAL KONFIRMASI PENGAMBILAN
      ====================================================== */}

      {modalType === 'pickup' && (
        <div
          className="order-modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="order-modal-card">

            <div className="order-modal-icon">
              <IconCheck />
            </div>

            <h3 className="order-modal-title">
              Konfirmasi Pengambilan Barang
            </h3>

            <p className="order-modal-text">
              Apakah customer sudah mengambil
              seluruh barang sewaan? Pesanan
              akan berubah menjadi status{' '}
              <strong>
                "Sedang Disewa"
              </strong>.
            </p>

            <div className="order-modal-actions">

              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() =>
                  setModalType(null)
                }
                disabled={actionLoading}
              >
                Batal
              </button>

              <button
                id="btn-modal-confirm-pickup"
                type="button"
                className="btn-modal-submit"
                onClick={() =>
                  handleUpdateStatus(
                    'Sedang Disewa'
                  )
                }
                disabled={actionLoading}
              >
                {actionLoading
                  ? 'Memproses...'
                  : 'Ya, Konfirmasi'}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          MODAL PENGEMBALIAN
      ====================================================== */}

      {modalType === 'return' && (
        <div
          className="order-modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="order-modal-card">

            <div className="order-modal-icon">
              <IconCheck />
            </div>

            <h3 className="order-modal-title">
              Konfirmasi Pengembalian Barang
            </h3>

            <p className="order-modal-text">
              Apakah customer sudah mengembalikan
              seluruh barang sewaan? Pesanan
              akan berubah menjadi status{' '}
              <strong>
                "Selesai"
              </strong>.
            </p>

            <div className="order-modal-actions">

              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() =>
                  setModalType(null)
                }
                disabled={actionLoading}
              >
                Batal
              </button>

              <button
                id="btn-modal-confirm-return"
                type="button"
                className="btn-modal-submit"
                onClick={() =>
                  handleUpdateStatus(
                    'Selesai'
                  )
                }
                disabled={actionLoading}
              >
                {actionLoading
                  ? 'Memproses...'
                  : 'Ya, Selesaikan Pesanan'}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          MODAL TOLAK PEMBAYARAN
      ====================================================== */}

      {modalType === 'reject' && (
        <div
          className="order-modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="order-modal-card">

            <div className="order-modal-icon cancel">
              <IconCross />
            </div>

            <h3 className="order-modal-title">
              Tolak Pembayaran Pesanan
            </h3>

            <p className="order-modal-text">
              Apakah Anda yakin ingin menolak
              pembayaran ini? Status pembayaran
              akan berubah menjadi{' '}
              <strong>
                "Ditolak"
              </strong>.
            </p>

            <div className="order-modal-actions">

              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() =>
                  setModalType(null)
                }
                disabled={actionLoading}
              >
                Batal
              </button>

              <button
                id="btn-modal-confirm-reject"
                type="button"
                className="btn-modal-submit danger"
                onClick={handleRejectPayment}
                disabled={actionLoading}
              >
                {actionLoading
                  ? 'Memproses...'
                  : 'Tolak Pembayaran'}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          MODAL TERLAMBAT
      ====================================================== */}

      {modalType === 'late_return' && (
        <div
          className="order-modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="order-modal-card">

            <div className="order-modal-icon">
              <IconCheck />
            </div>

            <h3 className="order-modal-title">
              Konfirmasi Pengembalian Barang
            </h3>

            <p className="order-modal-text">
              Apakah customer sudah mengembalikan
              seluruh barang pada pesanan ini?
              Pesanan akan berubah menjadi
              status{' '}
              <strong>
                "Selesai"
              </strong>.
            </p>

            <div className="order-modal-actions">

              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() =>
                  setModalType(null)
                }
                disabled={actionLoading}
              >
                Batal
              </button>

              <button
                id="btn-modal-confirm-late-return"
                type="button"
                className="btn-modal-submit"
                onClick={() =>
                  handleUpdateStatus(
                    'Selesai'
                  )
                }
                disabled={actionLoading}
              >
                {actionLoading
                  ? 'Memproses...'
                  : 'Ya, Barang Sudah Dikembalikan'}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminOrderDetail;