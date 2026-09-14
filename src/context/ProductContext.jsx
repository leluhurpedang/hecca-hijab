import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getAllProducts, saveProduct, deleteProduct as removeProductFromDB } from '../lib/storage/dataProvider.js';
import { useToast } from './ToastContext';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const { showToast } = useToast();
  const [products, setProducts] = useState(FALLBACK_PRODUCTS.map(p => ({ ...p, isVisible: true })));
  const [isLoading, setIsLoading] = useState(true);

  // Load products from active data provider on startup
  const refreshProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const dbProducts = await getAllProducts();
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
      }
    } catch (err) {
      console.error('Failed to load products from IndexedDB:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Filter only visible products for customer storefront
  const visibleProducts = useMemo(() => {
    return products.filter((p) => p.isVisible !== false);
  }, [products]);

  // Find product by slug
  const getProductBySlug = useCallback((slug) => {
    return products.find((p) => p.slug === slug) || null;
  }, [products]);

  // Find product by id
  const getProductById = useCallback((id) => {
    return products.find((p) => p.id === id) || null;
  }, [products]);

  // Create new product
  const addProduct = useCallback(async (productData) => {
    try {
      const newProduct = {
        ...productData,
        id: productData.id || `hecca-${Date.now()}`,
        slug: productData.slug || productData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        isVisible: productData.isVisible !== undefined ? productData.isVisible : true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const saved = await saveProduct(newProduct);
      setProducts((prev) => [saved, ...prev]);
      showToast(`Produk "${saved.name}" berhasil ditambahkan! ✨`, 'success');
      return saved;
    } catch (err) {
      console.error('Error adding product:', err);
      showToast('Gagal menambahkan produk: ' + err.message, 'error');
      throw err;
    }
  }, [showToast]);

  // Update existing product
  const updateProduct = useCallback(async (id, updatedFields) => {
    try {
      const existing = products.find((p) => p.id === id);
      if (!existing) {
        throw new Error('Produk tidak ditemukan');
      }

      const merged = {
        ...existing,
        ...updatedFields,
        id,
        updatedAt: Date.now(),
      };

      const saved = await saveProduct(merged);
      setProducts((prev) => prev.map((p) => (p.id === id ? saved : p)));
      showToast(`Produk "${saved.name}" berhasil diperbarui!`, 'success');
      return saved;
    } catch (err) {
      console.error('Error updating product:', err);
      showToast('Gagal memperbarui produk: ' + err.message, 'error');
      throw err;
    }
  }, [products, showToast]);

  // Delete product
  const deleteProduct = useCallback(async (id) => {
    try {
      const target = products.find((p) => p.id === id);
      await removeProductFromDB(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast(`Produk "${target ? target.name : id}" berhasil dihapus`, 'info');
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast('Gagal menghapus produk: ' + err.message, 'error');
      throw err;
    }
  }, [products, showToast]);

  // Toggle visibility (publish / draft)
  const toggleProductVisibility = useCallback(async (id) => {
    try {
      const existing = products.find((p) => p.id === id);
      if (!existing) return;

      const newVisibility = !existing.isVisible;
      const updated = {
        ...existing,
        isVisible: newVisibility,
        updatedAt: Date.now(),
      };

      const saved = await saveProduct(updated);
      setProducts((prev) => prev.map((p) => (p.id === id ? saved : p)));
      showToast(
        `Status produk diubah ke ${newVisibility ? 'Aktif (Ditampilkan)' : 'Draft (Disembunyikan)'}`,
        'info'
      );
      return saved;
    } catch (err) {
      console.error('Error toggling visibility:', err);
      showToast('Gagal mengubah visibilitas produk', 'error');
    }
  }, [products, showToast]);

  return (
    <ProductContext.Provider
      value={{
        products,
        visibleProducts,
        isLoading,
        refreshProducts,
        getProductBySlug,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductVisibility,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
