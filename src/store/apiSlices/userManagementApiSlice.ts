import { apiSlice } from './apiSlice';
import { UserFilterType } from '../../views/admin/UserManagement/components/UserFilter';

export interface User {
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
  current_page?: number;
}

export const userManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchUserList: builder.query<FetchUserListRes, FetchUserListArgs>({
      query: ({ filter, page_size, current_page }) => {
        let url = `user-management/get-user-list`;

        const queryParams = new URLSearchParams();

        // Convert the filter Object => query parameters String
        const appliedFilter = Object.entries(filter).filter(
          ([_, value]) => value !== '' && value !== null
        );
        appliedFilter.forEach(([key, value]) => queryParams.append(key, String(value)));

        if (page_size && current_page) {
          queryParams.append('page_size', String(page_size));
          queryParams.append('current_page', String(current_page));
        }
        // console.log('queryParams ', queryParams);

        if (queryParams) {
          url = url + `?${queryParams}`;
        }

        // console.log('URL: ', url);

        return url;
      },
      transformResponse(res: { data: FetchUserListRes }, meta, arg) {
        return res.data;
      },
    }),
  }),
});

export const { useFetchUserListQuery, useLazyFetchUserListQuery } = userManagementApiSlice;
