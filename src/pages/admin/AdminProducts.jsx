import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import AddProductModal from '../../components/AddProductModal';
import { getProducts, CATEGORIES, formatPrice } from '../../data/products';
import './AdminDashboard.css';

function AdminProducts() {
  const navigate = useNavigate();
  const [productList, setProductList] = useState(getProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  const loadProducts = () => {
    setProductList(getProducts());
  };

  useEffect(() => {
    loadProducts();
    window.addEventListener('bara_products_updated', loadProducts);
    return () => window.removeEventListener('bara_products_updated', loadProducts);
  }, []);

  const filteredProducts = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'Semua' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="status-badge status-danger">Stok Habis</span>;
    if (stock <= 3) return <span className="status-badge status-warning">Stok Hampir Habis</span>;
    return <span className="status-badge status-success">Tersedia</span>;
  };

  return (
    <div className="admin-dashboard-page">
      <AdminNavbar />

      <main className="admin-dashboard-main">
        <div className="admin-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="admin-page-title">Kelola Produk</h1>
            <p className="admin-page-subtitle">
              Kelola seluruh perlengkapan camping dan BBQ yang tersedia untuk disewa.
            </p>
          </div>
          <button
            id="btn-open-add-product-modal"
            className="btn-admin-solid"
            style={{ width: 'auto', padding: '10px 20px', cursor: 'pointer' }}
            onClick={() => setShowAddModal(true)}
          >
            + Tambah Produk
          </button>
        </div>

        <section className="admin-card">
          <div className="admin-card-header" style={{ gap: '16px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Cari nama produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                width: '260px',
              }}
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                background: '#fff',
              }}
            >
              <option value="Semua">Semua Kategori</option>
              {CATEGORIES.filter((c) => c !== 'Semua').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>FOTO</th>
                  <th>NAMA PRODUK</th>
                  <th>KATEGORI</th>
                  <th>HARGA / HARI</th>
                  <th>STOK</th>
                  <th>STATUS</th>
                  <th>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.img}
                        alt={p.name}
                        style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </td>
                    <td className="font-semibold">{p.name}</td>
                    <td>{p.category}</td>
                    <td className="font-semibold">{formatPrice(p.price)}</td>
                    <td>{p.stock} unit</td>
                    <td>{getStockBadge(p.stock)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-action-detail"
                          onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal Tambah Produk */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}

export default AdminProducts;
