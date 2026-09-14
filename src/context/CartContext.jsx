import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);
const STORAGE_KEY = 'hecca_cart_v1';
const VOUCHER_STORAGE_KEY = 'hecca_voucher_v1';

export const FREE_SHIPPING_THRESHOLD = 250000;
export const STANDARD_SHIPPING_FEE = 15000;

export function CartProvider({ children }) {
  const { showToast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      return [];
    }
  });

  const [appliedVoucher, setAppliedVoucher] = useState(() => {
    try {
      const saved = localStorage.getItem(VOUCHER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedVoucher) {
        localStorage.setItem(VOUCHER_STORAGE_KEY, JSON.stringify(appliedVoucher));
      } else {
        localStorage.removeItem(VOUCHER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save voucher', e);
    }
  }, [appliedVoucher]);

  const addToCart = (product, selectedColor, quantity = 1, openDrawer = true) => {
    const color = selectedColor || (product.colors && product.colors[0] ? product.colors[0].name : 'Standard');
    const itemId = `${product.id}-${color}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        const newItem = {
          id: itemId,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images && product.images[0] ? product.images[0] : '',
          selectedColor: color,
          quantity: quantity,
          material: product.material,
        };
        return [...prev, newItem];
      }
    });

    showToast(`${product.name} (${color}) ditambahkan ke keranjang`, 'success');

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (item) {
        showToast(`${item.name} (${item.selectedColor}) dihapus dari keranjang`, 'info');
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedVoucher(null);
  };

  const applyVoucher = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'HAECCANEW' || cleanCode === 'HECCANEW') {
      const voucher = {
        code: 'HAECCANEW',
        discountPercent: 10,
        label: 'Diskon 10% Pengguna Baru'
      };
      setAppliedVoucher(voucher);
      showToast('Voucher HAECCANEW (Diskon 10%) berhasil digunakan!', 'success');
      return { success: true, message: 'Voucher berhasil diterapkan!' };
    } else if (cleanCode === 'HAECCAFREESHIP' || cleanCode === 'HECCAFREESHIP') {
      const voucher = {
        code: 'HAECCAFREESHIP',
        freeShipping: true,
        label: 'Gratis Ongkos Kirim Spesial'
      };
      setAppliedVoucher(voucher);
      showToast('Voucher Gratis Ongkir berhasil digunakan!', 'success');
      return { success: true, message: 'Gratis ongkir berhasil diterapkan!' };
    } else {
      showToast('Kode voucher tidak valid atau telah kedaluwarsa', 'error');
      return { success: false, message: 'Kode voucher tidak valid.' };
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    showToast('Voucher dibatalkan', 'info');
  };

  // Calculations
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (appliedVoucher && appliedVoucher.freeShipping) return 0;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return STANDARD_SHIPPING_FEE;
  }, [subtotal, appliedVoucher]);

  const freeShippingRemaining = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  }, [subtotal]);

  const discount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.discountPercent) {
      return Math.round((subtotal * appliedVoucher.discountPercent) / 100);
    }
    return 0;
  }, [subtotal, appliedVoucher]);

  const totalPrice = useMemo(() => {
    return Math.max(0, subtotal + shippingFee - discount);
  }, [subtotal, shippingFee, discount]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        shippingFee,
        discount,
        totalPrice,
        freeShippingRemaining,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        isCartOpen,
        setIsCartOpen,
        appliedVoucher,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyVoucher,
        removeVoucher,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
