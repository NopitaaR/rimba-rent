// Central Single Source of Truth for Admin Orders
import { getProducts } from './products';

export const ORIGINAL_ADMIN_ORDERS = [
  {
    id: '#ORD-311786',
    cleanId: '311786',
    customer: 'Budi Santoso',
    phone: '081234567890',
    email: 'budi@gmail.com',
    address: 'Jl. Merdeka No. 12, Bandung',
    date: '20/05/2026 - 22/05/2026',
    startDate: '20/05/2026',
    endDate: '22/05/2026',
    duration: '2 Hari',
    durationDays: 2,
    itemsStr: 'Tenda Naturehike (1x), Sleeping Bag (2x)',
    items: [
      { id: 1, name: 'Tenda Naturehike', qty: 1, durationDays: 2, price: 50000, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400' },
      { id: 2, name: 'Sleeping Bag', qty: 2, durationDays: 2, price: 20000, image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&q=80&w=400' },
    ],
    total: 180000,
    totalPayment: 180000,
    status: 'Menunggu Konfirmasi',
    statusClass: 'status-warning',
    paymentProof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '#ORD-311785',
    cleanId: '311785',
    customer: 'Siti Aminah',
    phone: '082198765432',
    email: 'siti@gmail.com',
    address: 'Jl. Dago No. 88, Bandung',
    date: '21/05/2026 - 23/05/2026',
    startDate: '21/05/2026',
    endDate: '23/05/2026',
    duration: '2 Hari',
    durationDays: 2,
    itemsStr: 'Carrier 60L (1x), Matras Camping (2x)',
    items: [
      { id: 3, name: 'Carrier 60L', qty: 1, durationDays: 2, price: 40000, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400' },
      { id: 4, name: 'Matras Camping', qty: 2, durationDays: 2, price: 15000, image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=400' },
    ],
    total: 140000,
    totalPayment: 140000,
    status: 'Dikonfirmasi',
    statusClass: 'status-success',
    paymentProof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '#ORD-311784',
    cleanId: '311784',
    customer: 'Rizky Pratama',
    phone: '085711223344',
    email: 'rizky@gmail.com',
    address: 'Jl. Riau No. 102, Bandung',
    date: '22/05/2026 - 24/05/2026',
    startDate: '22/05/2026',
    endDate: '24/05/2026',
    duration: '2 Hari',
    durationDays: 2,
    itemsStr: 'Paket Camping 2 Orang (1x)',
    items: [
      { id: 5, name: 'Paket Camping 2 Orang', qty: 1, durationDays: 2, price: 80000, image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=400' },
    ],
    total: 160000,
    totalPayment: 160000,
    status: 'Sedang Disewa',
    statusClass: 'status-info',
    paymentProof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '#ORD-311783',
    cleanId: '311783',
    customer: 'Dedi Kurniawan',
    phone: '081988776655',
    email: 'dedi@gmail.com',
    address: 'Jl. Setiabudi No. 45, Bandung',
    date: '17/05/2026 - 19/05/2026',
    startDate: '17/05/2026',
    endDate: '19/05/2026',
    duration: '2 Hari',
    durationDays: 2,
    itemsStr: 'Peralatan BBQ (1x), Kompor Portable (1x)',
    items: [
      { id: 8, name: 'Peralatan BBQ', qty: 1, durationDays: 2, price: 30000, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400' },
      { id: 6, name: 'Kompor Portable', qty: 1, durationDays: 2, price: 25000, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400' },
    ],
    total: 110000,
    totalPayment: 110000,
    overdueDays: 3,
    status: 'Terlambat',
    statusClass: 'status-danger',
    paymentProof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '#ORD-311782',
    cleanId: '311782',
    customer: 'Anisa Rahma',
    phone: '083899001122',
    email: 'anisa@gmail.com',
    address: 'Jl. Buah Batu No. 15, Bandung',
    date: '15/05/2026 - 17/05/2026',
    startDate: '15/05/2026',
    endDate: '17/05/2026',
    duration: '2 Hari',
    durationDays: 2,
    itemsStr: 'Kursi Camping (2x)',
    items: [
      { id: 5, name: 'Kursi Camping', qty: 2, durationDays: 2, price: 15000, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400' },
    ],
    total: 60000,
    totalPayment: 60000,
    status: 'Selesai',
    statusClass: 'status-muted',
    paymentProof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
  },
];

export function getStatusClass(status) {
  switch (status) {
    case 'Menunggu Konfirmasi': return 'status-warning';
    case 'Dikonfirmasi': return 'status-success';
    case 'Sedang Disewa': return 'status-info';
    case 'Terlambat': return 'status-danger';
    case 'Selesai': return 'status-muted';
    case 'Dibatalkan': return 'status-danger';
    default: return 'status-warning';
  }
}

// Get saved status overrides map
function getStatusOverrides() {
  try {
    return JSON.parse(localStorage.getItem('bara_admin_order_statuses') || '{}');
  } catch (e) {
    return {};
  }
}

export function getAdminOrders() {
  let customerOrders = [];
  try {
    const history = JSON.parse(localStorage.getItem('bara_history') || '[]');
    customerOrders = history.map((h) => {
      const itemsList = h.items || [];
      const itemsSummary = itemsList
        .map((i) => `${i.name} (${i.quantity || i.qty || 1}x)`)
        .join(', ');
      const cleanId = (h.orderId || 'ORD-LOCAL').replace('#', '');

      // Parse duration days from history object, string, or fallback
      let durDays = 2;
      if (typeof h.duration === 'object' && h.duration?.days) {
        durDays = h.duration.days;
      } else if (typeof h.duration === 'number') {
        durDays = h.duration;
      } else if (typeof h.duration === 'string') {
        const m = h.duration.match(/\d+/);
        if (m) durDays = parseInt(m[0], 10);
      }

      return {
        id: h.orderId || '#ORD-LOCAL',
        cleanId,
        customer: h.customerName || 'User Pelanggan',
        phone: h.phone || '081234567890',
        email: h.email || 'user@gmail.com',
        address: h.address || 'Jl. Rimba Raya No. 45, Bandung',
        date: `${h.startDate || ''} - ${h.endDate || ''}`,
        startDate: h.startDate || '',
        endDate: h.endDate || '',
        duration: typeof h.duration === 'object' ? h.duration?.label : (h.duration || `${durDays} Hari`),
        durationDays: durDays,
        items: itemsList.map((item) => ({
          ...item,
          durationDays: item.durationDays || durDays,
        })),
        itemsStr: itemsSummary || 'Barang Penyewaan',
        total: h.totalPayment || 0,
        totalPayment: h.totalPayment || 0,
        status: 'Menunggu Konfirmasi',
        statusClass: 'status-warning',
        paymentProof: h.paymentProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
      };
    });
  } catch (e) {
    console.error('Error loading bara_history:', e);
  }

  // Combine Customer orders with Original baseline orders
  const allOrders = [...customerOrders, ...ORIGINAL_ADMIN_ORDERS];
  const overrides = getStatusOverrides();

  // Apply saved status overrides
  return allOrders.map((o) => {
    const savedStatus = overrides[o.id] || overrides[o.cleanId];
    if (savedStatus) {
      return {
        ...o,
        status: savedStatus,
        statusClass: getStatusClass(savedStatus),
      };
    }
    return o;
  });
}

export function getAdminOrderById(paramId) {
  const orders = getAdminOrders();
  if (!paramId) return orders[0];

  const search = String(paramId).replace('#', '').toLowerCase().trim();

  // Match by cleanId or ID
  const found = orders.find(
    (o) =>
      o.cleanId?.toLowerCase() === search ||
      o.id.replace('#', '').toLowerCase() === search ||
      o.id.toLowerCase().includes(search)
  );

  if (found) return found;

  // Try index lookup if numeric (e.g. 1, 2)
  const numericIdx = parseInt(search, 10);
  if (!isNaN(numericIdx) && numericIdx > 0 && numericIdx <= orders.length) {
    return orders[numericIdx - 1];
  }

  return orders[0];
}

export function updateAdminOrderStatus(orderId, newStatus) {
  const currentOrders = getAdminOrders();
  const cleanId = String(orderId).replace('#', '');
  const targetOrder = currentOrders.find(
    (o) => o.id === orderId || o.cleanId === cleanId
  );

  if (!targetOrder) return currentOrders;

  const oldStatus = targetOrder.status;

  // Prevent duplicate stock updates if status has not changed
  if (oldStatus === newStatus) {
    return currentOrders;
  }

  // Stock Adjustment Logic based on order status transitions:
  // 1. Transition: non-'Sedang Disewa' -> 'Sedang Disewa' => Decrement product stock
  if (oldStatus !== 'Sedang Disewa' && newStatus === 'Sedang Disewa') {
    if (Array.isArray(targetOrder.items)) {
      const allProducts = getProducts();
      targetOrder.items.forEach((item) => {
        const pId = item.productId ?? item.id;
        let product = allProducts.find((p) => String(p.id) === String(pId));
        if (!product && item.name) {
          product = allProducts.find((p) => p.name.toLowerCase() === item.name.toLowerCase());
        }
        if (product) {
          const qty = item.quantity ?? item.qty ?? 1;
          const newStock = Math.max(0, product.stock - qty);
          updateProduct(product.id, { stock: newStock });
        }
      });
    }
  }

  // 2. Transition: 'Sedang Disewa' or 'Terlambat' -> 'Selesai' => Increment product stock
  if ((oldStatus === 'Sedang Disewa' || oldStatus === 'Terlambat') && newStatus === 'Selesai') {
    if (Array.isArray(targetOrder.items)) {
      const allProducts = getProducts();
      targetOrder.items.forEach((item) => {
        const pId = item.productId ?? item.id;
        let product = allProducts.find((p) => String(p.id) === String(pId));
        if (!product && item.name) {
          product = allProducts.find((p) => p.name.toLowerCase() === item.name.toLowerCase());
        }
        if (product) {
          const qty = item.quantity ?? item.qty ?? 1;
          const newStock = product.stock + qty;
          updateProduct(product.id, { stock: newStock });
        }
      });
    }
  }

  // Save new status override
  const overrides = getStatusOverrides();
  overrides[orderId] = newStatus;
  overrides[cleanId] = newStatus;

  localStorage.setItem('bara_admin_order_statuses', JSON.stringify(overrides));
  window.dispatchEvent(new Event('bara_orders_updated'));

  return getAdminOrders();
}
