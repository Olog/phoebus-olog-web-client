import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ologClientInfoHeader } from "utils";

export const ologApi = createApi({
    reducerPath: 'ologApi',
    baseQuery: fetchBaseQuery({baseUrl: process.env.REACT_APP_BASE_URL}), // e.g. http://localhost:8080/Olog
    keepUnusedDataFor: 0, // Don't cache anything
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
                url: '/tags'
            })
        }),
        getLogbooks: builder.query({
            query: () => ({
                url: '/logbooks'
            })
        }),
        getProperties: builder.query({
            query: () => ({
                url: '/properties'
            })
        })
    })
});

export const { 
    useSearchLogsQuery,
    useGetTagsQuery,
    useGetLogbooksQuery,
    useGetPropertiesQuery
} = ologApi;