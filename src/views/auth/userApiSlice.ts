import { apiSlice } from '../../store/apiSlice';

interface User {
  data: {
    email: string;
    first_name: string;
    last_name: string;
    address: string | null;
    birthday: string | null;
    phone_number: string | null;
    hospital_id: string | null;
    seniority: string | null;
  };
}

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchUser: builder.query<User, string>({
      query: email => ({
        url: `get-user?email=${encodeURIComponent(email)}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useFetchUserQuery } = userApiSlice;
