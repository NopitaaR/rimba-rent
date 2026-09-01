import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import AddProductModal from '../../components/AddProductModal';

import {
  fetchProducts,
  deleteProductApi,
} from '../../api/productsApi';

import {
  CATEGORIES,
  formatPrice,
} from '../../data/products';

import './AdminDashboard.css';

function AdminProducts() {
  const navigate = useNavigate();

  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // ================================
  // AMBIL PRODUK DARI DATABASE
  // ================================
  const loadProducts = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const products = await fetchProducts();

      const formattedProducts = products.map((product) => ({
        ...product,

        // Laravel -> Frontend
        img: product.image,

        desc: product.description
          ? product.description.slice(0, 40) + '...'
          : '',

        badge: product.category
          ? product.category.toUpperCase()
          : 'PRODUK',

        price: Number(product.price),
        stock: Number(product.stock),
      }));

      setProductList(formattedProducts);

    } catch (error) {
      console.error('Gagal mengambil produk:', error);

      setErrorMessage(
        'Gagal mengambil data produk dari server.'
      );

    } finally {
      setLoading(false);
    }
  };


  // ================================
  // LOAD SAAT HALAMAN DIBUKA
  // ================================
  useEffect(() => {
    loadProducts();
  }, []);


  // ================================
  // HAPUS PRODUK
  // ================================
  const handleDeleteProduct = async (product) => {

    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus produk "${product.name}"?`
    );

    if (!isConfirmed) return;

    try {

      await deleteProductApi(product.id);

      alert('Produk berhasil dihapus.');

      // Refresh produk dari database
      loadProducts();

    } catch (error) {

      console.error('Gagal menghapus produk:', error);

      alert(
        error.message ||
        'Gagal menghapus produk.'
      );
    }
  };


  // ================================
  // FILTER PRODUK
  // ================================
  const filteredProducts = productList.filter((p) => {

    const matchSearch =
      p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchCat =
      categoryFilter === 'Semua' ||
      p.category === categoryFilter;

    return matchSearch && matchCat;
  });


  // ================================
  // STATUS STOK
  // ================================
  const getStockBadge = (stock) => {

    if (stock === 0) {
      return (
        <span className="status-badge status-danger">
          Stok Habis
        </span>
      );
    }

    if (stock <= 3) {
      return (
        <span className="status-badge status-warning">
          Stok Hampir Habis
        </span>
      );
    }

    return (
      <span className="status-badge status-success">
        Tersedia
      </span>
    );
  };


  return (
    <div className="admin-dashboard-page">

      <AdminNavbar />

      <main className="admin-dashboard-main">

        {/* ================= HEADER ================= */}

        <div
          className="admin-dashboard-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >

          <div>

            <h1 className="admin-page-title">
              Kelola Produk
            </h1>

            <p className="admin-page-subtitle">
              Kelola seluruh perlengkapan camping dan BBQ
              yang tersedia untuk disewa.
            </p>

          </div>


          <button
            id="btn-open-add-product-modal"
            className="btn-admin-solid"
            style={{
              width: 'auto',
              padding: '10px 20px',
              cursor: 'pointer',
            }}
            onClick={() => setShowAddModal(true)}
          >
            + Tambah Produk
          </button>

        </div>


        {/* ================= CARD ================= */}

        <section className="admin-card">

          {/* SEARCH & FILTER */}

          <div
            className="admin-card-header"
            style={{
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >

            {/* SEARCH */}

            <input
              type="text"
              placeholder="Cari nama produk..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                width: '260px',
              }}
            />


            {/* FILTER KATEGORI */}

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                background: '#fff',
              }}
            >

              <option value="Semua">
                Semua Kategori
              </option>

              {CATEGORIES
                .filter((c) => c !== 'Semua')
                .map((cat) => (

                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>

                ))}

            </select>

          </div>


          {/* ERROR */}

          {errorMessage && (

            <div
              style={{
                color: '#dc2626',
                padding: '15px',
              }}
            >
              {errorMessage}
            </div>

          )}


          {/* LOADING */}

          {loading ? (

            <div
              style={{
                padding: '40px',
                textAlign: 'center',
              }}
            >
              Memuat produk...
            </div>

          ) : (


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

                  {filteredProducts.length > 0 ? (

                    filteredProducts.map((p) => (

                      <tr key={p.id}>

                        {/* FOTO */}

                        <td>

                          <img
                            src={p.img}
                            alt={p.name}
                            style={{
                              width: '44px',
                              height: '44px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }}
                          />

                        </td>


                        {/* NAMA */}

                        <td className="font-semibold">
                          {p.name}
                        </td>


                        {/* KATEGORI */}

                        <td>
                          {p.category}
                        </td>


                        {/* HARGA */}

                        <td className="font-semibold">
                          {formatPrice(p.price)}
                        </td>


                        {/* STOK */}

                        <td>
                          {p.stock} unit
                        </td>


                        {/* STATUS */}

                        <td>
                          {getStockBadge(p.stock)}
                        </td>


                        {/* AKSI */}

                        <td>

                          <div
                            style={{
                              display: 'flex',
                              gap: '8px',
                            }}
                          >

                            {/* EDIT */}

                            <button
                              id={`btn-edit-product-${p.id}`}
                              className="btn-action-detail"
                              onClick={() =>
                                navigate(
                                  `/admin/products/edit/${p.id}`
                                )
                              }
                            >
                              Edit
                            </button>


                            {/* HAPUS */}

                            <button
                              id={`btn-delete-product-${p.id}`}
                              className="btn-action-detail"
                              style={{
                                background: '#fee2e2',
                                color: '#991b1b',
                              }}
                              onClick={() =>
                                handleDeleteProduct(p)
                              }
                            >
                              Hapus
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="7"
                        style={{
                          textAlign: 'center',
                          padding: '30px',
                        }}
                      >
                        Produk tidak ditemukan.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>


      {/* ================= MODAL TAMBAH PRODUK ================= */}

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);

          // Setelah modal ditutup,
          // refresh produk dari database
          loadProducts();
        }}
      />

    </div>
  );
}

export default AdminProducts;