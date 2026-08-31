import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { formatPrice } from '../../data/products';
import { getAdminOrderById, updateAdminOrderStatus } from '../../data/ordersStore';
import './AdminOrderDetail.css';

// SVG Icons
const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconCross = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconAlertCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconWhatsApp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

// Calculate dynamic overdue days safely for demo seed orders and real customer orders
function calcOverdueDays(order) {
  if (!order) return 3;

  const orderObj = typeof order === 'string' ? { endDate: order } : order;

  // 1. Check explicit overdueDays on order object (e.g. seed/demo data)
  if (typeof orderObj.overdueDays === 'number' && orderObj.overdueDays > 0) {
    return orderObj.overdueDays;
  }
  if (typeof orderObj.overdueDays === 'string') {
    const num = parseInt(orderObj.overdueDays.match(/\d+/)?.[0] || '', 10);
    if (!isNaN(num) && num > 0) return num;
  }

  // 2. Otherwise calculate from endDate and current date
  const endDateStr = orderObj.endDate;
  if (!endDateStr) return 3;

  const parts = endDateStr.split('/').map((p) => parseInt(p.trim(), 10));
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    const end = new Date(parts[2], parts[1] - 1, parts[0]);
    const today = new Date();

    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - end.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Fallback for seed demo orders if diffDays is excessively large (> 30 days)
    const isSeedDemo = String(orderObj.id || '').includes('ORD-3117') || String(orderObj.cleanId || '').startsWith('3117');
    if (isSeedDemo && diffDays > 30) {
      return 3;
    }

    return diffDays > 0 ? diffDays : 0;
  }

  return 3;
}

function getRentalDurationDays(order, item) {
  if (item && typeof item.durationDays === 'number' && item.durationDays > 0) {
    return item.durationDays;
  }
  if (order && typeof order.durationDays === 'number' && order.durationDays > 0) {
    return order.durationDays;
  }
  if (order && order.duration && typeof order.duration === 'object') {
    if (typeof order.duration.days === 'number' && order.duration.days > 0) {
      return order.duration.days;
    }
  }
  if (order && order.duration) {
    if (typeof order.duration === 'number' && order.duration > 0) {
      return order.duration;
    }
    if (typeof order.duration === 'string') {
      const match = order.duration.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (!isNaN(num) && num > 0) return num;
      }
    }
  }
  if (order && order.startDate && order.endDate) {
    const sParts = String(order.startDate).split('/').map((p) => parseInt(p.trim(), 10));
    const eParts = String(order.endDate).split('/').map((p) => parseInt(p.trim(), 10));
    if (sParts.length === 3 && eParts.length === 3 && !sParts.some(isNaN) && !eParts.some(isNaN)) {
      const dStart = new Date(sParts[2], sParts[1] - 1, sParts[0]);
      const dEnd = new Date(eParts[2], eParts[1] - 1, eParts[0]);
      const diffMs = dEnd.getTime() - dStart.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 0) return diffDays;
    }
  }
  return 1;
}

function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [modalType, setModalType] = useState(null); // 'pickup' | 'return' | 'reject' | 'late_return'

  const loadData = () => {
    const found = getAdminOrderById(id);
    setOrder(found);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('bara_orders_updated', loadData);
    return () => window.removeEventListener('bara_orders_updated', loadData);
  }, [id]);

  if (!order) {
    return (
      <div className="admin-order-detail-page">
        <AdminNavbar />
        <main className="admin-order-detail-main">
          <p style={{ textAlign: 'center', padding: '40px' }}>Memuat pesanan...</p>
        </main>
      </div>
    );
  }

  // Handle status transitions
  const handleUpdateStatus = (newStatus) => {
    updateAdminOrderStatus(order.id, newStatus);
    setModalType(null);
  };

  // Format WhatsApp number
  const cleanPhone = order.phone.replace(/[^0-9]/g, '');
  const formattedWa = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent(
    `Halo ${order.customer}, mengenai pesanan ${order.id} di Bara Rimba Rent:`
  )}`;

  return (
    <div className="admin-order-detail-page">
      <AdminNavbar />

      <main className="admin-order-detail-main">
        {/* Back Link */}
        <Link to="/admin/orders" className="admin-back-btn" id="admin-detail-back-btn">
          <IconArrowLeft />
          <span>Kembali ke Pesanan</span>
        </Link>

        {/* Header Title & Badge */}
        <div className="admin-detail-header-row">
          <h1 className="admin-detail-title">DETAIL PESANAN {order.id}</h1>
          <span className={`status-badge ${order.statusClass} admin-detail-badge`}>
            {order.status}
          </span>
        </div>

        {/* Status Action Banner Box */}
        <div className="admin-status-banner-card">
          <div className="admin-status-step-info">
            {order.status === 'Menunggu Konfirmasi' && (
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#92400e' }}>
                ⏳ Menunggu verifikasi bukti pembayaran dari customer.
              </span>
            )}
            {order.status === 'Dikonfirmasi' && (
              <span className="admin-status-indicator-tag">
                <IconCheck /> Pembayaran Dikonfirmasi
              </span>
            )}
            {order.status === 'Sedang Disewa' && (
              <>
                <span className="admin-status-indicator-tag">
                  <IconCheck /> Pembayaran Dikonfirmasi
                </span>
                <span className="admin-status-indicator-tag">
                  <IconCheck /> Barang Sedang Disewa
                </span>
              </>
            )}
            {order.status === 'Terlambat' && (
              <span className="admin-status-indicator-tag cancel">
                <IconAlertCircle /> Pesanan Terlambat
              </span>
            )}
            {order.status === 'Selesai' && (
              <>
                <span className="admin-status-indicator-tag">
                  <IconCheck /> Pembayaran Dikonfirmasi
                </span>
                <span className="admin-status-indicator-tag">
                  <IconCheck /> Barang Sudah Dikembalikan
                </span>
                <span className="admin-status-indicator-tag">
                  <IconCheck /> Penyewaan Selesai
                </span>
              </>
            )}
            {order.status === 'Dibatalkan' && (
              <span className="admin-status-indicator-tag cancel">
                <IconCross /> Pesanan Dibatalkan
              </span>
            )}
          </div>

          {/* Dynamic Action Buttons based on status */}
          <div className="admin-status-actions-wrapper">
            {order.status === 'Menunggu Konfirmasi' && (
              <>
                <button
                  id="btn-confirm-payment"
                  className="btn-confirm-pay"
                  onClick={() => handleUpdateStatus('Dikonfirmasi')}
                >
                  <IconCheck />
                  <span>Konfirmasi Pembayaran</span>
                </button>
                <button
                  id="btn-reject-payment"
                  className="btn-reject-pay"
                  onClick={() => setModalType('reject')}
                >
                  <IconCross />
                  <span>Tolak Pembayaran</span>
                </button>
              </>
            )}

            {order.status === 'Dikonfirmasi' && (
              <button
                id="btn-confirm-pickup"
                className="btn-confirm-pay"
                onClick={() => setModalType('pickup')}
              >
                <IconCheck />
                <span>Konfirmasi Pengambilan Barang</span>
              </button>
            )}

            {order.status === 'Sedang Disewa' && (
              <button
                id="btn-confirm-return"
                className="btn-confirm-pay"
                onClick={() => setModalType('return')}
              >
                <IconCheck />
                <span>Konfirmasi Pengembalian Barang</span>
              </button>
            )}

            {order.status === 'Terlambat' && (
              <button
                id="btn-late-return"
                className="btn-confirm-pay"
                onClick={() => setModalType('late_return')}
              >
                <IconCheck />
                <span>Barang Sudah Dikembalikan</span>
              </button>
            )}
          </div>
        </div>

        {/* KETERLAMBATAN PENGEMBALIAN CARD (Only when status is Terlambat) */}
        {order.status === 'Terlambat' && (
          <div className="late-info-card" id="late-info-card">
            <div className="late-info-header">
              <IconAlertCircle />
              <span>KETERLAMBATAN PENGEMBALIAN</span>
            </div>
            <div className="late-info-body">
              <h2 className="late-days-title">Terlambat {calcOverdueDays(order)} Hari</h2>
              <p className="late-return-date">
                Seharusnya dikembalikan: <strong>{order.endDate || '19/05/2026'}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Cards Grid Layout */}
        <div className="admin-order-detail-grid">
          {/* LEFT COLUMN */}
          <div className="admin-detail-col">
            {/* DATA CUSTOMER Card */}
            <div className="detail-section-card">
              <h2 className="detail-card-title">DATA CUSTOMER</h2>
              <div className="customer-info-list">
                <div className="customer-info-row">
                  <span className="customer-info-label">Nama Lengkap</span>
                  <span className="customer-info-val">{order.customer}</span>
                </div>
                <div className="customer-info-row">
                  <span className="customer-info-label">Nomor WhatsApp</span>
                  <span className="customer-info-val">{order.phone}</span>
                </div>
                <div className="customer-info-row">
                  <span className="customer-info-label">Email</span>
                  <span className="customer-info-val">{order.email}</span>
                </div>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-chat"
                id="btn-chat-whatsapp"
              >
                <IconWhatsApp />
                <span>Chat WhatsApp</span>
              </a>
            </div>

            {/* DETAIL PENYEWAAN Card */}
            <div className="detail-section-card">
              <h2 className="detail-card-title">DETAIL PENYEWAAN</h2>
              <div className="rent-items-list">
                {(order.items || []).map((item, idx) => {
                  const rentalDays = getRentalDurationDays(order, item);
                  const qty = item.qty || item.quantity || 1;
                  const unitPrice = item.price || 0;
                  const sub = item.subtotal ?? (unitPrice * qty * rentalDays);
                  return (
                    <div className="rent-item-row" key={idx}>
                      <img
                        src={item.image || item.img || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=200'}
                        alt={item.name}
                        className="rent-item-img"
                      />
                      <div className="rent-item-details">
                        <h3 className="rent-item-name">{item.name}</h3>
                        <p className="rent-item-sub">
                          {qty} unit × {rentalDays} Hari
                        </p>
                      </div>
                      <div className="rent-item-price">{formatPrice(sub)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="admin-detail-col">
            {/* TANGGAL PENYEWAAN Card */}
            <div className="detail-section-card">
              <h2 className="detail-card-title">TANGGAL PENYEWAAN</h2>
              <div className="date-info-list">
                <div className="date-info-row">
                  <span className="date-info-label">Tanggal Pengambilan</span>
                  <span className="date-info-val">{order.startDate || '20/05/2026'}</span>
                </div>
                <div className="date-info-row">
                  <span className="date-info-label">Tanggal Pengembalian</span>
                  <span className="date-info-val">{order.endDate || '22/05/2026'}</span>
                </div>
                <div className="date-info-row">
                  <span className="date-info-label">Durasi Penyewaan</span>
                  <span className="date-info-val">{order.duration || '3 Hari'}</span>
                </div>
              </div>
            </div>

            {/* BUKTI PEMBAYARAN Card */}
            <div className="detail-section-card">
              <h2 className="detail-card-title">BUKTI PEMBAYARAN</h2>
              <div className="payment-proof-wrapper">
                <img
                  src={order.paymentProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600'}
                  alt="Bukti Pembayaran"
                  className="payment-proof-img"
                  onClick={() => window.open(order.paymentProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600', '_blank')}
                  title="Klik untuk memperbesar"
                />
              </div>

              <div className="payment-total-box">
                <span className="payment-total-label">Total Pembayaran</span>
                <span className="payment-total-value">
                  {formatPrice(order.totalPayment || order.total || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── MODALS ── */}
      {/* 1. Modal Konfirmasi Pengambilan */}
      {modalType === 'pickup' && (
        <div className="order-modal-overlay" role="dialog" aria-modal="true">
          <div className="order-modal-card">
            <div className="order-modal-icon">
              <IconCheck />
            </div>
            <h3 className="order-modal-title">Konfirmasi Pengambilan Barang</h3>
            <p className="order-modal-text">
              Apakah customer sudah mengambil seluruh barang sewaan? Pesanan akan berubah menjadi status <strong>"Sedang Disewa"</strong>.
            </p>
            <div className="order-modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setModalType(null)}
              >
                Batal
              </button>
              <button
                id="btn-modal-confirm-pickup"
                type="button"
                className="btn-modal-submit"
                onClick={() => handleUpdateStatus('Sedang Disewa')}
              >
                Ya, Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Konfirmasi Pengembalian */}
      {modalType === 'return' && (
        <div className="order-modal-overlay" role="dialog" aria-modal="true">
          <div className="order-modal-card">
            <div className="order-modal-icon">
              <IconCheck />
            </div>
            <h3 className="order-modal-title">Konfirmasi Pengembalian Barang</h3>
            <p className="order-modal-text">
              Apakah customer sudah mengembalikan seluruh barang sewaan? Pesanan akan berubah menjadi status <strong>"Selesai"</strong>.
            </p>
            <div className="order-modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setModalType(null)}
              >
                Batal
              </button>
              <button
                id="btn-modal-confirm-return"
                type="button"
                className="btn-modal-submit"
                onClick={() => handleUpdateStatus('Selesai')}
              >
                Ya, Selesaikan Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Tolak Pembayaran */}
      {modalType === 'reject' && (
        <div className="order-modal-overlay" role="dialog" aria-modal="true">
          <div className="order-modal-card">
            <div className="order-modal-icon cancel">
              <IconCross />
            </div>
            <h3 className="order-modal-title">Tolak Pembayaran Pesanan</h3>
            <p className="order-modal-text">
              Apakah Anda yakin ingin menolak pembayaran ini? Pesanan akan dibatalkan.
            </p>
            <div className="order-modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setModalType(null)}
              >
                Batal
              </button>
              <button
                id="btn-modal-confirm-reject"
                type="button"
                className="btn-modal-submit danger"
                onClick={() => handleUpdateStatus('Dibatalkan')}
              >
                Tolak Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Konfirmasi Barang Sudah Dikembalikan (Terlambat -> Selesai) */}
      {modalType === 'late_return' && (
        <div className="order-modal-overlay" role="dialog" aria-modal="true">
          <div className="order-modal-card">
            <div className="order-modal-icon">
              <IconCheck />
            </div>
            <h3 className="order-modal-title">Konfirmasi Pengembalian Barang</h3>
            <p className="order-modal-text">
              Apakah customer sudah mengembalikan seluruh barang pada pesanan ini?
            </p>
            <div className="order-modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setModalType(null)}
              >
                Batal
              </button>
              <button
                id="btn-modal-confirm-late-return"
                type="button"
                className="btn-modal-submit"
                onClick={() => handleUpdateStatus('Selesai')}
              >
                Ya, Barang Sudah Dikembalikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrderDetail;
