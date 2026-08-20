import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, User, Transaction, CategoryType, SortOption, AppRoute } from '../types';
import { PRODUCTS } from '../data/products';

interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation
  currentRoute: AppRoute;
  navigateTo: (route: AppRoute | string) => void;
  
  // Products & Filter
  products: Product[];
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (productId: string, platform?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  discountCode: string;
  applyDiscountCode: (code: string) => boolean;
  appliedDiscountPercent: number;
  
  // User & Auth
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  
  // Purchased Apps & Licenses
  purchasedProductIds: string[];
  transactions: Transaction[];
  addPurchasedOrder: (items: CartItem[], paymentMethod: string) => Transaction;
  
  // Interactive Modals
  demoProduct: Product | null;
  openDemoModal: (product: Product) => void;
  closeDemoModal: () => void;
  
  downloadingProduct: Product | null;
  startDownloadSimulation: (product: Product) => void;
  closeDownloadModal: () => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  
  // Helpers
  formatPrice: (amount: number) => string;
  getProductById: (id: string) => Product | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PURCHASED_IDS = ['orbit-tasks', 'cipher-vpn'];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-init-1',
    orderNumber: 'AT-9021-ORD',
    date: '14 Agu 2026',
    total: 350000,
    status: 'Lunas',
    paymentMethod: 'QRIS Realtime',
    items: [
      {
        productId: 'orbit-tasks',
        productName: 'Orbit Task & Sprint Manager',
        price: 350000,
        qty: 1,
        licenseKey: 'AT-ORB8-7492-PRO',
        version: 'v1.8.4'
      }
    ]
  },
  {
    id: 'tx-init-2',
    orderNumber: 'AT-8843-ORD',
    date: '02 Agu 2026',
    total: 275000,
    status: 'Lunas',
    paymentMethod: 'BCA Virtual Account',
    items: [
      {
        productId: 'cipher-vpn',
        productName: 'Cipher VPN Enterprise Pro',
        price: 275000,
        qty: 1,
        licenseKey: 'AT-CIPH-9921-SEC',
        version: 'v4.3.0'
      }
    ]
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Routing parsed from window.location.hash
  const [currentRoute, setCurrentRoute] = useState<AppRoute>({ name: 'home' });

  // Catalog State
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('popular');

  // Cart State with LocalStorage cache
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('at_digital_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Promo code
  const [discountCode, setDiscountCode] = useState<string>('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);

  // User State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('at_digital_user');
      return saved ? JSON.parse(saved) : {
        id: 'usr-default',
        name: 'Daffa Pratama',
        email: 'daffa.pratama@atdigitalsolution.com',
        joinedDate: 'Agustus 2026',
        company: 'AT Digital Solution Client'
      };
    } catch {
      return null;
    }
  });

  // Purchased IDs & Transactions
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('at_digital_purchased');
      return saved ? JSON.parse(saved) : INITIAL_PURCHASED_IDS;
    } catch {
      return INITIAL_PURCHASED_IDS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('at_digital_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Modals
  const [demoProduct, setDemoProduct] = useState<Product | null>(null);
  const [downloadingProduct, setDownloadingProduct] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync route on hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const parts = hash.split('/');
      const base = parts[0] || '';
      const arg = parts[1] || '';

      if (!base || base === '') {
        setCurrentRoute({ name: 'home' });
      } else if (base === 'catalog') {
        setCurrentRoute({ name: 'catalog' });
      } else if (base === 'detail' && arg) {
        setCurrentRoute({ name: 'detail', productId: arg });
      } else if (base === 'cart') {
        setCurrentRoute({ name: 'cart' });
      } else if (base === 'checkout') {
        setCurrentRoute({ name: 'checkout' });
      } else if (base === 'success') {
        setCurrentRoute({ name: 'success', orderId: arg });
      } else if (base === 'dashboard') {
        setCurrentRoute({ name: 'dashboard', tab: (arg as any) || 'apps' });
      } else if (base === 'auth') {
        setCurrentRoute({ name: 'auth', mode: (arg as any) || 'login' });
      } else {
        setCurrentRoute({ name: 'home' });
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('at_digital_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Save Purchased to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('at_digital_purchased', JSON.stringify(purchasedProductIds));
      localStorage.setItem('at_digital_transactions', JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [purchasedProductIds, transactions]);

  // Save User to LocalStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('at_digital_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('at_digital_user');
      }
    } catch {
      // ignore
    }
  }, [user]);

  const navigateTo = (route: AppRoute | string) => {
    if (typeof route === 'string') {
      window.location.hash = route.startsWith('/') ? route : `/${route}`;
      return;
    }

    if (route.name === 'home') {
      window.location.hash = '/';
    } else if (route.name === 'catalog') {
      if (route.category && route.category !== 'Semua') {
        setSelectedCategory(route.category);
      }
      if (route.search) {
        setSearchQuery(route.search);
      }
      window.location.hash = '/catalog';
    } else if (route.name === 'detail') {
      window.location.hash = `/detail/${route.productId}`;
    } else if (route.name === 'cart') {
      window.location.hash = '/cart';
    } else if (route.name === 'checkout') {
      window.location.hash = '/checkout';
    } else if (route.name === 'success') {
      window.location.hash = route.orderId ? `/success/${route.orderId}` : '/success';
    } else if (route.name === 'dashboard') {
      window.location.hash = route.tab ? `/dashboard/${route.tab}` : '/dashboard';
    } else if (route.name === 'auth') {
      window.location.hash = route.mode ? `/auth/${route.mode}` : '/auth';
    }
  };

  const showToast = (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getProductById = (id: string) => {
    return PRODUCTS.find((p) => p.id === id);
  };

  const formatPrice = (amount: number) => {
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  // Cart operations
  const addToCart = (productId: string, platform?: string) => {
    const product = getProductById(productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: productId, qty: 1, selectedPlatform: platform || product.platform }];
    });

    showToast(`${product.name} ditambahkan ke keranjang!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    const product = getProductById(productId);
    setCart((prev) => prev.filter((item) => item.id !== productId));
    if (product) {
      showToast(`${product.name} dihapus dari keranjang.`, 'info');
    }
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyDiscountCode = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'DISKON20' || normalized === 'AT20') {
      setDiscountCode(normalized);
      setAppliedDiscountPercent(20);
      showToast('Kupon diskon 20% berhasil dipasang!', 'success');
      return true;
    } else if (normalized === 'DISKON50' || normalized === 'HEMAT50' || normalized === 'AT50') {
      setDiscountCode(normalized);
      setAppliedDiscountPercent(50);
      showToast('Kupon diskon 50% super hemat berhasil dipasang!', 'success');
      return true;
    } else {
      showToast('Kode kupon tidak valid atau sudah kedaluwarsa.', 'warning');
      return false;
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  const cartSubtotal = cart.reduce((total, item) => {
    const p = getProductById(item.id);
    return total + (p ? p.price * item.qty : 0);
  }, 0);

  const cartDiscount = Math.round((cartSubtotal * appliedDiscountPercent) / 100);
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  // User Auth
  const login = (email: string, name?: string) => {
    const username = name || email.split('@')[0];
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email,
      joinedDate: 'Agustus 2026',
      company: 'AT Digital Solution Client'
    };
    setUser(newUser);
    showToast(`Selamat datang kembali, ${newUser.name}!`, 'success');
  };

  const logout = () => {
    setUser(null);
    showToast('Anda telah keluar dari sesi akun.', 'info');
    navigateTo({ name: 'home' });
  };

  // Transactions & Orders
  const addPurchasedOrder = (items: CartItem[], paymentMethod: string): Transaction => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AT-${randomSuffix}-ORD`;

    const orderItems = items.map((item) => {
      const p = getProductById(item.id)!;
      const cleanId = p.id.split('-')[0].toUpperCase();
      const codeRand = Math.floor(1000 + Math.random() * 9000);
      return {
        productId: p.id,
        productName: p.name,
        price: p.price,
        qty: item.qty,
        licenseKey: `AT-${cleanId}-${codeRand}-PRO`,
        version: p.version
      };
    });

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      orderNumber,
      date: 'Hari ini',
      total: cartTotal,
      status: 'Lunas',
      paymentMethod,
      items: orderItems
    };

    // Update purchased product IDs
    const newPurchased = [...purchasedProductIds];
    items.forEach((it) => {
      if (!newPurchased.includes(it.id)) {
        newPurchased.push(it.id);
      }
    });

    setPurchasedProductIds(newPurchased);
    setTransactions((prev) => [newTx, ...prev]);
    clearCart();
    setDiscountCode('');
    setAppliedDiscountPercent(0);

    return newTx;
  };

  // Modals
  const openDemoModal = (product: Product) => {
    setDemoProduct(product);
  };

  const closeDemoModal = () => {
    setDemoProduct(null);
  };

  const startDownloadSimulation = (product: Product) => {
    setDownloadingProduct(product);
  };

  const closeDownloadModal = () => {
    setDownloadingProduct(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        products: PRODUCTS,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortOption,
        setSortOption,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        discountCode,
        applyDiscountCode,
        appliedDiscountPercent,
        user,
        login,
        logout,
        purchasedProductIds,
        transactions,
        addPurchasedOrder,
        demoProduct,
        openDemoModal,
        closeDemoModal,
        downloadingProduct,
        startDownloadSimulation,
        closeDownloadModal,
        toasts,
        showToast,
        dismissToast,
        formatPrice,
        getProductById
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
