import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { formatPrice } from '../../data/products';
import './AdminDashboard.css';

// SVG Icons
const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconAlertCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconCheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Dummy orders if none in localStorage
const DUMMY_ORDERS = [
  {
    id: '#ORD-311786',
    customer: 'Budi Santoso',
    phone: '081234567890',
    email: 'budi@gmail.com',
    date: '20/05/2026 - 22/05/2026',
    itemsStr: 'Tenda Naturehike (1x), Sleeping Bag (2x)',
    total: 190000,
    status: 'Menunggu Konfirmasi',
    statusClass: 'status-warning',
  },
  {
    id: '#ORD-311785',
    customer: 'Siti Aminah',
    phone: '082198765432',
    email: 'siti@gmail.com',
    date: '21/05/2026 - 23/05/2026',
    itemsStr: 'Carrier 60L (1x), Matras Camping (2x)',
    total: 140000,
    status: 'Dikonfirmasi',
    statusClass: 'status-success',
  },
  {
    id: '#ORD-311784',
    customer: 'Rizky Pratama',
    phone: '085711223344',
    email: 'rizky@gmail.com',
    date: '22/05/2026 - 24/05/2026',
    itemsStr: 'Paket Camping 2 Orang (1x)',
    total: 160000,
    status: 'Sedang Disewa',
    statusClass: 'status-info',
  },
  {
    id: '#ORD-311783',
    customer: 'Dedi Kurniawan',
    phone: '081988776655',
    email: 'dedi@gmail.com',
    date: '17/05/2026 - 19/05/2026',
    itemsStr: 'Peralatan BBQ (1x), Kompor Portable (1x)',
    total: 110000,
    status: 'Terlambat',
    statusClass: 'status-danger',
  },
  {
    id: '#ORD-311782',
    customer: 'Anisa Rahma',
    phone: '083899001122',
    email: 'anisa@gmail.com',
    date: '15/05/2026 - 17/05/2026',
    itemsStr: 'Kursi Camping (2x)',
    total: 60000,
    status: 'Selesai',
    statusClass: 'status-muted',
  },
];

const LOW_STOCK_ITEMS = [
  { name: 'Sleeping Bag', category: 'Perlengkapan Tidur', stock: 2 },
  { name: 'Carrier 60L', category: 'Tas & Carrier', stock: 1 },
  { name: 'Kompor Portable', category: 'Alat Masak', stock: 3 },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Load from bara_history if present, combine with dummy
    try {
      const history = JSON.parse(localStorage.getItem('bara_history') || '[]');
      if (history.length > 0) {
        const formatted = history.map((h) => ({
          id: h.orderId || '#ORD-LOCAL',
          customer: 'User Pelanggan',
          phone: '08123456789',
          email: 'user@gmail.com',
          date: `${h.startDate} - ${h.endDate}`,
          itemsStr: (h.items || []).map((i) => `${i.name} (${i.qty}x)`).join(', '),
          total: h.totalPayment || 0,
          status: 'Menunggu Konfirmasi',
          statusClass: 'status-warning',
        }));
        setOrders([...formatted, ...DUMMY_ORDERS]);
      } else {
        setOrders(DUMMY_ORDERS);
      }
    } catch {
      setOrders(DUMMY_ORDERS);
    }
  }, []);

  const handleConfirmOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'Dikonfirmasi', statusClass: 'status-success' }
          : o
      )
    );
    setSelectedOrder(null);
  };

  const handleRejectOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'Dibatalkan', statusClass: 'status-danger' }
          : o
      )
    );
    setSelectedOrder(null);
  };

  return (
    <div className="admin-dashboard-page">
      <AdminNavbar />

      <main className="admin-dashboard-main">
        {/* Header Title */}
        <div className="admin-dashboard-header">
          <div>
            <h1 className="admin-page-title">Dashboard Admin</h1>
            <p className="admin-page-subtitle">
              Selamat datang, Admin. Berikut ringkasan aktivitas penyewaan hari ini.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span className="stat-card-title">TOTAL PESANAN</span>
              <span className="stat-badge info">+12%</span>
            </div>
            <div className="stat-card-value">42</div>
            <div className="stat-card-desc">Bulan ini</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span className="stat-card-title">PENDAPATAN</span>
              <span className="stat-badge success">+18%</span>
            </div>
            <div className="stat-card-value">{formatPrice(4850000)}</div>
            <div className="stat-card-desc">Total estimasi sewa</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span className="stat-card-title">BARANG DISEWA</span>
              <span className="stat-badge warning">18 Unit</span>
            </div>
            <div className="stat-card-value">18</div>
            <div className="stat-card-desc">Aktif berada di penyewa</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span className="stat-card-title">PERLU KONFIRMASI</span>
              <span className="stat-badge alert">3 Baru</span>
            </div>
            <div className="stat-card-value">3</div>
            <div className="stat-card-desc">Bukti bayar diunggah</div>
          </div>
        </div>

        {/* Main Content Grid (Left Table + Right Sidebar Cards) */}
        <div className="admin-content-grid">
          {/* Left: Recent Orders Table */}
          <section className="admin-card orders-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">PESANAN TERBARU</h2>
              <Link to="/admin/orders" className="admin-card-link">
                Lihat Semua Pesanan <IconArrowRight />
              </Link>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID PESANAN</th>
                    <th>CUSTOMER</th>
                    <th>TANGGAL</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td className="font-mono font-semibold">{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td className="font-semibold">{formatPrice(order.total)}</td>
                      <td>
                        <span className={`status-badge ${order.statusClass}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-action-detail"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Right Column Stack */}
          <div className="admin-right-stack">
            {/* Card: Stok Hampir Habis */}
            <section className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">STOK HAMPIR HABIS</h2>
              </div>
              <div className="low-stock-list">
                {LOW_STOCK_ITEMS.map((item, idx) => (
                  <div key={idx} className="low-stock-item">
                    <div>
                      <p className="low-stock-name">{item.name}</p>
                      <p className="low-stock-sub">{item.category}</p>
                    </div>
                    <span className="low-stock-count">
                      Stok: <strong>{item.stock}</strong>
                    </span>
                  </div>
                ))}
              </div>
              <div className="admin-card-footer">
                <button
                  className="btn-admin-outline"
                  onClick={() => navigate('/admin/products')}
                >
                  Kelola Produk
                </button>
              </div>
            </section>

            {/* Card: Perlu Diperiksa */}
            <section className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">PERLU DIPERIKSA</h2>
              </div>
              <div className="attention-list">
                <div className="attention-item warning">
                  <IconClock />
                  <div>
                    <p className="attention-title">3 Pembayaran</p>
                    <p className="attention-sub">Menunggu konfirmasi admin</p>
                  </div>
                </div>
                <div className="attention-item danger">
                  <IconAlertCircle />
                  <div>
                    <p className="attention-title">1 Pesanan Terlambat</p>
                    <p className="attention-sub">Pengembalian melebihi batas tanggal</p>
                  </div>
                </div>
              </div>
              <div className="admin-card-footer">
                <button
                  className="btn-admin-solid"
                  onClick={() => navigate('/admin/orders')}
                >
                  Lihat Pesanan
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Modal Detail Pesanan */}
        {selectedOrder && (
          <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div
              className="admin-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal-header">
                <h3>Detail Pesanan {selectedOrder.id}</h3>
                <button
                  className="admin-modal-close"
                  onClick={() => setSelectedOrder(null)}
                >
                  <IconX />
                </button>
              </div>

              <div className="admin-modal-body">
                <div className="modal-info-row">
                  <span className="modal-label">Customer:</span>
                  <span className="modal-val font-semibold">{selectedOrder.customer}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-label">Kontak:</span>
                  <span className="modal-val">{selectedOrder.phone} ({selectedOrder.email})</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-label">Tanggal Sewa:</span>
                  <span className="modal-val">{selectedOrder.date}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-label">Item disewa:</span>
                  <span className="modal-val">{selectedOrder.itemsStr}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-label">Total Pembayaran:</span>
                  <span className="modal-val font-bold text-lg">
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-label">Status saat ini:</span>
                  <span className={`status-badge ${selectedOrder.statusClass}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="modal-proof-preview">
                  <p className="modal-proof-title">Bukti Pembayaran (Simulasi):</p>
                  <div className="proof-img-placeholder">
                    <IconCheckCircle />
                    <span>Bukti Transfer QRIS Terverifikasi</span>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  className="btn-modal-reject"
                  onClick={() => handleRejectOrder(selectedOrder.id)}
                >
                  Tolak Pembayaran
                </button>
                <button
                  className="btn-modal-confirm"
                  onClick={() => handleConfirmOrder(selectedOrder.id)}
                >
                  Konfirmasi Pembayaran
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;