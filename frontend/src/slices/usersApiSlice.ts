import { url } from "inspector";
import { User } from "../types";
import { apiSlice } from "./apiSlice";

const usersSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<User, {email: string, password: string}>({
      query: ({ email, password }) => ({
        url: '/users/login',
        method: 'POST',
        body: { email, password },
      }),
    }),
    register: builder.mutation<User, {name: string, email: string, password: string}>({
      query: ({ name, email, password }) => ({
        url: '/users',
        method: 'POST',
        body: { name, email, password },
      }),
    }),
    profile: builder.query<User, void>({
      query: (data) => ({
        url: '/users/profile',
        method: 'POST',
        body: data
      })
    }),
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getUserDetails: builder.query<User, string>({
      query: (id) => `/users/${id}`,
    }),
    updateUser: builder.mutation<User, {id: string, name: string, email: string}>({
      query: ({ id, name, email }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: { name, email },
      })
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useProfileQuery, useGetUsersQuery, useDeleteUserMutation, useGetUserDetailsQuery, useUpdateUserMutation } = usersSlice;
