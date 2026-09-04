export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'storage' | 'style';
  value: string;
  image?: string;
  priceModifier?: number;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  date: string;
  verified: boolean;
  comment: string;
  helpfulCount: number;
  images?: string[];
}

export interface Product {
  id: string;
  asin: string;
  title: string;
  brand: string;
  category: string;
  department: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  galleryImages: string[];
  prime: boolean;
  bestSeller?: boolean;
  soasChoice?: boolean;
  dealBadge?: string;
  dealDiscountPercent?: number;
  stock: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  description: string;
  bulletPoints: string[];
  specs?: Record<string, string>;
  variants?: ProductVariant[];
  boughtInPastMonth?: string;
  shipsFrom?: string;
  soldBy?: string;
  reviews?: Review[];
  climateFriendly?: boolean;
  tags?: string[];
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
  isGift: boolean;
  savedForLater?: boolean;
  selectedForCheckout: boolean;
  addedAt: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'prime_card' | 'gift_card';
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
}

export interface OrderTrackingStep {
  title: string;
  description: string;
  date: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  deliverySpeed: 'free' | 'standard' | 'priority';
  estimatedDelivery: string;
  status: 'ordered' | 'shipped' | 'out_for_delivery' | 'delivered';
  trackingSteps: OrderTrackingStep[];
}

export interface FilterState {
  searchQuery: string;
  department: string;
  category: string;
  minRating: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  primeOnly: boolean;
  brands: string[];
  dealsOnly: boolean;
  climateFriendlyOnly: boolean;
  sortBy: 'featured' | 'price_low_to_high' | 'price_high_to_low' | 'avg_review' | 'newest';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  avatar?: string;
  primeMember: boolean;
}

export type ActiveView = 'home' | 'search' | 'product_detail' | 'cart' | 'checkout' | 'orders' | 'admin';

