import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, FilterState, Order, ShippingAddress, PaymentMethod, ActiveView, UserAccount } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

interface ShopContextType {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  
  // Product Management (Admin)
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Order Management (Admin)
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Authentication & User Accounts
  currentUser: UserAccount | null;
  isAdminAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'admin';
  setAuthModalMode: (mode: 'login' | 'register' | 'admin') => void;
  loginUser: (email: string, pass: string) => boolean;
  registerUser: (name: string, email: string, pass: string) => boolean;
  logoutUser: () => void;
  loginAdmin: (pinOrPass: string) => boolean;
  logoutAdmin: () => void;
  usersList: UserAccount[];
  toggleUserStatus: (userId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariants?: Record<string, string>, isGift?: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleCheckoutItem: (cartItemId: string) => void;
  selectAllForCheckout: (select: boolean) => void;
  saveForLater: (cartItemId: string) => void;
  moveToCartFromSaved: (cartItemId: string) => void;
  deleteSavedItem: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  hasPrimeDelivery: boolean;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Filters & Search
  filters: FilterState;
  setSearchQuery: (query: string, department?: string) => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;

  // Drawer / Modals
  sideNavOpen: boolean;
  setSideNavOpen: (open: boolean) => void;
  locationModalOpen: boolean;
  setLocationModalOpen: (open: boolean) => void;
  deliveryLocation: { city: string; zip: string; country: string };
  setDeliveryLocation: (location: { city: string; zip: string; country: string }) => void;

  // Checkout & Orders
  shippingAddress: ShippingAddress;
  setShippingAddress: (address: ShippingAddress) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  placeOrder: (deliverySpeed: 'free' | 'standard' | 'priority') => Order;
  orders: Order[];
  currentOrderConfirmation: Order | null;
  setCurrentOrderConfirmation: (order: Order | null) => void;
  
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}


const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  department: 'All Departments',
  category: '',
  minRating: null,
  minPrice: null,
  maxPrice: null,
  primeOnly: false,
  brands: [],
  dealsOnly: false,
  climateFriendlyOnly: false,
  sortBy: 'featured',
};

const DEFAULT_ADDRESS: ShippingAddress = {
  fullName: 'Alex Johnson',
  street: '742 Evergreen Terrace',
  apt: 'Apt 4B',
  city: 'Seattle',
  state: 'WA',
  zip: '98101',
  country: 'United States',
  phone: '(206) 555-0192',
  isDefault: true,
};

const DEFAULT_PAYMENT: PaymentMethod = {
  id: 'pm-1',
  type: 'prime_card',
  last4: '4242',
  brand: 'SOA Prime Rewards Visa',
  expiryMonth: '08',
  expiryYear: '29',
  holderName: 'Alex Johnson',
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('soa_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length === MOCK_PRODUCTS.length &&
          parsed.some((p: Product) => p.title.startsWith('কালোজিরা মধু'))
        ) {
          return parsed;
        }
      }
    } catch {}
    return MOCK_PRODUCTS;
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('home');
  
  // Cart state stored locally
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('soa_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Initial demo cart item for immediate interactive discovery
    return [
      {
        cartItemId: 'item-demo-1',
        productId: 'prod-1',
        product: MOCK_PRODUCTS[0],
        quantity: 1,
        selectedVariants: { color: 'White' },
        isGift: false,
        savedForLater: false,
        selectedForCheckout: true,
        addedAt: Date.now()
      }
    ];
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('soa_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['prod-5', 'prod-9'];
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('soa_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'ord-101',
        orderNumber: '112-9482710-5839201',
        orderDate: 'August 10, 2026',
        items: [
          {
            cartItemId: 'past-1',
            productId: 'prod-3',
            product: MOCK_PRODUCTS[2],
            quantity: 1,
            selectedVariants: { storage: '16 GB' },
            isGift: false,
            savedForLater: false,
            selectedForCheckout: true,
            addedAt: Date.now() - 400000000
          }
        ],
        subtotal: 1450.00,
        shipping: 0,
        tax: 72.50,
        total: 1522.50,
        shippingAddress: DEFAULT_ADDRESS,
        paymentMethod: DEFAULT_PAYMENT,
        deliverySpeed: 'free',
        estimatedDelivery: 'Delivered yesterday',
        status: 'delivered',
        trackingSteps: [
          { title: 'Ordered', description: 'Order placed securely', date: 'Aug 10, 2:15 PM', completed: true, current: false },
          { title: 'Shipped', description: 'Package departed SOA fulfillment center', date: 'Aug 11, 4:00 AM', completed: true, current: false },
          { title: 'Out for delivery', description: 'With SOA delivery driver', date: 'Aug 12, 8:30 AM', completed: true, current: false },
          { title: 'Delivered', description: 'Delivered to front door', date: 'Aug 12, 1:45 PM', completed: true, current: true }
        ]
      }
    ];
  });

  // Auth & Admin states
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('soa_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'usr-1',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      role: 'customer',
      status: 'active',
      createdAt: '2025-01-15',
      ordersCount: 4,
      totalSpent: 432.50,
      primeMember: true
    };
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('soa_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin'>('login');

  const [usersList, setUsersList] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('soa_users_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'usr-1', name: 'Alex Johnson', email: 'alex.johnson@example.com', role: 'customer', status: 'active', createdAt: '2025-01-15', ordersCount: 4, totalSpent: 4850.00, primeMember: true },
      { id: 'usr-2', name: 'Nusrat Jahan', email: 'nusrat.jahan@gmail.com', role: 'customer', status: 'active', createdAt: '2025-03-02', ordersCount: 2, totalSpent: 2150.00, primeMember: true },
      { id: 'usr-3', name: 'Tanvir Hasan', email: 'tanvir.h@yahoo.com', role: 'customer', status: 'active', createdAt: '2025-04-18', ordersCount: 1, totalSpent: 750.00, primeMember: false },
      { id: 'usr-4', name: 'SOA Merchant Admin', email: 'admin@soa.com', role: 'admin', status: 'active', createdAt: '2024-11-01', ordersCount: 0, totalSpent: 0, primeMember: true },
      { id: 'usr-5', name: 'Karim Rahman', email: 'karim.r@outlook.com', role: 'customer', status: 'suspended', createdAt: '2025-02-20', ordersCount: 0, totalSpent: 0, primeMember: false }
    ];
  });

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState({ city: 'Seattle', zip: '98101', country: 'US' });
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(DEFAULT_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(DEFAULT_PAYMENT);
  const [currentOrderConfirmation, setCurrentOrderConfirmation] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('soa_user', JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('soa_admin_auth', isAdminAuthenticated ? 'true' : 'false');
    } catch {}
  }, [isAdminAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem('soa_users_list', JSON.stringify(usersList));
    } catch {}
  }, [usersList]);

  const loginUser = (email: string, pass: string): boolean => {
    const existingUser = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      if (existingUser.status === 'suspended') {
        showToast('Account is suspended. Please contact support.');
        return false;
      }
      setCurrentUser(existingUser);
      showToast(`Welcome back, ${existingUser.name}!`);
      setIsAuthModalOpen(false);
      return true;
    }
    // Create new customer session if email doesn't exist
    const newAcc: UserAccount = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      ordersCount: 0,
      totalSpent: 0,
      primeMember: true
    };
    setUsersList((prev) => [...prev, newAcc]);
    setCurrentUser(newAcc);
    showToast(`Account signed in successfully as ${newAcc.name}!`);
    setIsAuthModalOpen(false);
    return true;
  };

  const registerUser = (name: string, email: string, pass: string): boolean => {
    const newAcc: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      ordersCount: 0,
      totalSpent: 0,
      primeMember: true
    };
    setUsersList((prev) => [...prev, newAcc]);
    setCurrentUser(newAcc);
    showToast(`Welcome to SOA Traceable Foods, ${newAcc.name}!`);
    setIsAuthModalOpen(false);
    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Signed out of account.');
  };

  const loginAdmin = (pinOrPass: string): boolean => {
    const cleaned = pinOrPass.trim().toLowerCase();
    if (cleaned === '1234' || cleaned === 'admin123' || cleaned === 'admin@soa.com' || cleaned === 'admin') {
      setIsAdminAuthenticated(true);
      showToast('Admin authentication successful! Access granted.');
      setIsAuthModalOpen(false);
      return true;
    }
    showToast('Invalid Admin Credentials. Try PIN 1234 or admin123');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    showToast('Logged out of Admin Seller Central.');
    if (activeView === 'admin') {
      setActiveView('home');
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          showToast(`User ${u.name} status changed to ${nextStatus}.`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };


  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('soa_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('soa_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('soa_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('soa_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Product & Order Admin Operations
  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...newProductData,
      id,
      asin: newProductData.asin || `B0${Math.floor(10000000 + Math.random() * 90000000)}`,
      rating: newProductData.rating || 5.0,
      reviewsCount: newProductData.reviewsCount || 1,
      stockStatus: newProductData.stock <= 0 ? 'out_of_stock' : newProductData.stock < 10 ? 'low_stock' : 'in_stock',
      galleryImages: newProductData.galleryImages?.length ? newProductData.galleryImages : [newProductData.image],
      bulletPoints: newProductData.bulletPoints?.length ? newProductData.bulletPoints : ['High quality item', 'Prime delivery eligible'],
      specs: newProductData.specs || { Brand: newProductData.brand, Category: newProductData.category }
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added product "${newProduct.title.slice(0, 30)}..." to catalog.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updatedStock = updates.stock !== undefined ? updates.stock : p.stock;
        const stockStatus = updatedStock <= 0 ? 'out_of_stock' : updatedStock < 10 ? 'low_stock' : 'in_stock';
        return {
          ...p,
          ...updates,
          stockStatus
        };
      })
    );
    showToast(`Updated product details.`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Product removed from catalog.`);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId && ord.orderNumber !== orderId) return ord;
        const updatedSteps = ord.trackingSteps.map((step) => {
          if (status === 'ordered') {
            return { ...step, completed: step.title === 'Ordered', current: step.title === 'Ordered' };
          } else if (status === 'shipped') {
            const isCompleted = step.title === 'Ordered' || step.title === 'Shipped';
            return { ...step, completed: isCompleted, current: step.title === 'Shipped' };
          } else if (status === 'out_for_delivery') {
            const isCompleted = step.title !== 'Delivered';
            return { ...step, completed: isCompleted, current: step.title === 'Out for delivery' };
          } else {
            return { ...step, completed: true, current: step.title === 'Delivered' };
          }
        });
        return {
          ...ord,
          status,
          trackingSteps: updatedSteps
        };
      })
    );
    showToast(`Order status updated to ${status}.`);
  };

  const selectedProduct = selectedProductId 
    ? products.find((p) => p.id === selectedProductId) || null 
    : null;

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedVariants?: Record<string, string>, isGift = false) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => !item.savedForLater && item.productId === product.id && JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          isGift: isGift || updated[existingIndex].isGift
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          productId: product.id,
          product,
          quantity,
          selectedVariants,
          isGift,
          savedForLater: false,
          selectedForCheckout: true,
          addedAt: Date.now()
        };
        return [newItem, ...prev];
      }
    });

    showToast(`Added "${product.title.slice(0, 38)}..." to Cart.`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from your cart.');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  const toggleCheckoutItem = (cartItemId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, selectedForCheckout: !item.selectedForCheckout } : item
      )
    );
  };

  const selectAllForCheckout = (select: boolean) => {
    setCart((prev) =>
      prev.map((item) => (!item.savedForLater ? { ...item, selectedForCheckout: select } : item))
    );
  };

  const saveForLater = (cartItemId: string) => {
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, savedForLater: true } : item))
    );
    showToast('Item moved to Saved for Later.');
  };

  const moveToCartFromSaved = (cartItemId: string) => {
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, savedForLater: false } : item))
    );
    showToast('Item moved back to active Cart.');
  };

  const deleteSavedItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart((prev) => prev.filter((item) => item.savedForLater));
  };

  // Cart calculations
  const activeCartItems = cart.filter((item) => !item.savedForLater);
  const checkoutItems = activeCartItems.filter((item) => item.selectedForCheckout);
  const cartCount = activeCartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = checkoutItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 1000.0;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const hasPrimeDelivery = true; // SOA Prime simulator

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your Wish List.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to your Wish List.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Search & Filtering
  const setSearchQuery = (query: string, department?: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
      department: department !== undefined ? department : prev.department,
    }));
    setActiveView('search');
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Filtered Products computation
  const filteredProducts = products.filter((product) => {
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchDept = product.department.toLowerCase().includes(q);
      const matchTag = product.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchBrand && !matchCat && !matchDept && !matchTag) {
        return false;
      }
    }

    if (filters.department && filters.department !== 'All Departments') {
      if (product.department !== filters.department) return false;
    }

    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (filters.minRating && product.rating < filters.minRating) {
      return false;
    }

    if (filters.minPrice !== null && product.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice !== null && product.price > filters.maxPrice) {
      return false;
    }

    if (filters.primeOnly && !product.prime) {
      return false;
    }

    if (filters.dealsOnly && !product.dealBadge && !product.dealDiscountPercent) {
      return false;
    }

    if (filters.climateFriendlyOnly && !product.climateFriendly) {
      return false;
    }

    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price_low_to_high') {
      return a.price - b.price;
    }
    if (filters.sortBy === 'price_high_to_low') {
      return b.price - a.price;
    }
    if (filters.sortBy === 'avg_review') {
      return b.rating - a.rating;
    }
    if (filters.sortBy === 'newest') {
      return b.reviewsCount - a.reviewsCount;
    }
    return 0; // featured default
  });

  // Place Order
  const placeOrder = (deliverySpeed: 'free' | 'standard' | 'priority'): Order => {
    const itemsToOrder = checkoutItems;
    const subtotal = cartSubtotal;
    const shipping = deliverySpeed === 'priority' ? 60 : 0;
    const tax = Number((subtotal * 0.088).toFixed(2));
    const total = Number((subtotal + shipping + tax).toFixed(2));

    const estDelivery = deliverySpeed === 'priority' ? 'Tomorrow, by 8 PM' : 'In 2 days, by 9 PM';

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `114-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
      orderDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      items: [...itemsToOrder],
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      paymentMethod,
      deliverySpeed,
      estimatedDelivery: estDelivery,
      status: 'ordered',
      trackingSteps: [
        { title: 'Ordered', description: 'Order confirmed and verified', date: 'Just now', completed: true, current: true },
        { title: 'Shipped', description: 'Preparing dispatch at local SOA warehouse', date: 'Pending', completed: false, current: false },
        { title: 'Out for delivery', description: 'Courier will deliver to your doorstep', date: 'Pending', completed: false, current: false },
        { title: 'Delivered', description: 'Signature or photo confirmation', date: 'Pending', completed: false, current: false },
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    // remove ordered items from cart
    setCart((prev) => prev.filter((item) => item.savedForLater || !item.selectedForCheckout));
    setCurrentOrderConfirmation(newOrder);
    setActiveView('checkout');
    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        filteredProducts,
        selectedProduct,
        selectedProductId,
        setSelectedProductId,
        activeView,
        setActiveView,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        currentUser,
        isAdminAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        loginUser,
        registerUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
        usersList,
        toggleUserStatus,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCheckoutItem,
        selectAllForCheckout,
        saveForLater,
        moveToCartFromSaved,
        deleteSavedItem,
        clearCart,
        cartCount,
        cartSubtotal,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        hasPrimeDelivery,
        wishlist,
        toggleWishlist,
        isInWishlist,
        filters,
        setSearchQuery,
        updateFilter,
        resetFilters,
        sideNavOpen,
        setSideNavOpen,
        locationModalOpen,
        setLocationModalOpen,
        deliveryLocation,
        setDeliveryLocation,
        shippingAddress,
        setShippingAddress,
        paymentMethod,
        setPaymentMethod,
        placeOrder,
        orders,
        currentOrderConfirmation,
        setCurrentOrderConfirmation,
        toastMessage,
        showToast
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
