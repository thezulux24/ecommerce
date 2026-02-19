import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    slug: string;
    isBundle?: boolean;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const LEGACY_CART_KEY = 'apex_cart';
const GUEST_CART_KEY = 'apex_cart_guest';
const CART_MIGRATION_FLAG = 'apex_cart_v2_migrated';

const getStorageKey = (userId?: string): string => {
    return userId ? `apex_cart_${userId}` : GUEST_CART_KEY;
};

const parseCart = (value: string | null): CartItem[] => {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const migrateLegacyCartIfNeeded = () => {
    if (localStorage.getItem(CART_MIGRATION_FLAG)) return;

    const legacyCart = localStorage.getItem(LEGACY_CART_KEY);
    const guestCart = localStorage.getItem(GUEST_CART_KEY);

    if (legacyCart && !guestCart) {
        localStorage.setItem(GUEST_CART_KEY, legacyCart);
    }

    localStorage.removeItem(LEGACY_CART_KEY);
    localStorage.setItem(CART_MIGRATION_FLAG, '1');
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeStorageKey, setActiveStorageKey] = useState<string>('');

    useEffect(() => {
        migrateLegacyCartIfNeeded();
    }, []);

    useEffect(() => {
        if (loading) return;

        const storageKey = getStorageKey(user?.id);
        setCart(parseCart(localStorage.getItem(storageKey)));
        setActiveStorageKey(storageKey);
    }, [user?.id, loading]);

    useEffect(() => {
        if (!activeStorageKey) return;
        localStorage.setItem(activeStorageKey, JSON.stringify(cart));
    }, [cart, activeStorageKey]);

    const addToCart = (product: any, quantity: number) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                quantity: quantity,
                image: product.image || product.images?.[0]?.url || '',
                slug: product.slug || product.id,
                isBundle: product.isBundle || !!product.features // Features is a good indicator of a bundle in this project
            }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
