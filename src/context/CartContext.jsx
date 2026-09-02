import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const CartContext = createContext();

const getCurrentUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem('currentUser') || 'null'
    );
  } catch {
    return null;
  }
};

const getCartKey = () => {
  const user = getCurrentUser();

  if (user?.id) {
    return `bara_cart_user_${user.id}`;
  }

  return 'bara_cart_guest';
};

const loadCart = () => {
  try {
    const key = getCartKey();

    const savedCart =
      localStorage.getItem(key);

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  } catch (error) {
    console.error(
      'Gagal membaca keranjang:',
      error
    );

    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(
    loadCart
  );

  // ==========================================
  // SIMPAN CART SESUAI USER
  // ==========================================

  useEffect(() => {
    const key = getCartKey();

    localStorage.setItem(
      key,
      JSON.stringify(items)
    );
  }, [items]);

  // ==========================================
  // KETIKA USER LOGIN / LOGOUT
  // ==========================================

  useEffect(() => {
    const handleUserUpdate = () => {
      setItems(loadCart());
    };

    window.addEventListener(
      'bara_user_updated',
      handleUserUpdate
    );

    return () => {
      window.removeEventListener(
        'bara_user_updated',
        handleUserUpdate
      );
    };
  }, []);

  // ==========================================
  // TAMBAH PRODUK
  // ==========================================

  const addItem = (product) => {
    setItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            Number(item.productId) ===
            Number(product.productId)
        );

      if (existingItem) {
        return currentItems.map((item) =>
          Number(item.productId) ===
            Number(product.productId)
            ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity:
            product.quantity || 1,
        },
      ];
    });
  };

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const updateQty = (
    productId,
    quantity
  ) => {
    setItems((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter(
          (item) =>
            Number(item.productId) !==
            Number(productId)
        );
      }

      return currentItems.map((item) =>
        Number(item.productId) ===
          Number(productId)
          ? {
            ...item,
            quantity,
          }
          : item
      );
    });
  };

  // ==========================================
  // HAPUS PRODUK
  // ==========================================

  const removeItem = (productId) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          Number(item.productId) !==
          Number(productId)
      )
    );
  };

  // ==========================================
  // KOSONGKAN KERANJANG
  // ==========================================

  const clearCart = () => {
    setItems([]);

    localStorage.removeItem(
      getCartKey()
    );
  };

  // ==========================================
  // TOTAL BARANG
  // ==========================================

  const totalItems = items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart harus digunakan di dalam CartProvider'
    );
  }

  return context;
}