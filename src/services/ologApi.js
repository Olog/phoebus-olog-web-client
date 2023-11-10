import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ologClientInfoHeader } from "utils";
import { withoutCacheBust } from "utils/searchParams";

export const ologApi = createApi({
    reducerPath: 'ologApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BASE_URL,    // e.g. http://localhost:8080/Olog
        credentials: "include"                      // send credentials with requests
    }),
    keepUnusedDataFor: 0, // Don't cache anything
    endpoints: builder => ({
        searchLogs: builder.query({
            query: ({searchParams, searchPageParams}) => {
                return {
                    url: '/logs/search',
                    params: { 
                        // remove cache bust so we don't send it to the server
                        // we must do it *here* rather than where useSearchLogsQuery
                        // is called because we want repeated searches of the same
                        // search to trigger calling the api (e.g. polling)
                        ...withoutCacheBust(searchParams), 
                        ...searchPageParams
                    },
                    headers: {...ologClientInfoHeader()}
                }
            }
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
        }),
        getLogbook: builder.query({
            query: ({id}) => ({
                url: `/logs/${id}`
            })
        }),
        getUser: builder.query({
            query: () => ({
                url: "/user"
            })
        })
    })
});

export const { 
    useSearchLogsQuery,
    useGetTagsQuery,
    useGetLogbooksQuery,
    useGetPropertiesQuery,
    useGetLogbookQuery,
    useGetUserQuery
} = ologApi;