import { apiSlice } from './apiSlice';

interface JSONPrefTemplate {
  template_id: number;
  template_name: string;
  max_hours_per_shift: number;
  hours_per_week: number;
  time_of_day: string;
  preferred_week_days: string;
  hospitals_ranking: string;
}
type JSONPrefTemplateList = JSONPrefTemplate[];

export interface PrefTemplate {
  template_id: number;
  template_name: string;
  max_hours_per_shift: number;
  hours_per_week: number;
  time_of_day: string;
  preferred_week_days: string[];
  hospitals_ranking: string[];
}
type PrefTemplateList = PrefTemplate[];

type SharedFetchPrefTemplateListRes = {
  // template_list: PrefTemplateList;
  page_count: number;
  current_page: number;
  page_size: number;
};
type FetchPrefTemplateListRes = SharedFetchPrefTemplateListRes & {
  template_list: PrefTemplateList;
};
type JSONFetchPrefTemplateListRes = SharedFetchPrefTemplateListRes & {
  template_list: JSONPrefTemplateList;
};

interface FetchPrefTemplateListArgs {
  nurse_id: number;
  current_page?: number;
  page_size?: number;
}

interface UpdatePrefTemplateRes {
  msg: string;
}

export interface UpdatePrefTemplateArgs {
  template_id: number;
  template_name?: string;
  max_hours_per_shift?: number;
  hours_per_week?: number;
  time_of_day?: string;
  preferred_week_days?: string[];
  hospitals_ranking?: string[];
}

interface CreatePrefTemplateRes {
  msg: string;
  template_name: string;
}

export type CreatePrefTemplateArgs = {
  nurse_id: number;
  template_name: string;
  max_hours_per_shift: number;
  hours_per_week: number;
  time_of_day: string;
  preferred_week_days: string[];
  hospitals_ranking: string[];
};

export const prefTemplateApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchPrefTemplateList: builder.query<FetchPrefTemplateListRes, FetchPrefTemplateListArgs>({
      query: ({ nurse_id, page_size, current_page }) => {
        let url = 'preference-template/get-template-list';

        const queryParams = new URLSearchParams();
        queryParams.append('nurse_id', String(nurse_id));

        if (page_size && current_page) {
          queryParams.append('page_size', String(page_size));
          queryParams.append('current_page', String(current_page));
        }
        url = url + `?${queryParams}`;
        return url;
      },
      transformResponse(res: { data: JSONFetchPrefTemplateListRes }, meta, arg) {
        let template_list = res.data.template_list;
        let parsedTemplateList = template_list.map(template => {
          return {
            ...template,
            preferred_week_days: JSON.parse(template.preferred_week_days || '[]'),
            hospitals_ranking: JSON.parse(template.hospitals_ranking || '[]'),
          };
        });
        return { ...res.data, template_list: parsedTemplateList };
      },
      providesTags(res) {
        if (!res || !res.template_list) return [];

        let tagList: { type: 'PrefTemplate'; id: number }[] = [];
        res.template_list.forEach(templateObj => {
          tagList.push({ type: 'PrefTemplate', id: templateObj.template_id });
        });
        return tagList;
      },
    }),
    updatePrefTemplate: builder.mutation<UpdatePrefTemplateRes, UpdatePrefTemplateArgs>({
      query: ({ template_id, ...payload }) => ({
        url: `preference-template/update-template?template_id=${encodeURIComponent(template_id)}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags(result, error, args, meta) {
        return [{ type: 'PrefTemplate', id: args.template_id }];
      },
    }),
    createPrefTemplate: builder.mutation<CreatePrefTemplateRes, CreatePrefTemplateArgs>({
      query: payload => ({
        url: `preference-template/create-template`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'PrefTemplate' }],
    }),
  }),
});
export const {
  useFetchPrefTemplateListQuery,
  useUpdatePrefTemplateMutation,
  useCreatePrefTemplateMutation,
} = prefTemplateApiSlice;
