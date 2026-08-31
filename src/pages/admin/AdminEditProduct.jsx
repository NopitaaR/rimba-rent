import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { getProductById, updateProduct, CATEGORIES } from '../../data/products';
import { useNotification } from '../../context/NotificationContext';
import './AdminEditProduct.css';

// SVG Icons
const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconCamera = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotif } = useNotification();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    img: '',
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productExists, setProductExists] = useState(true);

  useEffect(() => {
    const product = getProductById(id);
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price !== undefined ? product.price : '',
        stock: product.stock !== undefined ? product.stock : '',
        description: product.description || product.desc || '',
        img: product.img || '',
      });
    } else {
      setProductExists(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nama produk tidak boleh kosong.';
    }
    if (!formData.category) {
      newErrors.category = 'Kategori produk harus dipilih.';
    }
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Harga sewa per hari harus lebih dari 0.';
    }
    if (formData.stock === '' || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = 'Jumlah stok tidak boleh kurang dari 0.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi produk tidak boleh kosong.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const updated = updateProduct(id, {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        img: formData.img,
      });

      setIsSubmitting(false);

      if (updated) {
        setSuccessMsg('Produk berhasil diperbarui!');
        // Tambahkan notifikasi ke notification bell context
        addNotif({
          type: 'info',
          title: 'Produk Diperbarui',
          body: `Produk "${updated.name}" berhasil diperbarui. Stok saat ini: ${updated.stock}.`,
        });

        setTimeout(() => {
          navigate('/admin/products');
        }, 1200);
      }
    }, 500);
  };

  if (!productExists) {
    return (
      <div className="admin-dashboard-page">
        <AdminNavbar />
        <main className="admin-dashboard-main">
          <div className="edit-prod-not-found">
            <h2>Produk tidak ditemukan</h2>
            <p>Produk dengan ID #{id} tidak ada dalam sistem.</p>
            <Link to="/admin/products" className="btn-admin-solid" style={{ display: 'inline-block', width: 'auto', marginTop: '12px' }}>
              Kembali ke Kelola Produk
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const categoryOptions = CATEGORIES.filter((c) => c !== 'Semua');

  return (
    <div className="admin-dashboard-page">
      <AdminNavbar />

      <main className="admin-dashboard-main">
        {/* Back Link & Title */}
        <div className="edit-prod-top">
          <Link to="/admin/products" className="edit-prod-back-link">
            <IconArrowLeft />
            <span>Kembali ke Produk</span>
          </Link>
          <h1 className="edit-prod-title">EDIT PRODUK</h1>
        </div>

        {/* Global Feedback Banner */}
        {successMsg && (
          <div className="edit-prod-alert success">
            <IconCheck />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Two-Column Form Layout matching Figma */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="edit-prod-grid">
            {/* Left Card: Form Inputs */}
            <div className="edit-prod-card form-card">
              {/* Nama Produk */}
              <div className="form-group-edit">
                <label className="edit-label" htmlFor="edit-name">
                  Nama Produk
                </label>
                <input
                  id="edit-name"
                  type="text"
                  name="name"
                  className={`edit-input${errors.name ? ' is-invalid' : ''}`}
                  placeholder="Masukkan nama produk"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className="edit-error-text">
                    <IconAlert />
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Inline Row: Kategori & Harga */}
              <div className="form-row-edit">
                {/* Kategori */}
                <div className="form-group-edit">
                  <label className="edit-label" htmlFor="edit-category">
                    Kategori
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    className={`edit-input edit-select${errors.category ? ' is-invalid' : ''}`}
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Kategori</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="edit-error-text">
                      <IconAlert />
                      {errors.category}
                    </span>
                  )}
                </div>

                {/* Harga Sewa per Hari */}
                <div className="form-group-edit">
                  <label className="edit-label" htmlFor="edit-price">
                    Harga Sewa per Hari (Rp)
                  </label>
                  <input
                    id="edit-price"
                    type="number"
                    name="price"
                    className={`edit-input${errors.price ? ' is-invalid' : ''}`}
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                  />
                  {errors.price && (
                    <span className="edit-error-text">
                      <IconAlert />
                      {errors.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Jumlah Stok (Half Width) */}
              <div className="form-group-edit half-width">
                <label className="edit-label" htmlFor="edit-stock">
                  Jumlah Stok
                </label>
                <input
                  id="edit-stock"
                  type="number"
                  name="stock"
                  className={`edit-input${errors.stock ? ' is-invalid' : ''}`}
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                />
                {errors.stock && (
                  <span className="edit-error-text">
                    <IconAlert />
                    {errors.stock}
                  </span>
                )}
              </div>

              {/* Deskripsi Produk */}
              <div className="form-group-edit">
                <label className="edit-label" htmlFor="edit-description">
                  Deskripsi Produk
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows="5"
                  className={`edit-textarea${errors.description ? ' is-invalid' : ''}`}
                  placeholder="Tuliskan deskripsi lengkap produk..."
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <span className="edit-error-text">
                    <IconAlert />
                    {errors.description}
                  </span>
                )}
              </div>

              {/* Bottom Action Buttons inside left card container */}
              <div className="edit-form-actions">
                <button
                  type="button"
                  className="btn-edit-cancel"
                  onClick={() => navigate('/admin/products')}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-edit-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>

            {/* Right Card: Foto Produk */}
            <div className="edit-prod-card photo-card">
              <label className="edit-label">Foto Produk</label>

              <div
                className="photo-upload-box"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.img ? (
                  <div className="photo-preview-wrap">
                    <img
                      src={formData.img}
                      alt="Preview Produk"
                      className="photo-preview-img"
                    />
                    <div className="photo-overlay">
                      <IconCamera />
                      <span>Ganti Foto</span>
                    </div>
                  </div>
                ) : (
                  <div className="photo-upload-placeholder">
                    <IconCamera />
                    <p className="upload-title">Upload Foto Produk</p>
                    <p className="upload-sub">JPG, PNG, atau JPEG</p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              <p className="photo-helper-text">
                Gunakan foto dengan resolusi tinggi (min. 1080x1080px) untuk tampilan terbaik.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AdminEditProduct;
