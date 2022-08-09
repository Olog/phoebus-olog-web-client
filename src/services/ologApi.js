import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ologClientInfoHeader } from "../utils/utils";

export const ologApi = createApi({
    reducerPath: 'ologApi',
    baseQuery: fetchBaseQuery({baseUrl: process.env.REACT_APP_BASE_URL}), // e.g. http://localhost:8080/Olog
    endpoints: builder => ({
        searchLogs: builder.query({
            query: ({searchParams, searchPageParams}) => ({
                url: '/logs/search',
                params: {...searchParams, ...searchPageParams},
                headers: {...ologClientInfoHeader()}
            })
        }),
        getTags: builder.query({
            query: () => ({
                url: '/tags',
                method: 'GET'
            })
        }),
        getLogbooks: builder.query({
            query: () => ({
                url: '/logbooks',
                method: 'GET'
            })
        })
    })
});

export const { 
    useSearchLogsQuery,
    useGetTagsQuery,
    useGetLogbooksQuery
} = ologApi;