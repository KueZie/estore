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
};
