import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { formatPrice } from '../../data/products';
import {
  fetchOrders,
  verifyPayment,
  rejectPayment,
} from '../../api/OrdersApi';
import './AdminDashboard.css';

const STATUS_FILTERS = [
  'Semua',
  'Menunggu Konfirmasi',
  'Dikonfirmasi',
  'Sedang Disewa',
  'Terlambat',
  'Selesai',
];

const API_BASE_URL = 'http://127.0.0.1:8000';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await fetchOrders();

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Gagal mengambil pesanan:', error);
      alert('Gagal mengambil data pesanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

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

  const filteredOrders = orders.filter((order) => {
    const customerName =
      order.user?.name ||
      order.customer ||
      'Customer';

    const orderId =
      order.order_code ||
      order.id?.toString() ||
      '';

    const matchStatus =
      activeFilter === 'Semua' ||
      order.status === activeFilter;

    const search = searchTerm.toLowerCase();

    const matchSearch =
      customerName.toLowerCase().includes(search) ||
      orderId.toLowerCase().includes(search);

    return matchStatus && matchSearch;
  });

  const handleVerifyPayment = async (order) => {
    const confirmed = window.confirm(
      `Verifikasi pembayaran pesanan ${order.order_code}?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(order.id);

      await verifyPayment(order.id);

      alert('Pembayaran berhasil diverifikasi.');

      setShowProofModal(false);
      setSelectedOrder(null);

      await loadOrders();
    } catch (error) {
      console.error('Gagal verifikasi pembayaran:', error);
      alert(error.message || 'Gagal memverifikasi pembayaran.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectPayment = async (order) => {
    const confirmed = window.confirm(
      `Tolak pembayaran pesanan ${order.order_code}?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(order.id);

      await rejectPayment(order.id);

      alert('Pembayaran berhasil ditolak.');

      setShowProofModal(false);
      setSelectedOrder(null);

      await loadOrders();
    } catch (error) {
      console.error('Gagal menolak pembayaran:', error);
      alert(error.message || 'Gagal menolak pembayaran.');
    } finally {
      setProcessingId(null);
    }
  };

  const getProofUrl = (paymentProof) => {
    if (!paymentProof) return null;

    if (paymentProof.startsWith('http')) {
      return paymentProof;
    }

    return `${API_BASE_URL}/storage/${paymentProof}`;
  };

  const openProofModal = (order) => {
    setSelectedOrder(order);
    setShowProofModal(true);
  };

  const closeProofModal = () => {
    if (processingId) return;

    setShowProofModal(false);
    setSelectedOrder(null);
  };

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

        {/* Filter */}
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
                borderColor:
                  activeFilter === filter
                    ? '#111827'
                    : '#e5e7eb',
                background:
                  activeFilter === filter
                    ? '#111827'
                    : '#ffffff',
                color:
                  activeFilter === filter
                    ? '#ffffff'
                    : '#374151',
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
          {/* Search */}
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
                outline: 'none',
              }}
            />
          </div>

          {/* Table */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID PESANAN</th>
                  <th>CUSTOMER</th>
                  <th>TANGGAL SEWA</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                  <th>PEMBAYARAN</th>
                  <th>AKSI</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: 'center',
                        padding: '32px',
                        color: '#9ca3af',
                      }}
                    >
                      Memuat pesanan...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: 'center',
                        padding: '32px',
                        color: '#9ca3af',
                      }}
                    >
                      Tidak ada pesanan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const customerName =
                      order.user?.name ||
                      order.customer ||
                      'Customer';

                    const orderCode =
                      order.order_code ||
                      `#${order.id}`;

                    const paymentStatus =
                      order.payment_status ||
                      'Menunggu Pembayaran';

                    return (
                      <tr key={order.id}>
                        <td className="font-mono font-semibold">
                          {orderCode}
                        </td>

                        <td>
                          {customerName}
                        </td>

                        <td>
                          {order.start_date
                            ? new Date(
                              order.start_date
                            ).toLocaleDateString(
                              'id-ID'
                            )
                            : '-'}
                          {' - '}
                          {order.end_date
                            ? new Date(
                              order.end_date
                            ).toLocaleDateString(
                              'id-ID'
                            )
                            : '-'}
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
                          <span
                            className={`status-badge ${paymentStatus === 'Dibayar'
                                ? 'status-success'
                                : paymentStatus === 'Ditolak'
                                  ? 'status-danger'
                                  : 'status-warning'
                              }`}
                          >
                            {paymentStatus}
                          </span>
                        </td>

                        <td>
                          <div
                            style={{
                              display: 'flex',
                              gap: '6px',
                              flexWrap: 'wrap',
                            }}
                          >
                            {order.payment_proof && (
                              <button
                                className="btn-action-detail"
                                onClick={() =>
                                  openProofModal(order)
                                }
                              >
                                Bukti
                              </button>
                            )}

                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="btn-action-detail"
                              style={{
                                textDecoration: 'none',
                                display: 'inline-block',
                              }}
                            >
                              Detail
                            </Link>
                          </div>
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

      {/* Modal Bukti Pembayaran */}
      {showProofModal && selectedOrder && (
        <div
          className="admin-modal-overlay"
          onClick={closeProofModal}
        >
          <div
            className="admin-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3>
                Bukti Pembayaran
              </h3>

              <button
                className="admin-modal-close"
                onClick={closeProofModal}
                disabled={!!processingId}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="modal-info-row">
                <span className="modal-label">
                  ID Pesanan
                </span>

                <strong className="modal-val">
                  {selectedOrder.order_code}
                </strong>
              </div>

              <div className="modal-info-row">
                <span className="modal-label">
                  Customer
                </span>

                <strong className="modal-val">
                  {selectedOrder.user?.name ||
                    'Customer'}
                </strong>
              </div>

              <div className="modal-info-row">
                <span className="modal-label">
                  Total Pembayaran
                </span>

                <strong className="modal-val">
                  {formatPrice(
                    Number(
                      selectedOrder.total_payment || 0
                    )
                  )}
                </strong>
              </div>

              <div className="modal-info-row">
                <span className="modal-label">
                  Status Pembayaran
                </span>

                <strong className="modal-val">
                  {selectedOrder.payment_status}
                </strong>
              </div>

              <div className="modal-proof-preview">
                <p className="modal-proof-title">
                  BUKTI TRANSFER
                </p>

                {(() => {
                  const proofUrl = getProofUrl(
                    selectedOrder.payment_proof
                  );

                  if (!proofUrl) {
                    return (
                      <div className="proof-img-placeholder">
                        Bukti pembayaran tidak tersedia.
                      </div>
                    );
                  }

                  const isPdf =
                    proofUrl
                      .toLowerCase()
                      .includes('.pdf');

                  if (isPdf) {
                    return (
                      <div className="proof-img-placeholder">
                        <a
                          href={proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'inherit',
                            textDecoration: 'none',
                          }}
                        >
                          📄 Buka Bukti Pembayaran PDF
                        </a>
                      </div>
                    );
                  }

                  return (
                    <img
                      src={proofUrl}
                      alt="Bukti pembayaran"
                      style={{
                        width: '100%',
                        maxHeight: '360px',
                        objectFit: 'contain',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb',
                      }}
                    />
                  );
                })()}
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="btn-modal-reject"
                onClick={() =>
                  handleRejectPayment(selectedOrder)
                }
                disabled={!!processingId}
              >
                {processingId === selectedOrder.id
                  ? 'Memproses...'
                  : 'Tolak'}
              </button>

              <button
                className="btn-modal-confirm"
                onClick={() =>
                  handleVerifyPayment(selectedOrder)
                }
                disabled={!!processingId}
              >
                {processingId === selectedOrder.id
                  ? 'Memproses...'
                  : 'Verifikasi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;