export type Category = 
  | 'All'
  | 'Outerwear'
  | 'Dresses'
  | 'Tops'
  | 'Trousers'
  | 'Knitwear'
  | 'Accessories';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: Exclude<Category, 'All'>;
  price: number; // Base USD
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL')[];
  colors: ColorOption[];
  description: string;
  details: string[];
  materials: string;
  care: string;
  inStock: boolean;
  badge?: string;
  quoteAvailable: boolean;
  featured?: boolean;
}

export interface CartItem {
  id: string; // product.id + size + color.name
  product: Product;
  size: string;
  color: ColorOption;
  quantity: number;
}

export type QuoteProjectType = 
  | 'bespoke_single' 
  | 'bulk_batch' 
  | 'bridal_event' 
  | 'custom_fabric';

export interface QuoteMeasurements {
  bust?: string;
  waist?: string;
  hips?: string;
  inseam?: string;
  height?: string;
  unit: 'in' | 'cm';
}

export interface QuoteRequest {
  id: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectType: QuoteProjectType;
  garmentSilhouette: string;
  fabricType: string;
  pinkTone: ColorOption;
  targetQuantity: number;
  estimatedBudget: number;
  measurements?: QuoteMeasurements;
  notes: string;
  targetTimeline: 'standard' | 'express' | 'flexible';
  referenceImageName?: string;
  referenceImagePreview?: string;
  status: 'Under Review' | 'Material Sourcing' | 'Pattern Drafting' | 'Tailor Assigned' | 'Approved';
  relatedProductName?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: Currency;
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string;
  status: 'Confirmed' | 'In Production' | 'Dispatched';
  trackingNumber: string;
}

export interface Currency {
  code: 'USD' | 'EUR' | 'GBP';
  symbol: string;
  rate: number; // multiplier from USD
}

export interface FilterState {
  category: Category;
  searchQuery: string;
  selectedSize: string;
  priceRange: [number, number];
  pinkToneOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating';
}

export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  title?: string;
  vipTier?: 'Member' | 'Atelier Club' | 'VIP Haute' | 'Master Tailor';
  avatarInitials?: string;
  savedAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  preferredMeasurements?: QuoteMeasurements;
  createdAt: string;
}
