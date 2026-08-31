import { useState } from 'react';
import { addProduct } from '../data/products';
import { useNotification } from '../context/NotificationContext';
import './AddProductModal.css';

const CATEGORY_OPTIONS = [
  'Tenda',
  'Perlengkapan Tidur',
  'Tas & Carrier',
  'Peralatan Masak',
  'Peralatan BBQ',
  'Aksesoris Camping',
  'Lainnya',
];

function AddProductModal({ isOpen, onClose }) {
  const { addNotif } = useNotification();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imgPreview, setImgPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!name.trim()) {
      setErrorMsg('Nama produk wajib diisi.');
      return;
    }
    if (!category) {
      setErrorMsg('Silakan pilih kategori produk.');
      return;
    }
    const numPrice = parseInt(price, 10);
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMsg('Harga sewa harus lebih dari Rp 0.');
      return;
    }
    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) || numStock < 0) {
      setErrorMsg('Jumlah stok tidak boleh negatif.');
      return;
    }

    // Default image fallback if none uploaded
    const finalImg =
      imgPreview ||
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80';

    // Add to Store & Persistence
    addProduct({
      name: name.trim(),
      category,
      price: numPrice,
      stock: numStock,
      description: description.trim(),
      img: finalImg,
    });

    // Success notification
    addNotif({
      type: 'success',
      title: 'Produk Berhasil Ditambahkan',
      body: `${name.trim()} berhasil ditambahkan ke daftar produk.`,
    });

    // Reset Form & Close
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setStock('');
    setDescription('');
    setImgPreview(null);
    setErrorMsg('');
  };

  return (
    <div
      className="add-product-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="add-product-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="add-product-header">
          <div className="add-product-title-group">
            <h2>TAMBAH PRODUK</h2>
            <p>Tambahkan produk baru yang akan tersedia untuk disewa.</p>
          </div>
          <button
            type="button"
            className="add-product-close-btn"
            onClick={onClose}
            aria-label="Tutup modal"
            id="btn-close-add-product-modal"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="add-product-body">
            {errorMsg && (
              <div className="add-product-error-banner" role="alert">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* 1. Foto Produk */}
            <div className="add-product-field">
              <label className="add-product-label">FOTO PRODUK</label>
              {imgPreview ? (
                <div className="add-product-preview-wrapper">
                  <img
                    src={imgPreview}
                    alt="Preview Produk"
                    className="add-product-preview-img"
                  />
                  <label className="add-product-change-img-btn">
                    Ganti Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              ) : (
                <label className="add-product-upload-box">
                  <span className="add-product-upload-icon">📷</span>
                  <p className="add-product-upload-text">
                    Klik atau drag & drop foto produk di sini
                  </p>
                  <p className="add-product-upload-sub">
                    PNG, JPG, WEBP hingga 5MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="input-product-image"
                  />
                </label>
              )}
            </div>

            {/* 2. Nama Produk */}
            <div className="add-product-field">
              <label className="add-product-label">NAMA PRODUK *</label>
              <input
                type="text"
                className="add-product-input"
                placeholder="Masukkan nama produk"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="input-product-name"
              />
            </div>

            {/* 3. Kategori */}
            <div className="add-product-field">
              <label className="add-product-label">KATEGORI *</label>
              <select
                className="add-product-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                id="input-product-category"
              >
                <option value="">Pilih Kategori...</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Harga Sewa */}
            <div className="add-product-field">
              <label className="add-product-label">HARGA SEWA *</label>
              <div className="add-product-currency-group">
                <span className="add-product-currency-prefix">Rp</span>
                <input
                  type="number"
                  className="add-product-input"
                  placeholder="50000"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  id="input-product-price"
                />
              </div>
              <p className="add-product-helper">Harga sewa per hari</p>
            </div>

            {/* 5. Stok */}
            <div className="add-product-field">
              <label className="add-product-label">STOK *</label>
              <input
                type="number"
                className="add-product-input"
                placeholder="10"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                id="input-product-stock"
              />
              <p className="add-product-helper">
                Jumlah barang yang tersedia untuk disewa.
              </p>
            </div>

            {/* 6. Deskripsi */}
            <div className="add-product-field">
              <label className="add-product-label">DESKRIPSI PRODUK</label>
              <textarea
                className="add-product-textarea"
                rows="3"
                placeholder="Masukkan deskripsi produk..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="input-product-description"
              ></textarea>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="add-product-footer">
            <button
              type="button"
              className="btn-add-cancel"
              onClick={onClose}
              id="btn-cancel-add-product"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-add-submit"
              id="btn-submit-add-product"
            >
              + Tambah Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
