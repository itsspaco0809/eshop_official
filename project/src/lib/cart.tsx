import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Product, CartItem } from './supabase';
import { useCurrency } from './currency';

export type ExtendedCartItem = CartItem & {
  cartItemId: string;
  selectedColor?: string;
  selectedImage?: string;
};

type CartContextValue = {
  items: ExtendedCartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  formattedSubtotal: string;
  formatPrice: (usdAmount: number) => string;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'monochrome-cart';

// 安全提取純文字顏色名，防止任何 Object 導致 React Error #31
function sanitizeColorString(raw: unknown): string {
  if (!raw) return 'standard';
  if (typeof raw === 'string') return raw.trim() || 'standard';
  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (typeof obj.color === 'string') return obj.color.trim() || 'standard';
    if (typeof obj.name === 'string') return obj.name.trim() || 'standard';
  }
  return 'standard';
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ExtendedCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { formatPrice } = useCurrency();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ExtendedCartItem[];
        if (Array.isArray(parsed)) {
          // 清洗舊有 localStorage 壞資料（確保 quantity 係數字、selectedColor 係純字串）
          const cleaned = parsed
            .filter((item) => item && item.product && typeof item.quantity === 'number' && item.quantity > 0)
            .map((item) => {
              const safeColor = sanitizeColorString(item.selectedColor);
              const colorSlug = safeColor.toLowerCase().replace(/\s+/g, '-');
              return {
                ...item,
                selectedColor: safeColor,
                cartItemId: item.cartItemId || `${item.product.id}-${colorSlug}`,
              };
            });
          setItems(cleaned);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1, customColor?: string) => {
    if (!product || !product.id) return;

    const safeQty = typeof quantity === 'number' && quantity > 0 ? quantity : 1;
    const rawColor =
      customColor ??
      (product as Product & { selectedColor?: unknown; color?: unknown }).selectedColor ??
      (product as Product & { selectedColor?: unknown; color?: unknown }).color;

    const color = sanitizeColorString(rawColor);
    const colorSlug = color.toLowerCase().replace(/\s+/g, '-');
    const cartItemId = `${product.id}-${colorSlug}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.cartItemId === cartItemId ||
          (i.product?.id === product.id && i.selectedColor === color)
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                quantity: item.quantity + safeQty,
                selectedImage: product.image_url || item.selectedImage,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          product: { ...product },
          quantity: safeQty,
          selectedColor: color,
          selectedImage: product.image_url,
          cartItemId,
        } as ExtendedCartItem,
      ];
    });

    setIsOpen(true);
  }, []);

  const removeItem = useCallback((targetId: string) => {
    setItems((prev) =>
      prev.filter((i) => i.cartItemId !== targetId && i.product?.id !== targetId)
    );
  }, []);

  const updateQuantity = useCallback((targetId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) =>
        prev.filter((i) => i.cartItemId !== targetId && i.product?.id !== targetId)
      );
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.cartItemId === targetId || i.product?.id === targetId
          ? { ...i, quantity }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

  const subtotalUSD = items.reduce((sum, i) => {
    if (!i || !i.product) return sum;
    return sum + Number(i.product.price) * (Number(i.quantity) || 0);
  }, 0);

  const formattedSubtotal = formatPrice(subtotalUSD);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal: subtotalUSD,
        formattedSubtotal,
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
