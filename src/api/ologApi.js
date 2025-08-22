/**
 * Copyright (C) 2021 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useCallback } from "react";
import customization from "config/customization";

export function ologClientInfoHeader() {
  return {
    "X-Olog-Client-Info":
      "Olog Web " + customization.VERSION + " on " + window.navigator.userAgent
  };
}

/**
 * A wrapper around setTimeout that allows awaiting a delay.
 * @param {number} duration duration in milliseconds to delay.
 * @returns a resolvable Promise.
 */
const delay = (duration) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
};

const withRetry = async ({
  fcn,
  retries = 5,
  retryCondition = () => true,
  retryDelay = () => 30
}) => {
  let retryCount = 0;
  let shouldRetry = true;
  let res = null;
  while (shouldRetry) {
    if (retryCount >= retries) {
      throw new Error(`Retry condition not fulfilled after ${retries} retries`);
    }
    try {
      res = await fcn();
    } catch (e) {
      res = e;
    }
    if (retryCondition(res)) {
      shouldRetry = true;
    } else {
      shouldRetry = false;
    }
    retryCount++;
    await delay(retryDelay(retryCount));
  }
  return res;
};

export const ologApi = createApi({
  reducerPath: "ologApi",
  baseQuery: fetchBaseQuery({
    baseUrl: customization.APP_BASE_URL, // e.g. http://localhost:8080/Olog
    credentials: "include", // send credentials with requests
    headers: { ...ologClientInfoHeader() }
  }),
  keepUnusedDataFor: 0, // Don't cache anything
  endpoints: (builder) => ({
    searchLogs: builder.query({
      query: ({
        query,
        title,
        desc,
        properties,
        start,
        end,
        level,
        logbooks,
        tags,
        owner,
        attachments,
        from,
        size,
        sort
      }) => {
        return {
          url: "/logs/search",
          params: {
            query,
            title,
            desc,
            properties,
            start,
            end,
            level,
            logbooks,
            tags,
            owner,
            attachments,
            from,
            size,
            sort
          }
        };
      }
    }),
    getTags: builder.query({
      query: () => ({
        url: "/tags"
      })
    }),
    getLogbooks: builder.query({
      query: () => ({
        url: "/logbooks"
      })
    }),
    getArchivedLogbooks: builder.query({
      query: ({ id }) => ({
        url: `logs/archived/${id}`
      })
    }),
    getProperties: builder.query({
      query: () => ({
        url: "/properties"
      }),
      transformResponse: (res) => {
        return res?.filter((property) => property.name !== "Log Entry Group");
      }
    }),
    getLog: builder.query({
      query: ({ id }) => ({
        url: `/logs/${id}`
      })
    }),
    getLogGroup: builder.query({
      query: ({ groupId }) => ({
        url: `/logs?properties=Log Entry Group.id.${groupId}`
      })
    }),
    createLog: builder.mutation({
      query: ({ log, replyTo }) => {
        const bodyFormData = new FormData();

        // Append all files. Each is added with name "files", and that is actually OK
        if (log.attachments && log.attachments.length > 0) {
          for (let i = 0; i < log.attachments.length; i++) {
            bodyFormData.append(
              "files",
              log.attachments[i].file,
              log.attachments[i].file.name
            );
          }
        }
        // Log entry must be added as JSON blob, otherwise the content type cannot be set.
        bodyFormData.append(
          "logEntry",
          new Blob([JSON.stringify(log)], { type: "application/json" })
        );

        return {
          url: `/logs/multipart?markup=commonmark${replyTo ? `&inReplyTo=${replyTo}` : ""}`,
          method: "PUT",
          body: bodyFormData,
          formData: true
        };
      }
    }),
    editLog: builder.mutation({
      query: ({ log }) => ({
        url: `/logs/${log.id}?markup=commonmark`,
        method: "POST",
        body: log
      })
    }),
    getUser: builder.query({
      query: () => ({
        url: "/user"
      })
    }),
    login: builder.mutation({
      query: ({ username, password }) => {
        return {
          url: "/login",
          method: "POST",
          body: { username: username, password: password }
        };
      }
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "GET" // yes this is a GET...
      })
    }),
    getServerInfo: builder.query({
      query: () => ({
        url: "/"
      })
    }),
    getLevels: builder.query({
      query: () => ({
        url: "/levels"
      })
    })
  })
});

export const useVerifyLogExists = () => {
  // use the SEARCH endpoint because the problem isn't that the log isn't
  // available as a resource by id -- the problem is search can take too long
  // to index it, leading to incomplete entries appearing in search (/logs/search) but
  // looking fine when retrieved by id (/logs/{id}).
  const [searchLogs] = ologApi.endpoints.searchLogs.useLazyQuery();

  return useCallback(
    async ({ logRequest, logResult }) => {
      return withRetry({
        fcn: async () =>
          searchLogs({ title: `"${logResult.title}"`, end: "now" }).unwrap(),
        retries: 5,
        retryCondition: (retryRes) => {
          // Retry if the entry we created isn't in the search results yet
          // Or if it does show in search but the attachments haven't been associated to it yet
          // (the server sometimes responds with the entry but has an empty attachments field)
          const found = retryRes?.logs?.find(
            (it) => `${it.id}` === `${logResult.id}`
          );
          const hasAllAttachments =
            found?.attachments?.length === logRequest?.attachments?.length;
          const willRetry = !(found && hasAllAttachments);
          return willRetry;
        },
        retryDelay: (count) => count * 200
      });
    },
    [searchLogs]
  );
};
