export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: number;
  customer: string;
  customerName: string;
  customerPhone?: string;
  customerStreet?: string;
  customerAddress?: string;
  items: string;
  itemCount: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED';
  type: 'Walk-in' | 'Reservation';
  date: string;
  time: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
  phone?: string;
  street?: string;
  address?: string;
  shift?: string;
}

export interface Reservation {
  id: number;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'preparing';
  type: string;
  items: string;
  phone?: string;
  street?: string;
  address?: string;
}

export interface Feedback {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  reply?: string;
  repliedAt?: string;
  repliedBy?: string;
  readByCustomer?: boolean;
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  phone: string;
  address: string;
  hours: string;
  facebook: string;
}
