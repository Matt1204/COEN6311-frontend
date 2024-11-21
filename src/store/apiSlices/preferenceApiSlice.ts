import { apiSlice } from './apiSlice';

interface Preference {
  nurse_id: number;
  hours_per_week: number;
  max_hours_per_shift: number;
  end_date: string;
  hospitals_ranking: number[];
  preferred_week_days: string[];
  start_date: string;
  time_of_day: string;
}

interface FetchPreferenceRes {
  data: Preference;
}

interface FetchPreferenceArgs {
  nurseId: number;
  startDate: string;
}

export const preferenceApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchPreference: builder.query<Preference, FetchPreferenceArgs>({
      query: ({ nurseId, startDate }) => ({
        url: `preference/get-preference?nurse_id=${encodeURIComponent(nurseId)}&start_date=${startDate}`,
        method: 'GET',
      }),
      transformResponse: (response: any, meta, arg) => {
        // Check if the data object is empty
        //   return response.data?.data;
        if (Object.keys(response.data).length === 0) {
          // Return an empty object when data is empty
          return {
            nurse_id: null,
            hours_per_week: null,
            max_hours_per_shift: null,
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
    }),
  }),
});

export const { useFetchPreferenceQuery } = preferenceApiSlice;
