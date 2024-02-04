import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
  productId: string;
  quantity: number;
}

const initialState = JSON.parse(localStorage.getItem("cart") || '{}') as { cartItems: CartItem[] }

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload as CartItem;

      const existItem = state.cartItems.find((x: CartItem) => x.productId === item.productId);
      if (existItem) { // If the item already exists in the cart, update the quantity
        state.cartItems = state.cartItems.map((x: CartItem) =>
          x.productId === existItem.productId ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      localStorage.setItem("cart", JSON.stringify(state));
    }
  }
});

export const { addToCart } = cartSlice.actions;
export default cartSlice;