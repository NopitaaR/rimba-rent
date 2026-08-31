import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { formatPrice } from '../../data/products';
import { getAdminOrders, updateAdminOrderStatus } from '../../data/ordersStore';
import './AdminDashboard.css';

const STATUS_FILTERS = [
  'Semua',
  'Menunggu Konfirmasi',
  'Dikonfirmasi',
  'Sedang Disewa',
  'Terlambat',
  'Selesai',
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  const loadOrders = () => {
    setOrders(getAdminOrders());
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener('bara_orders_updated', loadOrders);
    return () => window.removeEventListener('bara_orders_updated', loadOrders);
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchStatus = activeFilter === 'Semua' || o.status === activeFilter;
    const matchSearch =
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="admin-dashboard-page">
      <AdminNavbar />

      <main className="admin-dashboard-main">
        <div className="admin-dashboard-header">
          <h1 className="admin-page-title">Pesanan Admin</h1>
          <p className="admin-page-subtitle">
            Kelola seluruh pesanan dan proses penyewaan pelanggan.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '20px',
          }}
        >
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: activeFilter === filter ? '#111827' : '#e5e7eb',
                background: activeFilter === filter ? '#111827' : '#ffffff',
                color: activeFilter === filter ? '#ffffff' : '#374151',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <section className="admin-card">
          <div className="admin-card-header">
            <input
              type="text"
              placeholder="Cari nama customer atau ID pesanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                width: '320px',
              }}
            />
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID PESANAN</th>
                  <th>CUSTOMER</th>
                  <th>TANGGAL SEWA</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                  <th>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                      Tidak ada pesanan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const cleanId = o.cleanId || o.id.replace('#', '');
                    return (
                      <tr key={o.id}>
                        <td className="font-mono font-semibold">{o.id}</td>
                        <td>{o.customer}</td>
                        <td>{o.date}</td>
                        <td className="font-semibold">{formatPrice(o.totalPayment || o.total || 0)}</td>
                        <td>
                          <span className={`status-badge ${o.statusClass}`}>{o.status}</span>
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
      </main>
    </div>
  );
}

export default AdminOrders;
