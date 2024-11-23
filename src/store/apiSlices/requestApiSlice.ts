import { apiSlice } from './apiSlice';

interface CreateReqRes {
  message: string;
}

export interface CreateReqArgs {
  supervisor_id: number;
  shift_date: string;
  day_of_week: string;
  shift_type: string;
  hours_per_shift: number;
  nurse_number: number;
  min_seniority: number;
}

interface getReqArgs {
  request_id: number;
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
interface FetchReqListArgs {
  supervisor_id: number;
  start_date: string;
  end_date: string;
}
export type fetchReqListRes = {
  [date: string]: Request[];
};

export interface UpdateReqArgs {
  request_id: number;
  supervisor_id?: number;
  shift_date?: string;
  shift_type?: string;
  day_of_week?: string;
  hours_per_shift?: number;
  min_seniority?: number;
  nurse_number?: number;
}

export const requestApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchReqList: builder.query<fetchReqListRes, FetchReqListArgs>({
      query: ({ supervisor_id, start_date, end_date }) => ({
        url: `request/get-req-list?supervisor_id=${encodeURIComponent(supervisor_id)}&start_date=${start_date}&end_date=${end_date}`,
        method: 'GET',
      }),
      transformResponse: (response: { data: fetchReqListRes }, meta, arg) => {
        return response.data;
      },
      providesTags(result) {
        if (!result) return [];
        let tagList: { type: 'Request'; id: number }[] = [];

        Object.entries(result).forEach(([dateStr, reqList]) => {
          reqList.forEach(reqObj => {
            tagList.push({ type: 'Request', id: reqObj.request_id });
          });
        });
        // tagList.push('Request');
        return tagList;
      },
    }),
    fetchReq: builder.query<Request, getReqArgs>({
      query: ({ request_id }) => ({
        url: `request/get-req?request_id=${encodeURIComponent(request_id)}`,
        method: 'GET',
      }),
      transformResponse(response: { data: Request }, meta, arg) {
        return response.data;
      },
      providesTags(result) {
        return [{ type: 'Request', id: result?.request_id }];
      },
    }),
    createReq: builder.mutation<CreateReqRes, CreateReqArgs>({
      query: payload => ({
        url: 'request/create-req',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Request' }],
    }),
    updateReq: builder.mutation<{ message: string }, UpdateReqArgs>({
      query: ({ request_id, ...payload }) => ({
        url: `request/update-req?request_id=${encodeURIComponent(request_id)}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags(result, error, arg, meta) {
        return [{ type: 'Request', id: arg.request_id }];
      },
    }),
  }),
});

export const {
  useFetchReqListQuery,
  useCreateReqMutation,
  useFetchReqQuery,
  useUpdateReqMutation,
} = requestApiSlice;
