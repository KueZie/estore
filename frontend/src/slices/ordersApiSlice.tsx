import { Order, OrderSubmit } from "../types";
import { apiSlice } from "./apiSlice";
import { OrderResponseBody } from "@paypal/paypal-js";

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
    getPaypalClientId: builder.query<any, void>({
      query: () => '/config/paypal',
    }),
    payOrder: builder.mutation<any, { orderId: string, details: OrderResponseBody }>({
      query: ({ orderId, details }) => ({
        url: `/orders/${orderId}/pay`,
        method: 'PUT',
        body: {
          id: details.id,
          status: details.status,
          update_time: details.update_time,
          payer: details.payer,
        },
      }),
    }),
    getUserOrders: builder.query<Order[], void>({
      query: () => '/orders/myorders',
    })
  })
});

export const { 
  useCreateOrderMutation,
  useGetOrderDetailsByIdQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useGetUserOrdersQuery
} = ordersSlice;