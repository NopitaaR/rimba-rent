import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';

import {
  fetchProductById,
  updateProductApi,
} from '../../api/productsApi';

import './AdminDashboard.css';

const CATEGORY_OPTIONS = [
  'Tenda',
  'Pakaian',
  'Tas & Carrier',
  'Peralatan Masak',
];

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ================================
  // STATE PRODUK
  // ================================
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  // ================================
  // AMBIL PRODUK DARI DATABASE
  // ================================
  useEffect(() => {

    const loadProduct = async () => {

      try {

        setLoading(true);
        setErrorMessage('');

        const product = await fetchProductById(id);

        setName(product.name || '');
        setCategory(product.category || '');
        setPrice(product.price || '');
        setStock(product.stock || '');
        setDescription(product.description || '');
        setImg(product.image || '');

      } catch (error) {

        console.error(
          'Gagal mengambil detail produk:',
          error
        );

        setErrorMessage(
          'Produk tidak ditemukan atau gagal mengambil data.'
        );

      } finally {

        setLoading(false);

      }

    };

    loadProduct();

  }, [id]);


  // ================================
  // HANDLE GANTI GAMBAR
  // ================================
  const handleImageChange = (e) => {

    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImg(reader.result);
    };

    reader.readAsDataURL(file);

  };


  // ================================
  // VALIDASI + SIMPAN
  // ================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    setErrorMessage('');


    // VALIDASI NAMA
    if (!name.trim()) {

      setErrorMessage(
        'Nama produk wajib diisi.'
      );

      return;
    }


    // VALIDASI KATEGORI
    if (!category) {

      setErrorMessage(
        'Silakan pilih kategori produk.'
      );

      return;
    }


    // VALIDASI HARGA
    const numPrice = Number(price);

    if (
      isNaN(numPrice) ||
      numPrice <= 0
    ) {

      setErrorMessage(
        'Harga sewa harus lebih dari Rp 0.'
      );

      return;
    }


    // VALIDASI STOK
    const numStock = Number(stock);

    if (
      isNaN(numStock) ||
      numStock < 0
    ) {

      setErrorMessage(
        'Jumlah stok tidak boleh negatif.'
      );

      return;
    }


    try {

      setSaving(true);


      // ================================
      // UPDATE KE DATABASE
      // ================================
      await updateProductApi(id, {

        name: name.trim(),

        category,

        price: numPrice,

        stock: numStock,

        description: description.trim(),

        img:
          img ||
          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',

      });


      alert(
        'Produk berhasil diperbarui.'
      );


      // Kembali ke halaman produk admin
      navigate('/admin/products');


    } catch (error) {

      console.error(
        'Gagal memperbarui produk:',
        error
      );

      setErrorMessage(
        error.message ||
        'Gagal memperbarui produk.'
      );

    } finally {

      setSaving(false);

    }

  };


  // ================================
  // LOADING
  // ================================
  if (loading) {

    return (

      <div className="admin-dashboard-page">

        <AdminNavbar />

        <main className="admin-dashboard-main">

          <div
            style={{
              padding: '40px',
              textAlign: 'center',
            }}
          >
            Memuat produk...
          </div>

        </main>

      </div>

    );

  }


  // ================================
  // ERROR
  // ================================
  if (errorMessage && !name) {

    return (

      <div className="admin-dashboard-page">

        <AdminNavbar />

        <main className="admin-dashboard-main">

          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: '#dc2626',
            }}
          >
            {errorMessage}
          </div>


          <div
            style={{
              textAlign: 'center',
            }}
          >

            <button
              className="btn-admin-solid"
              onClick={() =>
                navigate('/admin/products')
              }
            >
              Kembali
            </button>

          </div>

        </main>

      </div>

    );

  }


  return (

    <div className="admin-dashboard-page">

      <AdminNavbar />


      <main className="admin-dashboard-main">

        {/* ================= HEADER ================= */}

        <div className="admin-dashboard-header">

          <h1 className="admin-page-title">
            Edit Produk
          </h1>

          <p className="admin-page-subtitle">
            Perbarui informasi produk yang tersedia
            untuk disewa.
          </p>

        </div>


        {/* ================= FORM ================= */}

        <section
          className="admin-card"
          style={{
            maxWidth: '850px',
          }}
        >

          <form onSubmit={handleSubmit}>


            {/* ERROR */}

            {errorMessage && (

              <div
                style={{
                  padding: '12px',
                  marginBottom: '20px',
                  background: '#fee2e2',
                  color: '#991b1b',
                  borderRadius: '8px',
                }}
              >
                {errorMessage}
              </div>

            )}


            {/* ================= FOTO ================= */}

            <div
              style={{
                marginBottom: '20px',
              }}
            >

              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                FOTO PRODUK
              </label>


              {img && (

                <img
                  src={img}
                  alt={name}
                  style={{
                    width: '160px',
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                />

              )}


              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

            </div>


            {/* ================= NAMA ================= */}

            <div
              style={{
                marginBottom: '20px',
              }}
            >

              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                NAMA PRODUK *
              </label>


              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Masukkan nama produk"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                }}
              />

            </div>


            {/* ================= KATEGORI ================= */}

            <div
              style={{
                marginBottom: '20px',
              }}
            >

              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                KATEGORI *
              </label>


              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                }}
              >

                <option value="">
                  Pilih Kategori
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


            {/* ================= HARGA ================= */}

            <div
              style={{
                marginBottom: '20px',
              }}
            >

              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                HARGA SEWA / HARI *
              </label>


              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                placeholder="50000"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                }}
              />

            </div>


            {/* ================= STOK ================= */}

            <div
              style={{
                marginBottom: '20px',
              }}
            >

              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                STOK *
              </label>


              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value)
                }
                placeholder="10"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                }}
              />

            </div>


            {/* ================= DESKRIPSI ================= */}

            <div
              style={{
                marginBottom: '25px',
              }}
            >

              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                DESKRIPSI PRODUK
              </label>


              <textarea
                rows="5"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Masukkan deskripsi produk"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  resize: 'vertical',
                }}
              />

            </div>


            {/* ================= BUTTON ================= */}

            <div
              style={{
                display: 'flex',
                gap: '12px',
              }}
            >

              <button
                type="button"
                onClick={() =>
                  navigate('/admin/products')
                }
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>


              <button
                type="submit"
                className="btn-admin-solid"
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  cursor: saving
                    ? 'not-allowed'
                    : 'pointer',
                }}
              >

                {saving
                  ? 'Menyimpan...'
                  : 'Simpan Perubahan'}

              </button>

            </div>


          </form>

        </section>

      </main>

    </div>

  );
}

export default AdminEditProduct;