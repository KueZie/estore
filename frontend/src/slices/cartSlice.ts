import { createSlice } from "@reduxjs/toolkit";
import { CartItem, CartState } from "../types";
import { updateCart } from "../utils/cartUtils";

const initialState = JSON.parse(localStorage.getItem("cart") || '{"cartItems":[]}') as CartState

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload

      item.productId = item._id

      const existItem = state.cartItems?.find((x: CartItem) => x.productId === item.productId)
      if (existItem) { // If the item already exists in the cart, update the quantity
        state.cartItems = state.cartItems.map((x: CartItem) =>
          x.productId === existItem.productId ? item : x
        )
      } else {
        console.log(`Setting cartItems`)
        state.cartItems = [...state.cartItems, item]
      }
      updateCart(state)
    },
    removeFromCart: (state, action: {payload: string}) => {
      state.cartItems = state.cartItems.filter((x: CartItem) => x.productId !== action.payload)
      updateCart(state)
    }
  }
});

export const { addToCart, removeFromCart } = cartSlice.actions
export default cartSlice