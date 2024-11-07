import { apiSlice } from './apiSlice';

export interface Hospital {
  h_id: number;
  h_name: string;
  h_address: string;
  h_hotline: string;
}

interface FetchAllHospitalsResponse {
  data: Hospital[];
}

export const hospitalApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchAllHospitals: builder.query<FetchAllHospitalsResponse, void>({
      query: () => ({
        url: 'get-all-hospitals',
        method: 'GET',
      }),
    }),
  }),
});

export const { useFetchAllHospitalsQuery, useLazyFetchAllHospitalsQuery } = hospitalApiSlice;
