import { Order } from "../types";
import { apiSlice } from "./apiSlice";

const ordersSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<any, Order>({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
    }),
  })
});

export const { useCreateOrderMutation } = ordersSlice;