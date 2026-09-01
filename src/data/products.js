// ── BARA RIMBA RENT — Data Produk & Helper ────────────────────────

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

  // produk lainnya...
];

export const PRODUCTS = INITIAL_PRODUCTS;

const STORAGE_KEY = 'bara_products';

const ALLOWED_CATEGORIES = [
  'Tenda',
  'Pakaian',
  'Tas & Carrier',
  'Peralatan Masak',
];

function sanitizeCategory(cat) {
  if (!cat) return 'Tenda';

  if (ALLOWED_CATEGORIES.includes(cat)) {
    return cat;
  }

  if (
    cat.toLowerCase().includes('tas') ||
    cat.toLowerCase().includes('carrier')
  ) {
    return 'Tas & Carrier';
  }

  if (
    cat.toLowerCase().includes('masak') ||
    cat.toLowerCase().includes('bbq')
  ) {
    return 'Peralatan Masak';
  }

  if (
    cat.toLowerCase().includes('pakaian') ||
    cat.toLowerCase().includes('tidur')
  ) {
    return 'Pakaian';
  }

  return 'Tenda';
}

export function getProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => ({
          ...p,
          category: sanitizeCategory(p.category),
        }));
      }
    }
  } catch (err) {
    console.error('Failed to load products:', err);
  }

  return INITIAL_PRODUCTS;
}

export function getProductById(id) {
  const products = getProducts();

  return (
    products.find(
      (product) => String(product.id) === String(id)
    ) || null
  );
}

export const CATEGORIES = [
  'Semua',
  'Tenda',
  'Pakaian',
  'Tas & Carrier',
  'Peralatan Masak',
];

export const formatPrice = (price) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);