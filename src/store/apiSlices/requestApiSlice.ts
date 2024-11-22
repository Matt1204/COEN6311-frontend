import { apiSlice } from './apiSlice';

interface FetchReqListArgs {
  supervisor_id: number;
  start_date: string;
  end_date: string;
}
export interface Request {
  request_id: number;
  hospital_id: number;
  supervisor_id: number;
  shift_date: string;
  shift_type: string;
  day_of_week: string;
  hours_per_shift: number;
  min_seniority: number;
  nurse_number: number;
}

export type fetchReqListRes = {
  [key: string]: Request[];
};

export const requestApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchReqList: builder.query<fetchReqListRes, FetchReqListArgs>({
      query: ({ supervisor_id, start_date, end_date }) => ({
        url: `request/get-req-list?supervisor_id=${encodeURIComponent(supervisor_id)}&start_date=${start_date}&end_date=${end_date}`,
        method: 'GET',
      }),
      transformResponse: (response: any, meta, arg) => {
        return response.data;
      },
    }),
  }),
});

export const { useFetchReqListQuery } = requestApiSlice;
