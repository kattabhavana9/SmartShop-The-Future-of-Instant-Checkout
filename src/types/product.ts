export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  discount?: number;
  image: string;
  brand: string;
  category: string;
  subcategory?: string;
  stock: number;
  rating: number;
  reviews: number;
  isPopular?: boolean;
  barcode?: string;
  unit: string;
  weight?: string;
  ingredients?: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  items: {
    product: Product;
    quantity: number;
  }[];
  totalAmount: number;
  paymentId: string;
  paymentMethod: string;
  status: 'success' | 'failed' | 'pending';
  date: string;
}