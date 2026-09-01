import { useState } from 'react';
import { createProduct } from '../api/productsApi';
import { useNotification } from '../context/NotificationContext';
import './AddProductModal.css';

const CATEGORY_OPTIONS = [
  'Tenda',
  'Pakaian',
  'Tas & Carrier',
  'Peralatan Masak',
];

function AddProductModal({ isOpen, onClose, onProductAdded }) {
  const { addNotif } = useNotification();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imgPreview, setImgPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // ================================
  // HANDLE UPLOAD GAMBAR
  // ================================
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

  // ================================
  // RESET FORM
  // ================================
  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setStock('');
    setDescription('');
    setImgPreview(null);
    setErrorMsg('');
  };

  // ================================
  // TAMBAH PRODUK KE DATABASE
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg('');

    // Validasi nama
    if (!name.trim()) {
      setErrorMsg('Nama produk wajib diisi.');
      return;
    }

    // Validasi kategori
    if (!category) {
      setErrorMsg('Silakan pilih kategori produk.');
      return;
    }

    // Validasi harga
    const numPrice = parseInt(price, 10);

    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMsg('Harga sewa harus lebih dari Rp 0.');
      return;
    }

    // Validasi stok
    const numStock = parseInt(stock, 10);

    if (isNaN(numStock) || numStock < 0) {
      setErrorMsg('Jumlah stok tidak boleh negatif.');
      return;
    }

    // Gambar default jika belum upload
    const finalImage =
      imgPreview ||
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80';

    setIsSubmitting(true);

    try {
      // Kirim data ke Laravel API
      const newProduct = await createProduct({
        name: name.trim(),
        category: category,
        price: numPrice,
        stock: numStock,
        image: finalImage,
        description: description.trim(),
      });

      // Notifikasi berhasil
      addNotif({
        type: 'success',
        title: 'Produk Berhasil Ditambahkan',
        body: `${newProduct.name} berhasil ditambahkan ke database.`,
      });

      // Refresh daftar produk di halaman Admin
      if (onProductAdded) {
        onProductAdded(newProduct);
      }

      // Trigger refresh untuk komponen lain
      window.dispatchEvent(
        new Event('bara_products_updated')
      );

      // Reset form
      resetForm();

      // Tutup modal
      onClose();

    } catch (error) {
      console.error('Gagal menambahkan produk:', error);

      setErrorMsg(
        error.message ||
        'Terjadi kesalahan saat menambahkan produk.'
      );

    } finally {
      setIsSubmitting(false);
    }
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

        {/* HEADER */}
        <div className="add-product-header">

          <div className="add-product-title-group">
            <h2>TAMBAH PRODUK</h2>

            <p>
              Tambahkan produk baru yang akan tersedia untuk disewa.
            </p>
          </div>

          <button
            type="button"
            className="add-product-close-btn"
            onClick={onClose}
            aria-label="Tutup modal"
            id="btn-close-add-product-modal"
            disabled={isSubmitting}
          >
            ✕
          </button>

        </div>


        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="add-product-body">

            {/* ERROR */}
            {errorMsg && (
              <div
                className="add-product-error-banner"
                role="alert"
              >
                ⚠️ {errorMsg}
              </div>
            )}


            {/* FOTO PRODUK */}
            <div className="add-product-field">

              <label className="add-product-label">
                FOTO PRODUK
              </label>

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
                      disabled={isSubmitting}
                    />

                  </label>

                </div>

              ) : (

                <label className="add-product-upload-box">

                  <span className="add-product-upload-icon">
                    📷
                  </span>

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
                    disabled={isSubmitting}
                  />

                </label>

              )}

            </div>


            {/* NAMA PRODUK */}
            <div className="add-product-field">

              <label className="add-product-label">
                NAMA PRODUK *
              </label>

              <input
                type="text"
                className="add-product-input"
                placeholder="Masukkan nama produk"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="input-product-name"
                disabled={isSubmitting}
              />

            </div>


            {/* KATEGORI */}
            <div className="add-product-field">

              <label className="add-product-label">
                KATEGORI *
              </label>

              <select
                className="add-product-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                id="input-product-category"
                disabled={isSubmitting}
              >

                <option value="">
                  Pilih Kategori...
                </option>

                {CATEGORY_OPTIONS.map((cat) => (

                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>

                ))}

              </select>

            </div>


            {/* HARGA */}
            <div className="add-product-field">

              <label className="add-product-label">
                HARGA SEWA *
              </label>

              <div className="add-product-currency-group">

                <span className="add-product-currency-prefix">
                  Rp
                </span>

                <input
                  type="number"
                  className="add-product-input"
                  placeholder="50000"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  id="input-product-price"
                  disabled={isSubmitting}
                />

              </div>

              <p className="add-product-helper">
                Harga sewa per hari
              </p>

            </div>


            {/* STOK */}
            <div className="add-product-field">

              <label className="add-product-label">
                STOK *
              </label>

              <input
                type="number"
                className="add-product-input"
                placeholder="10"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                id="input-product-stock"
                disabled={isSubmitting}
              />

              <p className="add-product-helper">
                Jumlah barang yang tersedia untuk disewa.
              </p>

            </div>


            {/* DESKRIPSI */}
            <div className="add-product-field">

              <label className="add-product-label">
                DESKRIPSI PRODUK
              </label>

              <textarea
                className="add-product-textarea"
                rows="3"
                placeholder="Masukkan deskripsi produk..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="input-product-description"
                disabled={isSubmitting}
              />

            </div>

          </div>


          {/* FOOTER */}
          <div className="add-product-footer">

            <button
              type="button"
              className="btn-add-cancel"
              onClick={onClose}
              id="btn-cancel-add-product"
              disabled={isSubmitting}
            >
              Batal
            </button>


            <button
              type="submit"
              className="btn-add-submit"
              id="btn-submit-add-product"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Menyimpan...'
                : '+ Tambah Produk'}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AddProductModal;