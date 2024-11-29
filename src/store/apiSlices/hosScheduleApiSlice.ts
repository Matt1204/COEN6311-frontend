import { apiSlice } from './apiSlice';

export interface HospitalShift {
  hospital_id: number;
  hospital_name: string;
  hours_per_shift: number;
  request_id: number;
  min_seniority: number;
  actual_nurse_num: number;
  request_nurse_num: number;
  shift_type: string;
  shift_date: string;
  supervisor_email: string;
  supervisor_firstname: string;
  supervisor_id: number;
  supervisor_lastname: string;
}

export interface FetchHosShiftsRes {
  [date: string]: HospitalShift[];
}
interface FetchHosShiftsResArgs {
  hospital_id: number;
  start_date: string;
  end_date: string;
}

type FullHospitalShift = HospitalShift & {
  day_of_week: string;
  supervisor_phone_number: string | null;
  supervisor_address: string | null;
  hospital_address: string;
  hospital_hotline: string;
};

type ShiftNurseInfo = {
  nurse_id: number;
  nurse_email: string;
  nurse_firstname: string;
  nurse_lastname: string;
  nurse_seniority: number;
  request_id: number;
  nurse_address: string | null;
  nurse_birthday: string | null;
  nurse_phone_number: string | null;
};

export type FetchShiftInfoRes = {
  shift_info: FullHospitalShift;
  nurse_list: ShiftNurseInfo[];
};

export const hosScheduleApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    FetchHosShifts: builder.query<FetchHosShiftsRes, FetchHosShiftsResArgs>({
      query: ({ hospital_id, start_date, end_date }) => ({
        url: `hospital-schedule/get-shift-list?hospital_id=${encodeURIComponent(hospital_id)}&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`,
        method: 'GET',
      }),
      transformResponse: (response: { data: FetchHosShiftsRes }, meta, arg) => {
        return response.data;
      },
    }),
    fetchShiftInfo: builder.query<FetchShiftInfoRes, number>({
      query: request_id => ({
        url: `hospital-schedule/get-shift-info?request_id=${encodeURIComponent(request_id)}`,
        method: 'GET',
      }),
      transformResponse(response: { data: FetchShiftInfoRes }, meta, arg) {
        return response.data;
      },
    }),
  }),
});

export const { useFetchHosShiftsQuery, useFetchShiftInfoQuery } = hosScheduleApiSlice;
