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

// Don't need user, rating, numReviews, or reviews
export interface CartItem {
  productId: string;
  quantity: number;
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
