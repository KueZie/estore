import { createSlice } from "@reduxjs/toolkit";
import { CartItem, CartState, ShippingAddress } from "../types";
import { updateCart } from "../utils/cartUtils";

const initialLocalStorage = localStorage.getItem("cart")
const initialState = initialLocalStorage ? JSON.parse(initialLocalStorage) : {
  cartItems: [],
  itemsPrice: "0",
  shippingPrice: "0",
  taxPrice: "0",
  totalPrice: "0",
  shippingAddress: {
    address: "",
    city: "",
    postalCode: "",
    country: "",
  },
  paymentMethod: "PayPal",
} as CartState

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
    },
    resetCart: (state) => {
      state.cartItems = []
      updateCart(state)
    },
    saveShippingAddress: (state, action: { payload: ShippingAddress }) => {
      state.shippingAddress = action.payload
      updateCart(state)
    },
    savePaymentMethod: (state, action: { payload: string }) => {
      state.paymentMethod = action.payload
      updateCart(state)
    }
  }
});

export const { addToCart, removeFromCart, resetCart, saveShippingAddress, savePaymentMethod } = cartSlice.actions
export default cartSlice