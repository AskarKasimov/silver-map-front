import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IExample } from './models.api';

export const projectAPI = createApi({
  reducerPath: 'API',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include', // для токена авторизации
  }),
  endpoints: (build) => ({
    getDefault: build.query<IExample[], void>({
      query: () => 'examples',
    }),
    addDefault: build.mutation<IExample, Partial<IExample>>({
      query: (body) => ({
        url: 'examples',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useAddDefaultMutation, useGetDefaultQuery } = projectAPI;
