import { apiSlice } from "./apiSlice";
import { ProductInfo } from "../types";

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductInfo[], void>({
      query: () => '/products',
    }),
    getProductById: builder.query<ProductInfo, number>({
      query: (id) => `/products/${id}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productSlice;