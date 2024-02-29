import { apiSlice } from "./apiSlice";
import { PaginatedProductResult, ProductCreate, ProductInfo, ProductUpdate } from "../types";

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedProductResult, { pageNumber?: number, keyword?: string }>({
      query: ({ pageNumber, keyword }) => ({
        url: `/products`,
        params: { pageNumber: pageNumber || 1, keyword: keyword || '' },
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<ProductInfo, string>({
      query: (id) => `/products/${id}`,
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<ProductInfo, ProductCreate>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<ProductInfo, ProductUpdate>({ // Needs id
      query: (product) => ({
        url: `/products/${product._id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImage: builder.mutation<{ message: string, imagePath: string }, FormData>({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    createReview: builder.mutation<{ message?: string }, { productId: string, rating: number, comment: string }>({
      query: ({ productId, rating, comment }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: { rating, comment },
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const { 
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useCreateReviewMutation
} = productSlice;