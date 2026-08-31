/**
 * CartContext.jsx
 * State management global untuk keranjang rental.
 * Data disinkronkan ke localStorage agar tidak hilang saat refresh.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'bara_cart';

function sanitizeQty(val, fallback = 1) {
  const parsed = parseInt(val, 10);
  if (isNaN(parsed) || parsed < 1) return fallback;
  return parsed;
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => {
        if (!item || !item.productId) return false;
        const stock = parseInt(item.stock, 10);
        return isNaN(stock) || stock > 0;
      })
      .map((item) => {
        const stock = parseInt(item.stock, 10);
        const validStock = !isNaN(stock) && stock > 0 ? stock : 1;
        const validQty = sanitizeQty(item.quantity, 1);
        return {
          ...item,
          stock: validStock,
          quantity: Math.min(validQty, validStock),
        };
      });
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

  /** Tambah produk atau increment quantity jika sudah ada (dengan validasi defensif) */
  const addItem = useCallback((product, qty = 1) => {
    if (!product || typeof product.id === 'undefined') return;

    const availableStock = parseInt(product.stock, 10);
    if (isNaN(availableStock) || availableStock <= 0) {
      return; // Tolak produk dengan stok 0 atau tidak valid
    }

    const requestedQty = sanitizeQty(qty, 1);

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        if (existing.quantity >= availableStock) {
          return prev; // Sudah mencapai batas stok maksimum
        }
        const newQty = Math.min(availableStock, existing.quantity + requestedQty);
        return prev.map((i) =>
          i.productId === product.id ? { ...i, stock: availableStock, quantity: newQty } : i
        );
      }

      const initialQty = Math.min(availableStock, requestedQty);
      if (initialQty <= 0) return prev;

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          badge: product.badge,
          price: product.price,
          img: product.img,
          stock: availableStock,
          quantity: initialQty,
        },
      ];
    });
  }, []);

  /** Update quantity satu item (min 1, max stock, defensif terhadap 0/negatif/NaN) */
  const updateQty = useCallback((productId, qty) => {
    const validQty = sanitizeQty(qty, 1);

    setItems((prev) =>
      prev.map((i) => {
        if (i.productId !== productId) return i;

        const maxStock = parseInt(i.stock, 10);
        const safeStock = !isNaN(maxStock) && maxStock > 0 ? maxStock : validQty;
        const finalQty = Math.min(Math.max(1, validQty), safeStock);

        return { ...i, quantity: finalQty };
      })
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
