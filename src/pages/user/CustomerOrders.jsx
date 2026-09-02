import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../data/products';
import { fetchOrders } from '../../api/OrdersApi';
import { getStatusClass } from '../../data/ordersStore';
import './CustomerOrders.css';

// ── SVG Icons ─────────────────────────────────────────────
const IconCart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconHistory = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconInfo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconProfile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="9" r="3" />
    <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" />
  </svg>
);

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconPackage = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// ── Helper: Calculate exact rental duration days ──────────
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
    const sParts = String(order.startDate).split(/[\/\-]/).map((p) => parseInt(p.trim(), 10));
    const eParts = String(order.endDate).split(/[\/\-]/).map((p) => parseInt(p.trim(), 10));
    if (sParts.length === 3 && eParts.length === 3 && !sParts.some(isNaN) && !eParts.some(isNaN)) {
      let dStart, dEnd;
      if (sParts[0] > 1000) {
        dStart = new Date(sParts[0], sParts[1] - 1, sParts[2]);
        dEnd = new Date(eParts[0], eParts[1] - 1, eParts[2]);
      } else {
        dStart = new Date(sParts[2], sParts[1] - 1, sParts[0]);
        dEnd = new Date(eParts[2], eParts[1] - 1, eParts[0]);
      }
      const diffMs = dEnd.getTime() - dStart.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 0) return diffDays;
    }
  }
  return 1;
}

// ── Helper: Get logged-in user ────────────────────────────
function getCurrentUser() {
  try {
    const saved = localStorage.getItem('currentUser');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading currentUser:', e);
  }
  return { name: 'User Pelanggan', email: 'user@gmail.com' };
}

function getProductImageUrl(image) {
  if (!image) {
    return 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=200';
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  if (image.startsWith('/storage/')) {
    return `http://127.0.0.1:8000${image}`;
  }

  if (image.startsWith('storage/')) {
    return `http://127.0.0.1:8000/${image}`;
  }

  return `http://127.0.0.1:8000/storage/${image}`;
}

// ── Helper: Filter orders strictly for currentUser ──────
function filterOrdersForUser(allOrders, user) {
  if (!user || !Array.isArray(allOrders)) return [];

  const currentUserId = Number(user.id);

  return allOrders.filter((order) => {
    // Prioritas utama: user_id dari database
    if (currentUserId && Number(order.user_id) === currentUserId) {
      return true;
    }

    // Fallback berdasarkan data user dari Laravel
    const userEmail = (user.email || '').toLowerCase().trim();
    const orderEmail = (order.user?.email || order.email || '').toLowerCase().trim();

    if (userEmail && orderEmail && userEmail === orderEmail) {
      return true;
    }

    return false;
  });
}

const FILTER_TABS = ['Semua', 'Sedang Diproses', 'Selesai', 'Terlambat'];

function CustomerOrders() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load orders from Laravel API
  const refreshOrders = async () => {
    try {
      const user = getCurrentUser();
      setCurrentUser(user);

      const allOrders = await fetchOrders();
      const userOrders = filterOrdersForUser(allOrders, user);

      // Mapping data Laravel → format yang dipakai UI
      const mappedOrders = userOrders.map((order) => ({
        ...order,

        id: order.order_code || `#${order.id}`,

        startDate: order.start_date,
        endDate: order.end_date,

        durationDays: Number(order.duration_days) || 1,
        duration: `${Number(order.duration_days) || 1} Hari`,

        totalPayment: Number(order.total_payment) || 0,

        customer:
          order.user?.name ||
          order.customer ||
          user.name ||
          user.namaLengkap ||
          'Pelanggan',

        email:
          order.user?.email ||
          order.email ||
          user.email ||
          '-',

        phone:
          order.user?.phone ||
          order.phone ||
          user.phone ||
          user.nomorWhatsApp ||
          '-',

        items: (order.items || []).map((item) => ({
          ...item,

          name: item.product_name || item.product?.name || 'Produk',

          price: Number(item.price) || 0,

          quantity: Number(item.quantity) || 1,

          qty: Number(item.quantity) || 1,

          durationDays:
            Number(item.duration_days) ||
            Number(order.duration_days) ||
            1,

          subtotal: Number(item.subtotal) || 0,

          image: getProductImageUrl(item.product?.image),
        })),
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error('Gagal mengambil riwayat pesanan:', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    refreshOrders();

    const handleUpdate = () => {
      refreshOrders();
    };

    window.addEventListener('bara_orders_updated', handleUpdate);
    window.addEventListener('bara_user_updated', handleUpdate);

    return () => {
      window.removeEventListener('bara_orders_updated', handleUpdate);
      window.removeEventListener('bara_user_updated', handleUpdate);
    };
  }, []);

  // Sync selected order when paramId changes or orders update
  useEffect(() => {
    if (paramId && orders.length > 0) {
      const search = paramId.replace('#', '').toLowerCase();
      const found = orders.find(
        (o) => o.cleanId?.toLowerCase() === search || o.id.replace('#', '').toLowerCase() === search
      );
      if (found) setSelectedOrder(found);
    }
  }, [paramId, orders]);

  // Keep selectedOrder status synced if Admin updates status while detail is open
  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find((o) => o.id === selectedOrder.id || o.cleanId === selectedOrder.cleanId);
      if (updated && updated.status !== selectedOrder.status) {
        setSelectedOrder(updated);
      }
    }
  }, [orders, selectedOrder]);

  // Tab Filtering
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'Semua') return true;
    if (activeTab === 'Sedang Diproses') {
      return o.status === 'Menunggu Konfirmasi' || o.status === 'Dikonfirmasi' || o.status === 'Sedang Disewa';
    }
    if (activeTab === 'Selesai') return o.status === 'Selesai';
    if (activeTab === 'Terlambat') return o.status === 'Terlambat' || o.status === 'Dibatalkan';
    return true;
  });

  return (
    <div className="cust-orders-page">
      {/* ── NAVBAR ── */}
      <nav className="cust-orders-navbar">
        <div className="cust-orders-navbar-inner">
          <Link to="/dashboard" className="cust-orders-brand-text">
            BARA RIMBA RENT
          </Link>
          <div className="cust-orders-navbar-right">
            <Link to="/cart" className="cust-orders-icon-btn" aria-label="Keranjang" id="cust-nav-cart">
              <IconCart />
              {totalItems > 0 && <span className="dash-cart-badge">{totalItems}</span>}
            </Link>
            <Link to="/riwayat" className="cust-orders-icon-btn active" aria-label="Riwayat Pesanan" title="Riwayat Pesanan" id="cust-nav-history">
              <IconHistory />
            </Link>
            <Link to="/information" className="cust-orders-icon-btn" aria-label="Informasi" title="Informasi" id="cust-nav-info">
              <IconInfo />
            </Link>
            <Link to="/profile" className="cust-orders-icon-btn" aria-label="Profil" id="cust-nav-profile">
              <IconProfile />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="cust-orders-content">
        {/* Header Section */}
        <div className="cust-orders-header">
          <div>
            <h1 className="cust-orders-title">RIWAYAT PESANAN</h1>
            <p className="cust-orders-subtitle">
              Lihat dan pantau seluruh pesanan penyewaan perlengkapan camping milik Anda.
            </p>
          </div>

          {/* Customer info pill */}
          <div className="cust-orders-user-badge">
            <span>Customer:</span>
            <strong>{currentUser.name || currentUser.namaLengkap || 'Pelanggan'}</strong>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="cust-orders-tabs" role="tablist">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`cust-orders-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List / Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="cust-orders-empty">
            <div className="cust-orders-empty-icon">
              <IconPackage />
            </div>
            <h3 className="cust-orders-empty-title">
              {activeTab === 'Semua' ? 'Belum Ada Pesanan' : `Tidak ada pesanan dengan status "${activeTab}"`}
            </h3>
            <p className="cust-orders-empty-desc">
              {activeTab === 'Semua'
                ? 'Anda belum memiliki riwayat pemesanan. Mulai sewa alat camping & BBQ sekarang!'
                : 'Coba pilih tab filter status pesanan yang lain.'}
            </p>
            {activeTab === 'Semua' && (
              <Link to="/dashboard" className="cust-orders-empty-btn" id="cust-orders-shop-now-btn">
                Sewa Perlengkapan Sekarang
              </Link>
            )}
          </div>
        ) : (
          <div className="cust-orders-list">
            {filteredOrders.map((order) => {
              const statusCls = getStatusClass(order.status);
              const itemsList = order.items || [];
              const rentalDays = getRentalDurationDays(order);

              return (
                <div key={order.id} className="cust-order-card">
                  {/* Card Header */}
                  <div className="cust-order-card-header">
                    <div className="cust-order-header-left">
                      <span className="cust-order-id">{order.id}</span>
                      <span className="cust-order-date-text">
                        <IconCalendar />
                        {order.date || `${order.startDate} - ${order.endDate}`}
                      </span>
                    </div>
                    <span className={`status-badge ${statusCls}`}>{order.status}</span>
                  </div>

                  {/* Card Body - Products List */}
                  <div className="cust-order-card-body">
                    <div className="cust-order-items-preview">
                      {itemsList.map((item, idx) => {
                        const itemQty = item.qty || item.quantity || 1;
                        const itemDays = getRentalDurationDays(order, item);
                        const itemSubtotal = item.subtotal ?? ((item.price || 0) * itemQty * itemDays);

                        return (
                          <div key={idx} className="cust-order-item-row">
                            <img
                              src={item.image || item.img || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=200'}
                              alt={item.name}
                              className="cust-order-item-img"
                            />
                            <div className="cust-order-item-info">
                              <h4 className="cust-order-item-name">{item.name}</h4>
                              <p className="cust-order-item-meta">
                                {formatPrice(item.price || 0)} × {itemQty} unit × {itemDays} Hari
                              </p>
                            </div>
                            <div className="cust-order-item-price">
                              {formatPrice(itemSubtotal)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Card Footer / Summary */}
                    <div className="cust-order-card-footer">
                      <div className="cust-order-duration-info">
                        Durasi Penyewaan: <strong>{order.duration || `${rentalDays} Hari`}</strong>
                      </div>
                      <div className="cust-order-footer-right">
                        <div className="cust-order-total-group">
                          <span className="cust-order-total-lbl">Total Pembayaran</span>
                          <span className="cust-order-total-val">
                            {formatPrice(order.totalPayment || order.total || 0)}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="cust-order-detail-btn"
                          onClick={() => setSelectedOrder(order)}
                          id={`cust-order-detail-btn-${order.cleanId || order.id.replace('#', '')}`}
                        >
                          Detail Pesanan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── ORDER DETAIL MODAL / OVERLAY ── */}
      {selectedOrder && (
        <div className="cust-modal-overlay" role="dialog" aria-modal="true">
          <div className="cust-modal-card">
            {/* Modal Header */}
            <div className="cust-modal-header">
              <div className="cust-modal-header-left">
                <h2 className="cust-modal-title">DETAIL PESANAN {selectedOrder.id}</h2>
                <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <button
                type="button"
                className="cust-modal-close-btn"
                onClick={() => {
                  setSelectedOrder(null);
                  if (paramId) navigate('/riwayat');
                }}
                aria-label="Tutup detail"
              >
                <IconClose />
              </button>
            </div>

            {/* Modal Body */}
            <div className="cust-modal-body">
              {/* Order Info Grid */}
              <div className="cust-detail-grid">
                {/* Tanggal & Durasi Card */}
                <div className="cust-detail-card-box">
                  <h3 className="cust-detail-box-title">INFORMASI PENYEWAAN</h3>
                  <div className="cust-detail-box-rows">
                    <div className="cust-detail-box-row">
                      <span>Tanggal Pengambilan</span>
                      <strong>{selectedOrder.startDate || '-'}</strong>
                    </div>
                    <div className="cust-detail-box-row">
                      <span>Tanggal Pengembalian</span>
                      <strong>{selectedOrder.endDate || '-'}</strong>
                    </div>
                    <div className="cust-detail-box-row">
                      <span>Durasi Penyewaan</span>
                      <strong>{selectedOrder.duration || `${getRentalDurationDays(selectedOrder)} Hari`}</strong>
                    </div>
                  </div>
                </div>

                {/* Data Customer Card */}
                <div className="cust-detail-card-box">
                  <h3 className="cust-detail-box-title">DATA PEMESAN</h3>
                  <div className="cust-detail-box-rows">
                    <div className="cust-detail-box-row">
                      <span>Nama Penyewa</span>
                      <strong>{selectedOrder.customer}</strong>
                    </div>
                    <div className="cust-detail-box-row">
                      <span>Nomor WhatsApp</span>
                      <strong>{selectedOrder.phone}</strong>
                    </div>
                    <div className="cust-detail-box-row">
                      <span>Email</span>
                      <strong>{selectedOrder.email}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List Table */}
              <div className="cust-detail-items-section">
                <h3 className="cust-detail-box-title">RINCIAN PRODUK SEWA</h3>
                <div className="cust-detail-items-table-wrapper">
                  <table className="cust-detail-table">
                    <thead>
                      <tr>
                        <th>PRODUK</th>
                        <th>HARGA / HARI</th>
                        <th>QTY</th>
                        <th>DURASI</th>
                        <th style={{ textAlign: 'right' }}>SUBTOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedOrder.items || []).map((item, idx) => {
                        const itemQty = item.qty || item.quantity || 1;
                        const itemDays = getRentalDurationDays(selectedOrder, item);
                        const unitPrice = item.price || 0;
                        const itemSubtotal = item.subtotal ?? (unitPrice * itemQty * itemDays);

                        return (
                          <tr key={idx}>
                            <td>
                              <div className="cust-table-item-cell">
                                <img
                                  src={item.image || item.img || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=200'}
                                  alt={item.name}
                                  className="cust-table-item-img"
                                />
                                <span className="cust-table-item-name">{item.name}</span>
                              </div>
                            </td>
                            <td>{formatPrice(unitPrice)}</td>
                            <td>{itemQty} unit</td>
                            <td>{itemDays} Hari</td>
                            <td style={{ textAlign: 'right', fontWeight: '700' }}>
                              {formatPrice(itemSubtotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Payment Summary Box */}
              <div className="cust-detail-total-box">
                <div className="cust-detail-total-row">
                  <span>Total Pembayaran</span>
                  <strong className="cust-detail-total-amount">
                    {formatPrice(selectedOrder.totalPayment || selectedOrder.total || 0)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="cust-modal-footer">
              <button
                type="button"
                className="cust-modal-btn-close"
                onClick={() => {
                  setSelectedOrder(null);
                  if (paramId) navigate('/riwayat');
                }}
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerOrders;
