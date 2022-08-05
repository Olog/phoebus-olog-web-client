import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ologClientInfoHeader } from "../utils/utils";

// const ologServiceBaseUrl = process.env.REACT_APP_BASE_URL; // e.g. http://localhost:8080/Olog

export const ologApi = createApi({
    reducerPath: 'ologApi',
    baseQuery: fetchBaseQuery({baseUrl: process.env.REACT_APP_BASE_URL}),
    endpoints: builder => ({
        searchLogs: builder.query({
            query: ({searchParams, searchPageParams}) => ({
                url: '/logs/search',
                params: {...searchParams, ...searchPageParams},
                headers: {...ologClientInfoHeader()}
            })
        })
    })
});

export const { 
    useSearchLogsQuery
} = ologApi;