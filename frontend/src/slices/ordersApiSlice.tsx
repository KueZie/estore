import { Order, OrderSubmit } from "../types";
import { apiSlice } from "./apiSlice";

const ordersSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<any, OrderSubmit>({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
    }),
    getOrderDetailsById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
    }),
  })
});

export const { useCreateOrderMutation, useGetOrderDetailsByIdQuery } = ordersSlice;