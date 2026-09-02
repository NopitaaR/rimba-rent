import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { formatPrice } from '../../data/products';
import { fetchOrders } from '../../api/OrdersApi';
import './AdminDashboard.css';

// SVG Icons
const IconArrowRight = () => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconAlertCircle = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconClock = () => (
  <svg
    width="18"
    height="18"
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

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      // Ambil pesanan dari Laravel API
      const currentOrders = await fetchOrders();
      setOrders(Array.isArray(currentOrders) ? currentOrders : []);

      // Produk masih menggunakan API/local data yang sudah berjalan
      const products = await fetchProducts();

      const lowStock = (Array.isArray(products) ? products : []).filter(
        (product) => Number(product.stock) <= 3
      );

      setLowStockItems(lowStock);
    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    window.addEventListener(
      'bara_products_updated',
      loadData
    );

    window.addEventListener(
      'storage',
      loadData
    );

    return () => {
      window.removeEventListener(
        'bara_products_updated',
        loadData
      );

      window.removeEventListener(
        'storage',
        loadData
      );
    };
  }, []);

  // =========================
  // STATISTIK
  // =========================

  const totalOrdersCount = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.total_payment || 0),
    0
  );

  const activeRentedOrders = orders.filter(
    (order) =>
      order.status === 'Sedang Disewa' ||
      order.status === 'Terlambat'
  );

  const totalRentedUnits = activeRentedOrders.reduce(
    (sum, order) => {
      const itemsCount = (order.items || []).reduce(
        (itemSum, item) =>
          itemSum + Number(item.quantity || 0),
        0
      );

      return sum + itemsCount;
    },
    0
  );

  const needsConfirmationCount = orders.filter(
    (order) =>
      order.payment_status === 'Menunggu Verifikasi' ||
      order.status === 'Menunggu Konfirmasi'
  ).length;

  const lateOrdersCount = orders.filter(
    (order) => order.status === 'Terlambat'
  ).length;

  // =========================
  // HELPER
  // =========================

  const getStatusClass = (status) => {
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

      default:
        return 'status-muted';
    }
  };

  const getCustomerName = (order) => {
    return order.user?.name || 'Customer';
  };

  const getOrderDate = (order) => {
    if (!order.start_date) {
      return '-';
    }

    const start = new Date(
      order.start_date
    ).toLocaleDateString('id-ID');

    const end = order.end_date
      ? new Date(
        order.end_date
      ).toLocaleDateString('id-ID')
      : '-';

    return (
      <>
        {start}
        <br />
        {end}
      </>
    );
  };

  return (
    <div className="admin-dashboard-page">
      <AdminNavbar />

      <main className="admin-dashboard-main">

        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-dashboard-header">
          <div>
            <h1 className="admin-page-title">
              Dashboard Admin
            </h1>

            <p className="admin-page-subtitle">
              Selamat datang, Admin. Berikut ringkasan
              aktivitas penyewaan hari ini.
            </p>
          </div>
        </div>

        {/* =========================
            STATS
        ========================= */}

        <div className="admin-stats-grid">

          {/* Total Pesanan */}
          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span className="stat-card-title">
                TOTAL PESANAN
              </span>

              <span className="stat-badge info">
                Aktif
              </span>
            </div>

            <div className="stat-card-value">
              {loading ? '...' : totalOrdersCount}
            </div>

            <div className="stat-card-desc">
              Total pesanan masuk
            </div>
          </div>

          {/* Pendapatan */}
          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span className="stat-card-title">
                PENDAPATAN
              </span>

              <span className="stat-badge success">
                Total
              </span>
            </div>

            <div className="stat-card-value">
              {loading
                ? '...'
                : formatPrice(totalRevenue)}
            </div>

            <div className="stat-card-desc">
              Total estimasi sewa
            </div>
          </div>

          {/* Barang Disewa */}
          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span className="stat-card-title">
                BARANG DISEWA
              </span>

              <span className="stat-badge warning">
                {totalRentedUnits} Unit
              </span>
            </div>

            <div className="stat-card-value">
              {loading
                ? '...'
                : totalRentedUnits}
            </div>

            <div className="stat-card-desc">
              Aktif berada di penyewa
            </div>
          </div>

          {/* Perlu Konfirmasi */}
          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span className="stat-card-title">
                PERLU KONFIRMASI
              </span>

              <span className="stat-badge alert">
                {needsConfirmationCount} Baru
              </span>
            </div>

            <div className="stat-card-value">
              {loading
                ? '...'
                : needsConfirmationCount}
            </div>

            <div className="stat-card-desc">
              Bukti bayar diunggah
            </div>
          </div>

        </div>

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <div className="admin-content-grid">

          {/* =========================
              PESANAN TERBARU
          ========================= */}

          <section className="admin-card orders-card">

            <div className="admin-card-header">
              <h2 className="admin-card-title">
                PESANAN TERBARU
              </h2>

              <Link
                to="/admin/orders"
                className="admin-card-link"
              >
                Lihat Semua Pesanan
                <IconArrowRight />
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

                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: 'center',
                          padding: '32px',
                          color: '#9ca3af',
                        }}
                      >
                        Memuat pesanan...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: 'center',
                          padding: '32px',
                          color: '#9ca3af',
                        }}
                      >
                        Belum ada pesanan.
                      </td>
                    </tr>
                  ) : (
                    orders
                      .slice(0, 5)
                      .map((order) => {

                        const orderId =
                          order.order_code ||
                          `ORD-${order.id}`;

                        return (
                          <tr key={order.id}>

                            <td className="font-mono font-semibold">
                              #{orderId}
                            </td>

                            <td>
                              {getCustomerName(order)}
                            </td>

                            <td>
                              {getOrderDate(order)}
                            </td>

                            <td className="font-semibold">
                              {formatPrice(
                                Number(
                                  order.total_payment || 0
                                )
                              )}
                            </td>

                            <td>
                              <span
                                className={`status-badge ${getStatusClass(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>

                            <td>
                              <Link
                                to={`/admin/orders/${order.id}`}
                                className="btn-action-detail"
                                style={{
                                  textDecoration:
                                    'none',
                                  display:
                                    'inline-block',
                                }}
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

          {/* =========================
              RIGHT SIDEBAR
          ========================= */}

          <div className="admin-right-stack">

            {/* STOK HAMPIR HABIS */}

            <section className="admin-card">

              <div className="admin-card-header">
                <h2 className="admin-card-title">
                  STOK HAMPIR HABIS
                </h2>
              </div>

              <div className="low-stock-list">

                {lowStockItems.length === 0 ? (

                  <p
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      margin: 0,
                    }}
                  >
                    Semua produk memiliki stok cukup.
                  </p>

                ) : (

                  lowStockItems.map((item) => (

                    <div
                      key={item.id}
                      className="low-stock-item"
                    >

                      <div>

                        <p className="low-stock-name">
                          {item.name}
                        </p>

                        <p className="low-stock-sub">
                          {item.category}
                        </p>

                      </div>

                      <span className="low-stock-count">
                        Stok:{' '}
                        <strong>
                          {item.stock}
                        </strong>
                      </span>

                    </div>

                  ))

                )}

              </div>

              <div className="admin-card-footer">

                <button
                  className="btn-admin-outline"
                  onClick={() =>
                    navigate('/admin/products')
                  }
                >
                  Kelola Produk
                </button>

              </div>

            </section>

            {/* PERLU DIPERIKSA */}

            <section className="admin-card">

              <div className="admin-card-header">
                <h2 className="admin-card-title">
                  PERLU DIPERIKSA
                </h2>
              </div>

              <div className="attention-list">

                <div className="attention-item warning">

                  <IconClock />

                  <div>

                    <p className="attention-title">
                      {needsConfirmationCount}{' '}
                      Pembayaran
                    </p>

                    <p className="attention-sub">
                      Menunggu konfirmasi admin
                    </p>

                  </div>

                </div>

                <div className="attention-item danger">

                  <IconAlertCircle />

                  <div>

                    <p className="attention-title">
                      {lateOrdersCount}{' '}
                      Pesanan Terlambat
                    </p>

                    <p className="attention-sub">
                      Pengembalian melebihi batas tanggal
                    </p>

                  </div>

                </div>

              </div>

              <div className="admin-card-footer">

                <button
                  className="btn-admin-solid"
                  onClick={() =>
                    navigate('/admin/orders')
                  }
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