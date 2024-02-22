import { apiSlice } from "./apiSlice";
import { ProductInfo } from "../types";

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductInfo[], void>({
      query: () => '/products',
    }),
    getProductById: builder.query<ProductInfo, string>({
      query: (id) => `/products/${id}`,
    }),
    createProduct: builder.mutation<ProductInfo, ProductInfo>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
    }),
    updateProduct: builder.mutation<ProductInfo, Partial<ProductInfo>>({ // Needs id
      query: (product) => ({
        url: `/products/${product._id}`,
        method: 'PUT',
        body: product,
      }),
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { 
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productSlice;