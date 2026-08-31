import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, formatPrice } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

// ── SVG Icons ──────────────────────────────────────────
const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconCart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9"  cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const IconHistory = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconProfile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="9"  r="3"/>
    <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"/>
  </svg>
);

const IconInfo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8"  x2="12.01" y2="8"/>
  </svg>
);

const IconCartBtn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9"  cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

// ── Quantity Selector ───────────────────────────────────
function QuantitySelector({ quantity, onDecrement, onIncrement, maxStock }) {
  return (
    <div className="pd-qty-selector">
      <button
        className="pd-qty-btn"
        onClick={onDecrement}
        disabled={quantity <= 1}
        aria-label="Kurangi kuantitas"
        id="pd-qty-decrement"
      >
        −
      </button>
      <span className="pd-qty-value" aria-live="polite">{quantity}</span>
      <button
        className="pd-qty-btn"
        onClick={onIncrement}
        disabled={quantity >= maxStock}
        aria-label="Tambah kuantitas"
        id="pd-qty-increment"
      >
        +
      </button>
    </div>
  );
}

// ── Product Detail Page ─────────────────────────────────
function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();

  const [product, setProduct] = useState(() => getProductById(id));
  const [quantity, setQuantity] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);
  const [stockFull, setStockFull] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setProduct(getProductById(id));
    window.addEventListener('bara_products_updated', handleUpdate);
    return () => window.removeEventListener('bara_products_updated', handleUpdate);
  }, [id]);

  if (!product) {
    return (
      <div className="pd-page">
        <div className="pd-not-found">
          <h2>Produk tidak ditemukan</h2>
          <Link to="/dashboard" className="pd-back-link">
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Hitung sisa stok yang belum ada di keranjang
  const inCart = items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const remaining = Math.max(0, product.stock - inCart);
  // Batasi quantity di halaman ini agar tidak melebihi sisa stok
  const safeQty = Math.min(quantity, remaining || 1);

  const handleDecrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncrement = () => {
    if (remaining === 0) return;
    setQuantity((q) => Math.min(remaining, q + 1));
  };

  const handleAddToCart = () => {
    if (remaining === 0) {
      setStockFull(true);
      setTimeout(() => setStockFull(false), 2500);
      return;
    }
    // Tambahkan maksimal sisa stok yang tersedia
    const qtyToAdd = Math.min(safeQty, remaining);
    addItem(product, qtyToAdd);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };


  return (
    <div className="pd-page">
      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav className="pd-navbar">
        <div className="pd-navbar-inner">
          <Link to="/dashboard" className="pd-brand-text">
            BARA RIMBA RENT
          </Link>
          <div className="pd-navbar-right">
            <Link to="/cart" className="pd-icon-btn" aria-label="Keranjang" id="pd-nav-cart">
              <IconCart />
            </Link>
            <Link to="/information" className="pd-icon-btn" aria-label="Informasi" title="Informasi" id="pd-nav-info">
              <IconInfo />
            </Link>
            <Link to="/profile" className="pd-icon-btn" aria-label="Profil" id="pd-nav-profile">
              <IconProfile />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── CONTENT ────────────────────────────────────── */}
      <div className="pd-content">
        {/* Tombol Kembali */}
        <button
          className="pd-back-btn"
          onClick={() => navigate(-1)}
          id="pd-back-button"
        >
          <IconArrowLeft />
          <span>KEMBALI</span>
        </button>

        {/* Layout dua kolom */}
        <div className="pd-layout">
          {/* ── KOLOM KIRI: Gambar ── */}
          <div className="pd-image-col">
            <div className="pd-image-card">
              <img
                className="pd-product-img"
                src={product.img}
                alt={product.name}
              />
            </div>
          </div>

          {/* ── KOLOM KANAN: Info ── */}
          <div className="pd-info-col">
            {/* Kategori */}
            <p className="pd-category">{product.badge}</p>

            {/* Nama */}
            <h1 className="pd-name">{product.name}</h1>

            {/* Harga */}
            <div className="pd-price-row">
              <span className="pd-price">{formatPrice(product.price)}</span>
              <span className="pd-price-unit"> / hari</span>
            </div>

            {/* Stok */}
            <p className="pd-stock">Stok tersedia: {product.stock}</p>

            {/* Divider */}
            <hr className="pd-divider" />

            {/* Deskripsi */}
            <p className="pd-description">{product.description}</p>

            {/* Kuantitas */}
            <div className="pd-section pd-qty-row">
              <p className="pd-section-label">KUANTITAS</p>
              <QuantitySelector
                quantity={safeQty}
                onDecrement={handleDecrement}
                onIncrement={handleIncrement}
                maxStock={remaining === 0 ? 1 : remaining}
              />
            </div>
            <p className="pd-qty-hint">
              Maksimal sesuai stok tersedia ({product.stock})
              {inCart > 0 && ` · ${inCart} sudah di keranjang`}
            </p>

            {/* Tombol Tambah ke Keranjang */}
            <button
              className={`pd-add-btn${cartAdded ? ' added' : ''}${stockFull ? ' stock-full' : ''}`}
              onClick={handleAddToCart}
              id="pd-add-to-cart"
              aria-label="Tambah ke keranjang"
              disabled={remaining === 0}
            >
              <IconCartBtn />
              <span>
                {stockFull
                  ? 'Stok sudah penuh di keranjang!'
                  : cartAdded
                  ? 'Ditambahkan!'
                  : 'Tambah ke Keranjang'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
