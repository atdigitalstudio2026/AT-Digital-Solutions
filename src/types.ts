export type CategoryType = 
  | 'Semua'
  | 'Produktivitas'
  | 'Desain'
  | 'Developer'
  | 'Keamanan'
  | 'Analitik'
  | 'Keuangan';

export interface ProductReview {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  company?: string;
  rating: number;
  date: string;
  text: string;
}

export interface SoftwareFeature {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  cat: CategoryType;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  tag?: 'new' | 'best' | 'featured' | 'pro' | null;
  iconLetter: string;
  gradient: string;
  accentColor: string;
  tagline: string;
  desc: string;
  features: string[];
  detailedFeatures?: SoftwareFeature[];
  req: string[];
  version: string;
  platform: string;
  fileSize: string;
  downloadCount: string;
  highlights: string[];
  licenseType: string;
  screenshots: {
    title: string;
    description: string;
    badge: string;
  }[];
}

export interface CartItem {
  id: string;
  qty: number;
  selectedPlatform?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  company?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  qty: number;
  licenseKey: string;
  version: string;
}

export interface Transaction {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'Lunas' | 'Menunggu' | 'Dibatalkan';
  paymentMethod: string;
  items: OrderItem[];
}

export type SortOption = 'popular' | 'rating' | 'new' | 'price-asc' | 'price-desc';

export type AppRoute = 
  | { name: 'home' }
  | { name: 'catalog'; category?: CategoryType; search?: string }
  | { name: 'detail'; productId: string }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'success'; orderId?: string }
  | { name: 'dashboard'; tab?: 'apps' | 'licenses' | 'history' | 'settings' }
  | { name: 'auth'; mode?: 'login' | 'register' };
