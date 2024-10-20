import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:5000/' }),
  endpoints: builder => ({
    demoRequest: builder.query({
      query: () => ({
        url: `demo`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useDemoRequestQuery } = apiSlice;
