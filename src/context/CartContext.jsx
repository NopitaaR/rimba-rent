/**
 * CartContext.jsx
 * State management global untuk keranjang rental.
 * Data disinkronkan ke localStorage agar tidak hilang saat refresh.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'bara_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Sanitasi: pastikan quantity tidak melebihi stock dan minimal 1
    return parsed.map((item) => ({
      ...item,
      quantity: Math.min(
        Math.max(1, item.quantity),
        item.stock ?? item.quantity  // gunakan stock jika ada, fallback ke qty
      ),
    }));
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  // Sync ke localStorage setiap items berubah
  useEffect(() => {
    saveCart(items);
  }, [items]);

  /** Tambah produk atau increment quantity jika sudah ada */
  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: Math.min(product.stock, i.quantity + qty) }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          badge: product.badge,
          price: product.price,
          img: product.img,
          stock: product.stock,
          quantity: Math.min(product.stock, qty),
        },
      ];
    });
  }, []);

  /** Update quantity satu item (min 1, max stock) */
  const updateQty = useCallback((productId, qty) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(Math.max(1, qty), i.stock ?? qty) }
          : i
      )
    );
  }, []);

  /** Hapus satu item */
  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  /** Kosongkan seluruh keranjang */
  const clearCart = useCallback(() => setItems([]), []);

  /** Total item (sum of quantities) */
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQty, removeItem, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

/** Hook untuk menggunakan CartContext */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
