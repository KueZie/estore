export interface ProductInfo {
  _id: string;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
}

export interface ProductCreate extends Omit<ProductInfo, '_id' | 'rating' | 'numReviews'> {}
export interface ProductUpdate extends Partial<ProductInfo> {
  _id: string;
}

// Don't need user, rating, numReviews, or reviews
export interface CartItem {
  productId: string;
  qty: number;
  price: number;
  name: string;
  image: string;
  countInStock: number;
  brand: string;
  category: string;  
}

export type CartState = {
  cartItems: CartItem[];
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
  shippingAddress: ShippingAddress;
  paymentMethod: 'PayPal';
};

export type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export type UserWithPassword = User & {
  password: string;
};

// orderItems,
// shippingAddress,
// paymentMethod,
// itemsPrice,
// taxPrice,
// shippingPrice,
// totalPrice

export type OrderSubmit = {
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: string;
  taxPrice: string;
  shippingPrice: string;
  totalPrice: string;
};

export type Order = {
  _id: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt: string;
  deliveredAt: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
} & OrderSubmit;