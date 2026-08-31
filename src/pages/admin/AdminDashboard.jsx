import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { formatPrice, getProducts } from '../../data/products';
import { getAdminOrders } from '../../data/ordersStore';
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

function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  const loadData = () => {
    const currentOrders = getAdminOrders();
    setOrders(currentOrders);

    const products = getProducts();
    const lowStock = products.filter((p) => Number(p.stock) <= 3);
    setLowStockItems(lowStock);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('bara_orders_updated', loadData);
    window.addEventListener('bara_products_updated', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('bara_orders_updated', loadData);
      window.removeEventListener('bara_products_updated', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  // Calculate dynamic stats
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalPayment || o.total || 0),
    0
  );

  const activeRentedOrders = orders.filter(
    (o) => o.status === 'Sedang Disewa' || o.status === 'Terlambat'
  );

  const totalRentedUnits = activeRentedOrders.reduce((sum, order) => {
    const itemsCount = (order.items || []).reduce(
      (iSum, item) => iSum + (item.quantity || item.qty || 1),
      0
    );
    return sum + itemsCount;
  }, 0);

  const needsConfirmationCount = orders.filter(
    (o) => o.status === 'Menunggu Konfirmasi'
  ).length;

  const lateOrdersCount = orders.filter(
    (o) => o.status === 'Terlambat'
  ).length;

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
              <span className="stat-badge info">Aktif</span>
            </div>
            <div className="stat-card-value">{totalOrdersCount}</div>
            <div className="stat-card-desc">Total pesanan masuk</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span className="stat-card-title">PENDAPATAN</span>
              <span className="stat-badge success">Total</span>
            </div>
            <div className="stat-card-value">{formatPrice(totalRevenue)}</div>
            <div className="stat-card-desc">Total estimasi sewa</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span className="stat-card-title">BARANG DISEWA</span>
              <span className="stat-badge warning">{totalRentedUnits} Unit</span>
            </div>
            <div className="stat-card-value">{totalRentedUnits}</div>
            <div className="stat-card-desc">Aktif berada di penyewa</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span className="stat-card-title">PERLU KONFIRMASI</span>
              <span className="stat-badge alert">{needsConfirmationCount} Baru</span>
            </div>
            <div className="stat-card-value">{needsConfirmationCount}</div>
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
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                        Belum ada pesanan.
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map((order) => {
                      const cleanId = order.cleanId || order.id.replace('#', '');
                      return (
                        <tr key={order.id}>
                          <td className="font-mono font-semibold">{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.date}</td>
                          <td className="font-semibold">
                            {formatPrice(order.totalPayment || order.total || 0)}
                          </td>
                          <td>
                            <span className={`status-badge ${order.statusClass}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <Link
                              to={`/admin/orders/${cleanId}`}
                              className="btn-action-detail"
                              style={{ textDecoration: 'none', display: 'inline-block' }}
                            >
                              Detail
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
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
                {lowStockItems.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                    Semua produk memiliki stok cukup.
                  </p>
                ) : (
                  lowStockItems.map((item) => (
                    <div key={item.id} className="low-stock-item">
                      <div>
                        <p className="low-stock-name">{item.name}</p>
                        <p className="low-stock-sub">{item.category}</p>
                      </div>
                      <span className="low-stock-count">
                        Stok: <strong>{item.stock}</strong>
                      </span>
                    </div>
                  ))
                )}
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
                    <p className="attention-title">{needsConfirmationCount} Pembayaran</p>
                    <p className="attention-sub">Menunggu konfirmasi admin</p>
                  </div>
                </div>
                <div className="attention-item danger">
                  <IconAlertCircle />
                  <div>
                    <p className="attention-title">{lateOrdersCount} Pesanan Terlambat</p>
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
      </main>
    </div>
  );
}

export default AdminDashboard;