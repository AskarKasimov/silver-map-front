import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IMark, IPoet } from './models.api';

export const projectAPI = createApi({
  reducerPath: 'API',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include', // для токена авторизации
  }),
  endpoints: (build) => ({
    getEventsByPoetId: build.query<IMark[], number>({
      query: (poet_id: number) => ({
        url: 'events',
        params: {
          poet_id,
        },
        METHOD: 'GET',
      }),
    }),
    getAllPoets: build.query<IPoet[], void>({
      query: () => ({
        url: 'poets',
        METHOD: 'GET',
      }),
    }),
  }),
});

export const { useGetAllPoetsQuery, useGetEventsByPoetIdQuery } = projectAPI;
