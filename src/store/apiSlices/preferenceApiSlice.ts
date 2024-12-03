import { apiSlice } from './apiSlice';

interface Preference {
  submitted: boolean;
  nurse_id: number;
  start_date: string;
  end_date: string;
  hours_per_week: number;
  max_hours_per_shift: number;
  hospitals_ranking: number[];
  preferred_week_days: string[];
  time_of_day: string;
}

interface FetchPreferenceArgs {
  nurseId: number;
  startDate: string;
}

export interface updatePreferenceData {
  nurse_id: number;
  start_date: string;
  hospitals_ranking: number[] | null;
  hours_per_week: number | null;
  max_hours_per_shift: number | null;
  preferred_week_days: string[] | null;
  time_of_day: string | null;
}

interface updatePreferenceRes {
  msg: string;
}

interface CreatePreferenceRes {
  msg: string;
  nurse_id: number;
  start_date: string;
}

export interface CreatePreferenceData {
  nurse_id: number;
  start_date: string;
  end_date: string;
  hospitals_ranking: number[];
  hours_per_week: number;
  max_hours_per_shift: number;
  preferred_week_days: string[];
  time_of_day: string;
}

export const preferenceApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchPreference: builder.query<Preference, FetchPreferenceArgs>({
      query: ({ nurseId, startDate }) => ({
        url: `preference/get-preference?nurse_id=${encodeURIComponent(nurseId)}&start_date=${startDate}`,
        method: 'GET',
      }),
      transformResponse: (response: any, meta, arg) => {
        if (Object.keys(response.data).length === 0) {
          return {
            submitted: false,
            nurse_id: 0,
            hours_per_week: 0,
            max_hours_per_shift: 0,
            end_date: '',
            hospitals_ranking: [],
            preferred_week_days: [],
            start_date: '',
            time_of_day: '',
          };
        } else {
          // Transform and return data when present
          const data = response.data;
          return {
            submitted: true,
            nurse_id: data.nurse_id,
            hours_per_week: data.hours_per_week,
            max_hours_per_shift: data.max_hours_per_shift,
            end_date: data.end_date,
            hospitals_ranking: JSON.parse(data.hospitals_ranking || '[]'),
            preferred_week_days: JSON.parse(data.preferred_week_days || '[]'),
            start_date: data.start_date,
            time_of_day: data.time_of_day,
          };
        }
      },
      providesTags: (result, error, arg) => {
        return [{ type: 'Preference', id: arg.startDate }];
      },
    }),
    updatePreference: builder.mutation<updatePreferenceRes, updatePreferenceData>({
      query: ({ nurse_id, start_date, ...reqBody }) => ({
        url: `preference/update-preference?nurse_id=${encodeURIComponent(nurse_id)}&start_date=${start_date}`,
        method: 'PUT',
        body: reqBody,
      }),
      invalidatesTags: (result, error, args) => {
        return [{ type: 'Preference', id: args.start_date }];
      },
    }),
    createPreference: builder.mutation<CreatePreferenceRes, CreatePreferenceData>({
      query: data => ({
        url: 'preference/create-preference',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, args) => [{ type: 'Preference', id: args.start_date }],
    }),
  }),
});

export const { useFetchPreferenceQuery, useUpdatePreferenceMutation, useCreatePreferenceMutation } =
  preferenceApiSlice;
