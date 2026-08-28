import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, ColorOption, QuoteRequest, Order, Currency, User, UserRole } from '../types';
import { INITIAL_QUOTES, PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';

export const CURRENCIES: Record<'USD' | 'EUR' | 'GBP', Currency> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
};

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'pink';
}

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-client-demo',
    name: 'Vivienne Vance',
    email: 'client@marv.com',
    role: 'client',
    phone: '+1 (555) 234-8901',
    title: 'Private Couture Client',
    vipTier: 'VIP Haute',
    avatarInitials: 'VV',
    savedAddress: {
      address: '742 Fifth Avenue, Penthouse B',
      city: 'New York',
      postalCode: '10022',
      country: 'United States',
    },
    preferredMeasurements: {
      bust: '34 in',
      waist: '27 in',
      hips: '37 in',
      height: '5\'8"',
      unit: 'in',
    },
    createdAt: '2026-01-10T12:00:00.000Z',
  },
  {
    id: 'usr-admin-demo',
    name: 'Marv Henderson',
    email: 'admin@marv.com',
    role: 'admin',
    phone: '+1 (800) 555-MARV',
    title: 'Creative Director & Founder',
    vipTier: 'Master Tailor',
    avatarInitials: 'MH',
    createdAt: '2025-10-01T08:00:00.000Z',
  },
];

interface ShopContextType {
  // Auth & Client Profile
  currentUser: User | null;
  users: User[];
  signIn: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signUp: (userData: { name: string; email: string; password: string; phone?: string; role?: UserRole }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authInitialTab: 'signin' | 'signup' | 'admin';
  openAuthModal: (tab?: 'signin' | 'signup' | 'admin') => void;

  // Admin Customization Platform
  isAdminPlatformOpen: boolean;
  setIsAdminPlatformOpen: (open: boolean) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  resetProductsToDefault: () => void;
  updateQuoteStatus: (id: string, status: QuoteRequest['status']) => void;
  deleteQuote: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: ColorOption, quantity?: number) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceInUSD: number) => string;

  // Quotes
  quotes: QuoteRequest[];
  submitQuote: (quoteData: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => QuoteRequest;
  activeQuote: QuoteRequest | null;
  setActiveQuote: (q: QuoteRequest | null) => void;
  openQuoteForProduct: (product?: Product) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderPayload: Omit<Order, 'id' | 'createdAt' | 'trackingNumber' | 'status'>) => Order;

  // Saved / Wishlist
  savedIds: string[];
  toggleSave: (productId: string) => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isQuoteModalOpen: boolean;
  setIsQuoteModalOpen: (open: boolean) => void;
  isQuoteTrackerOpen: boolean;
  setIsQuoteTrackerOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  quotePresetProduct: Product | null;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'pink') => void;
  dismissToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users state
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('marv_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('marv_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup' | 'admin'>('signin');
  const [isAdminPlatformOpen, setIsAdminPlatformOpen] = useState(false);

  // Products state (customizable via Admin platform)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('marv_products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('marv_cart') || localStorage.getItem('rose_clothing_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quotes state
  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    try {
      const saved = localStorage.getItem('marv_quotes') || localStorage.getItem('rose_clothing_quotes');
      return saved ? JSON.parse(saved) : INITIAL_QUOTES;
    } catch {
      return INITIAL_QUOTES;
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('marv_orders') || localStorage.getItem('rose_clothing_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saved items
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('marv_saved') || localStorage.getItem('rose_clothing_saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Currency
  const [currency, setCurrency] = useState<Currency>(CURRENCIES.USD);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isQuoteTrackerOpen, setIsQuoteTrackerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quotePresetProduct, setQuotePresetProduct] = useState<Product | null>(null);
  const [activeQuote, setActiveQuote] = useState<QuoteRequest | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('marv_users', JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('marv_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('marv_current_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('marv_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('marv_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('marv_quotes', JSON.stringify(quotes));
    } catch {
      // ignore
    }
  }, [quotes]);

  useEffect(() => {
    try {
      localStorage.setItem('marv_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('marv_saved', JSON.stringify(savedIds));
    } catch {
      // ignore
    }
  }, [savedIds]);

  const showToast = (message: string, type: 'success' | 'info' | 'pink' = 'pink') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3600);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openAuthModal = (tab: 'signin' | 'signup' | 'admin' = 'signin') => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  // Authentication methods
  const signIn = async (
    email: string,
    password: string,
    requestedRole?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check credentials (demo passwords: 'admin123' for admin, 'client123' for clients or whatever was registered)
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (requestedRole === 'admin') {
      if (trimmedEmail === 'admin@marv.com' && password === 'admin123') {
        const adminUser = existing || DEFAULT_USERS[1];
        setCurrentUser(adminUser);
        showToast(`Welcome to Marv. Atelier Studio, ${adminUser.name}!`, 'pink');
        return { success: true };
      }
      if (existing && existing.role === 'admin') {
        setCurrentUser(existing);
        showToast(`Welcome back, ${existing.name}!`, 'pink');
        return { success: true };
      }
      return { success: false, error: 'Invalid admin credentials. Use admin@marv.com / admin123 or select 1-click login.' };
    }

    if (existing) {
      if (existing.role === 'admin') {
        setCurrentUser(existing);
        showToast(`Welcome back, ${existing.name}! (Admin Access)`, 'pink');
        return { success: true };
      }
      setCurrentUser(existing);
      showToast(`Welcome back to Marv. collection, ${existing.name}!`, 'pink');
      return { success: true };
    }

    // If not found but user entered any email & password, allow friendly client auto-login
    if (trimmedEmail && password.length >= 4) {
      const initials = trimmedEmail.substring(0, 2).toUpperCase();
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: trimmedEmail.split('@')[0].replace('.', ' '),
        email: trimmedEmail,
        role: 'client',
        vipTier: 'Member',
        avatarInitials: initials,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      showToast(`Welcome to Marv. collection, ${newUser.name}!`, 'pink');
      return { success: true };
    }

    return { success: false, error: 'Please enter a valid email and password (minimum 4 characters).' };
  };

  const signUp = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    if (!userData.name.trim()) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }
    if (userData.password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const initials = userData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'MC';

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name.trim(),
      email: trimmedEmail,
      role: userData.role || 'client',
      phone: userData.phone?.trim() || undefined,
      title: userData.role === 'admin' ? 'Atelier Administrator' : 'Private Client',
      vipTier: userData.role === 'admin' ? 'Master Tailor' : 'Member',
      avatarInitials: initials,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev.filter((u) => u.email.toLowerCase() !== trimmedEmail), newUser]);
    setCurrentUser(newUser);
    showToast(`Account registered! Welcome to Marv. collection, ${newUser.name}.`, 'success');
    return { success: true };
  };

  const signOut = () => {
    const userName = currentUser?.name || 'Client';
    setCurrentUser(null);
    setIsAdminPlatformOpen(false);
    showToast(`Signed out successfully. See you soon, ${userName}.`, 'info');
  };

  // Product Customization Methods (Admin Platform)
  const addProduct = (newProdData: Omit<Product, 'id'>): Product => {
    const id = `marv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
    const newProduct: Product = {
      ...newProdData,
      id,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to the Marv. collection!`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast(`Updated product settings for "${updates.name || 'garment'}".`, 'pink');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Removed "${target?.name || 'Product'}" from catalog.`, 'info');
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newProduct: Product = {
      ...target,
      id: `marv-dup-${Date.now().toString(36)}`,
      name: `${target.name} (Custom Variant)`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Duplicated "${target.name}". Ready for customization!`, 'pink');
  };

  const resetProductsToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    showToast('Product catalog reset to factory Marv. collection defaults.', 'info');
  };

  const updateQuoteStatus = (id: string, status: QuoteRequest['status']) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
    showToast(`Quote #${id} status updated to "${status}".`, 'pink');
  };

  const deleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    showToast(`Quote #${id} deleted.`, 'info');
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    showToast(`Order #${id} status updated to "${status}".`, 'pink');
  };

  const formatPrice = (priceInUSD: number): string => {
    const converted = priceInUSD * currency.rate;
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
  };

  const addToCart = (product: Product, size: string, color: ColorOption, quantity = 1) => {
    const itemId = `${product.id}-${size}-${color.name}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          size,
          color,
          quantity,
        },
      ];
    });
    showToast(`Added ${product.name} (${size} / ${color.name}) to cart.`, 'pink');
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleSave = (productId: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved items', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist', 'pink');
        return [...prev, productId];
      }
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const openQuoteForProduct = (product?: Product) => {
    if (product) {
      setQuotePresetProduct(product);
    } else {
      setQuotePresetProduct(null);
    }
    setIsQuoteModalOpen(true);
  };

  const submitQuote = (
    quoteData: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>
  ): QuoteRequest => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newQuote: QuoteRequest = {
      ...quoteData,
      id: `QR-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'Under Review',
    };
    setQuotes((prev) => [newQuote, ...prev]);
    setActiveQuote(newQuote);
    showToast(`Quote inquiry #${newQuote.id} created! Our master tailor will review.`, 'pink');
    return newQuote;
  };

  const placeOrder = (
    orderPayload: Omit<Order, 'id' | 'createdAt' | 'trackingNumber' | 'status'>
  ): Order => {
    const randomTrack = 'MARV-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newOrder: Order = {
      ...orderPayload,
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      trackingNumber: randomTrack,
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Order #${newOrder.id} successfully placed!`, 'success');
    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        currentUser,
        users,
        signIn,
        signUp,
        signOut,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authInitialTab,
        openAuthModal,
        isAdminPlatformOpen,
        setIsAdminPlatformOpen,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        resetProductsToDefault,
        updateQuoteStatus,
        deleteQuote,
        updateOrderStatus,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        currency,
        setCurrency,
        formatPrice,
        quotes,
        submitQuote,
        activeQuote,
        setActiveQuote,
        openQuoteForProduct,
        orders,
        placeOrder,
        savedIds,
        toggleSave,
        isCartOpen,
        setIsCartOpen,
        isQuoteModalOpen,
        setIsQuoteModalOpen,
        isQuoteTrackerOpen,
        setIsQuoteTrackerOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProduct,
        setSelectedProduct,
        quotePresetProduct,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
