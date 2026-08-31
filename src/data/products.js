// ── BARA RIMBA RENT — Data Produk & Helper ────────────────────────
// File ini menjadi sumber data & sinkronisasi tunggal untuk semua produk.

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Tenda Naturehike',
    badge: 'TENDA',
    category: 'Tenda',
    desc: 'Kapasitas 4 orang, tahan air ganda.',
    description:
      'Tenda Naturehike cocok digunakan untuk kegiatan camping dan outdoor. Memiliki ukuran yang nyaman dan mudah digunakan, dirancang untuk ketahanan dan kenyamanan maksimal di alam liar.',
    stock: 5,
    price: 50000,
    img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    capacityOptions: ['2p', '3-4p', '5-6p', '7-8p'],
  },
  {
    id: 2,
    name: 'Sleeping Bag',
    badge: 'TIDUR',
    category: 'Pakaian',
    desc: 'Hangat untuk suhu pegunungan.',
    description:
      'Sleeping bag berkualitas tinggi yang dirancang untuk menjaga kehangatan di suhu dingin pegunungan. Ringan dan mudah dikemas untuk perjalanan outdoor.',
    stock: 10,
    price: 20000,
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    capacityOptions: ['1p', '2p'],
  },
  {
    id: 3,
    name: 'Carrier 60L',
    badge: 'TAS',
    category: 'Pakaian',
    desc: 'Nyaman untuk pendakian panjang.',
    description:
      'Carrier 60L dengan desain ergonomis yang nyaman untuk pendakian jangka panjang. Dilengkapi dengan banyak kompartemen untuk mengorganisir perlengkapan dengan efisien.',
    stock: 4,
    price: 40000,
    img: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=800&q=80',
    capacityOptions: ['1p'],
  },
  {
    id: 4,
    name: 'Matras Camping',
    badge: 'TIDUR',
    category: 'Pakaian',
    desc: 'Alas tidur insulasi dasar.',
    description:
      'Matras camping dengan insulasi yang baik untuk menjaga kehangatan dan kenyamanan saat tidur di alam terbuka. Ringan dan mudah digulung.',
    stock: 8,
    price: 15000,
    img: 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=800&q=80',
    capacityOptions: ['1p'],
  },
  {
    id: 5,
    name: 'Kursi Camping',
    badge: 'FURNITUR',
    category: 'Paket',
    desc: 'Ringan dan mudah dilipat.',
    description:
      'Kursi camping yang ringan namun kuat, mudah dilipat dan dibawa kemana saja. Cocok untuk bersantai di alam terbuka saat camping atau piknik.',
    stock: 6,
    price: 25000,
    img: 'https://images.unsplash.com/photo-1533779183510-8f55a55f9b1b?w=800&q=80',
    capacityOptions: ['1p'],
  },
  {
    id: 6,
    name: 'Kompor Portable',
    badge: 'MASAK',
    category: 'Paket',
    desc: 'Praktis menggunakan gas kaleng.',
    description:
      'Kompor portable yang praktis menggunakan gas kaleng standar. Cocok untuk memasak di alam terbuka dengan api yang stabil dan efisien.',
    stock: 5,
    price: 30000,
    img: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&q=80',
    capacityOptions: ['1p', '2p', '3-4p'],
  },
  {
    id: 7,
    name: 'Paket Camping 2 Orang',
    badge: 'PAKET',
    category: 'Paket',
    desc: 'Tenda, matras, dan alat masak.',
    description:
      'Paket camping lengkap untuk 2 orang yang mencakup tenda, matras, dan peralatan masak dasar. Solusi praktis bagi yang ingin memulai petualangan camping.',
    stock: 3,
    price: 150000,
    img: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&q=80',
    capacityOptions: ['2p', '3-4p'],
  },
  {
    id: 8,
    name: 'Peralatan BBQ',
    badge: 'BBQ',
    category: 'BBQ',
    desc: 'Set pemanggang lengkap.',
    description:
      'Set peralatan BBQ lengkap untuk acara bakar-bakaran yang menyenangkan. Termasuk panggangan, alat penjepit, dan aksesoris lainnya untuk pengalaman BBQ terbaik.',
    stock: 4,
    price: 75000,
    img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    capacityOptions: ['3-4p', '5-6p', '7-8p'],
  },
];

export const PRODUCTS = INITIAL_PRODUCTS;

const STORAGE_KEY = 'bara_products';

/** Ambil seluruh daftar produk (disinkronkan dengan localStorage) */
export function getProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load products from localStorage:', err);
  }
  // Simpan initial products ke localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

/** Ambil 1 produk berdasarkan ID */
export function getProductById(id) {
  const products = getProducts();
  return products.find((p) => String(p.id) === String(id)) || null;
}

/** Update data produk secara global */
export function updateProduct(id, updatedFields) {
  const products = getProducts();
  const index = products.findIndex((p) => String(p.id) === String(id));
  if (index === -1) return null;

  const current = products[index];
  const updated = {
    ...current,
    ...updatedFields,
    // buat desc singkat otomatis jika description diupdate
    desc: updatedFields.description
      ? updatedFields.description.slice(0, 40) + '...'
      : current.desc,
  };

  products[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  // Sinkronkan ke localStorage keranjang (bara_cart) jika item tersebut ada di keranjang
  try {
    const rawCart = localStorage.getItem('bara_cart');
    if (rawCart) {
      const cart = JSON.parse(rawCart);
      const updatedCart = cart.map((ci) => {
        if (String(ci.productId) === String(id)) {
          const newStock = updated.stock;
          return {
            ...ci,
            name: updated.name,
            price: updated.price,
            img: updated.img,
            stock: newStock,
            // recap quantity agar tidak melebihi stok baru!
            quantity: Math.min(ci.quantity, newStock),
          };
        }
        return ci;
      });
      localStorage.setItem('bara_cart', JSON.stringify(updatedCart));
    }
  } catch (err) {
    console.error('Failed to update cart items on product edit:', err);
  }

  // Dispatch custom event untuk re-render instan di komponen terbuka
  window.dispatchEvent(new Event('bara_products_updated'));
  return updated;
}

/** Tambah produk baru ke localStorage & dispatch bara_products_updated */
export function addProduct(newProductData) {
  const products = getProducts();
  const newId = products.length > 0 ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 1;
  const newProduct = {
    id: newId,
    name: newProductData.name,
    badge: (newProductData.category || 'TENDA').toUpperCase(),
    category: newProductData.category || 'Tenda',
    desc: newProductData.description
      ? newProductData.description.slice(0, 40) + '...'
      : 'Produk rental camping BARA RIMBA RENT',
    description: newProductData.description || 'Produk rental camping BARA RIMBA RENT berkualitas tinggi.',
    stock: parseInt(newProductData.stock, 10) || 0,
    price: parseInt(newProductData.price, 10) || 0,
    img: newProductData.img || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    capacityOptions: ['1p', '2p', '3-4p'],
  };

  const updatedList = [newProduct, ...products];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  window.dispatchEvent(new Event('bara_products_updated'));
  return newProduct;
}

export const CATEGORIES = ['Semua', 'Paket', 'Tenda', 'Pakaian', 'BBQ', 'Perlengkapan Tidur', 'Tas & Carrier', 'Peralatan Masak', 'Peralatan BBQ', 'Aksesoris Camping', 'Lainnya'];

export const formatPrice = (price) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
