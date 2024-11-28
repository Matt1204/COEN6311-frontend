import { apiSlice } from './apiSlice';

export interface NurseShift {
  shift_id: number;
  request_id: number;
  nurse_id: number;
  hospital_id: number;
  shift_date: string;
  hospital_name: string;
  hospital_address: string;
  hospital_hotline: string;
  shift_type: string;
  hours_per_shift: number;
}

export interface FetchNurShiftListRes {
  [date: string]: NurseShift[];
}

interface FetchNurShiftListArgs {
  nurse_id: number;
  start_date: string;
  end_date: string;
}

export const nurScheduleApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchNurShiftList: builder.query<FetchNurShiftListRes, FetchNurShiftListArgs>({
      query: ({ nurse_id, start_date, end_date }) => ({
        url: `/nurse-schedule/get-shift-list?nurse_id=${encodeURIComponent(nurse_id)}&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`,
        method: 'GET',
      }),
      transformResponse(response: { data: FetchNurShiftListRes }, meta, arg) {
        return response.data;
      },
    }),
  }),
});

export const { useFetchNurShiftListQuery } = nurScheduleApiSlice;
