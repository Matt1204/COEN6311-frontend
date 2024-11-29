import { apiSlice } from './apiSlice';
import { UserFilterType } from '../../views/admin/UserManagement/components/UserFilter';

interface User {
  address: string;
  birthday: string;
  email: string;
  first_name: string;
  last_name: string;
  hospital_id: number | null;
  phone_number: string | null;
  role: string;
  seniority: number | null;
  u_id: number;
}

interface FetchUserListRes {
  current_page: number;
  page_size: number;
  total_page_num: number;
  total_user_count: number;
  user_list: User[];
}

interface FetchUserListArgs {
  filter: UserFilterType;
  page_size?: number;
  currect_page?: number;
}

export const userManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchUserList: builder.query<FetchUserListRes, FetchUserListArgs>({
      query: ({ filter, page_size, currect_page }) => {
        let url = `user-management/get-user-list`;
        if (page_size && currect_page) {
          url += `?page_size=${encodeURIComponent(page_size)}&current_page=${encodeURIComponent(currect_page)}`;
        }

        // Convert the filter object into query parameters
        const appliedFilter = Object.entries(filter).filter(
          ([_, value]) => value !== '' && value !== null
        );
        const queryParams = new URLSearchParams(
          appliedFilter.map(([key, value]) => [key, String(value ?? '')]) // Convert values to strings
        ).toString();
        if (queryParams) {
          url = url + `&${queryParams}`;
        }

        console.log('URL: ', url);

        return url;
      },
      transformResponse(res: { data: FetchUserListRes }, meta, arg) {
        return res.data;
      },
    }),
  }),
});

export const { useFetchUserListQuery, useLazyFetchUserListQuery } = userManagementApiSlice;
