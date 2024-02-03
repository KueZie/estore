import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseApiUrl = '/api'

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: baseApiUrl }),
  tagTypes: ['Product', 'User', 'Order'],
  endpoints: (builder) => ({})
})
