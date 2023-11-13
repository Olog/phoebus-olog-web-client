import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { withoutCacheBust } from "hooks/useSanitizedSearchParams";
import customization from "config/customization";
import packageInfo from '../../package.json';

export function ologClientInfoHeader() {
    return {"X-Olog-Client-Info": "Olog Web " + packageInfo.version + " on " + window.navigator.userAgent}
}

export const removeEmptyKeys = (obj, exceptions=[]) => {
    const copy = {...obj};
    for(let key of Object.keys(copy).filter(it => exceptions.indexOf(it) === -1)) {
        const val = copy[key];
        if(Array.isArray(val) && val.length === 0) {
            delete copy[key];
            continue;
        }
        if(typeof val === 'string' || val instanceof String) {
            if(val.trim() === '') {
                delete copy[key]
            }
        }
    }
    return copy;
}

export const ologApi = createApi({
    reducerPath: 'ologApi',
    baseQuery: fetchBaseQuery({
        baseUrl: customization.APP_BASE_URL,    // e.g. http://localhost:8080/Olog
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