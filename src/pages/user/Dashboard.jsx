import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, CATEGORIES, formatPrice } from '../../data/products';
import { fetchProducts } from '../../api/productsApi';
import { useCart } from '../../context/CartContext';
import './Dashboard.css';

// ── SVG Icons ──────────────────────────────────────────
const IconHamburger = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconCart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconInfo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconHistory = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconProfile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="9" r="3" />
    <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" />
  </svg>
);



// ── Product Card ───────────────────────────────────────
function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="dash-product-card"
      aria-label={`Lihat detail ${product.name}`}
    >
      {/* Gambar + badge kategori */}
      <div className="dash-card-img-wrap">
        <img
          className="dash-card-img"
          src={product.img}
          alt={product.name}
          loading="lazy"
        />
        <span className="dash-card-badge">{product.badge}</span>
      </div>

      {/* Konten card */}
      <div className="dash-card-body">
        <h3 className="dash-card-name">{product.name}</h3>
        <p className="dash-card-desc">{product.desc}</p>
        <p className="dash-card-stock">Stok tersedia: {product.stock}</p>
        <div className="dash-card-price-row">
          <span className="dash-card-price">{formatPrice(product.price)}</span>
          <span className="dash-card-price-unit">/ hari</span>
        </div>
      </div>
    </Link>
  );
}

// ── Dashboard ──────────────────────────────────────────
function Dashboard() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [productList, setProductList] = useState([]);

  const { totalItems } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();

        const formattedProducts = products.map((product) => ({
          ...product,

          // Sesuaikan nama field Laravel dengan frontend
          img: product.image,
          desc: product.description
            ? product.description.slice(0, 40) + '...'
            : '',

          badge: product.category
            ? product.category.toUpperCase()
            : 'PRODUK',

          // Pastikan angka
          price: Number(product.price),
          stock: Number(product.stock),
        }));

        setProductList(formattedProducts);
      } catch (error) {
        console.error('Gagal mengambil produk dari API:', error);

        // Fallback sementara supaya website tetap berjalan
        setProductList(getProducts());
      }
    };

    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    return productList.filter((p) => {
      const matchCat =
        activeCategory === 'Semua' || p.category === activeCategory;
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.desc.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory, productList]);

  return (
    <div className="dashboard-page">
      {/* ── NAVBAR (sesuai Figma) ── */}
      <nav className="dash-navbar">
        <div className="dash-navbar-inner">
          {/* Kiri: hamburger + brand */}
          <div className="dash-navbar-left">
            <button className="dash-hamburger-btn" aria-label="Menu">
              <IconHamburger />
            </button>
            <Link to="/dashboard" className="dash-brand-text">
              BARA RIMBA RENT
            </Link>
          </div>

          {/* Kanan: cart badge, info, profile */}
          <div className="dash-navbar-right">
            <Link to="/cart" className="dash-icon-btn" aria-label="Keranjang">
              <IconCart />
              {totalItems > 0 && (
                <span className="dash-cart-badge">{totalItems}</span>
              )}
            </Link>
            <Link to="/riwayat" className="dash-icon-btn" aria-label="Riwayat Pesanan" title="Riwayat Pesanan" id="dash-nav-history">
              <IconHistory />
            </Link>
            <Link to="/information" className="dash-icon-btn" aria-label="Informasi" title="Informasi" id="dash-info-btn">
              <IconInfo />
            </Link>
            <Link to="/profile" className="dash-icon-btn" aria-label="Profil" id="dash-nav-profile">
              <IconProfile />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div className="dash-content">

        {/* Search bar */}
        <div className="dash-search-wrapper">
          <span className="dash-search-icon">
            <IconSearch />
          </span>
          <input
            id="dash-search"
            type="search"
            className="dash-search-input"
            placeholder="Cari perlengkapan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Kategori pills — 5 sesuai Figma */}
        <div className="dash-categories" role="group" aria-label="Kategori produk">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`dash-cat-pill${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="dash-product-grid">
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="dash-empty">
              <div className="dash-empty-icon">🔍</div>
              <p className="dash-empty-title">Produk tidak ditemukan</p>
              <p className="dash-empty-desc">Coba kata kunci lain atau pilih kategori yang berbeda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;