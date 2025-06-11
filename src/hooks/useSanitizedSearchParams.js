/**
 * Copyright (C) 2020 European Spallation Source ERIC.
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

import queryStringParser from "query-string";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { ologApi } from "api/ologApi";

const supportedKeys = [
  "desc",
  "logbooks",
  "tags",
  "start",
  "end",
  "owner",
  "title",
  "level",
  "properties",
  "attachments",
  "query"
];

const options = {
  arrayFormat: "comma",
  sort: false,
  encode: false
};

const asArray = (obj) => {
  if (obj === null || obj === undefined) {
    return [];
  }
  return Array.isArray(obj) ? obj : [obj];
};

/**
 * Constructs a map of search parameters from the specified query string. Note that some filtering is
 * applied: unsupported key words are ignored.
 * @param {*} query
 * @returns
 */
export function queryStringToSearchParameters({
  queryString,
  availableTags = [],
  availableLogbooks = [],
  availableLevels = []
}) {
  let result = queryStringParser.parse(queryString, options);

  // Remove unsupported keys
  for (let key of Object.keys(result)) {
    if (!supportedKeys.includes(key)) {
      delete result[key];
    }
  }

  // populate tags and logbooks
  result.tags = availableTags.filter((it) =>
    asArray(result?.tags).includes(it.name)
  );
  result.logbooks = availableLogbooks.filter((it) =>
    asArray(result?.logbooks).includes(it.name)
  );
  result.level = availableLevels.filter((it) =>
    asArray(result?.level).includes(it.name)
  );

  // Return sanitized result
  return result;
}

/**
 * Constructs a query string from the search parameter map.
 */
export function searchParamsToQueryString({ searchParams }) {
  const copy = { ...searchParams };
  copy.tags = searchParams?.tags?.map((it) => it.name);
  copy.logbooks = searchParams?.logbooks?.map((it) => it.name);
  copy.level = searchParams?.level?.map((it) => it.name);

  return queryStringParser.stringify(copy, options);
}

export function withCacheBust(searchParams) {
  return {
    ...searchParams,
    cacheBust: uuidv4()
  };
}

export function withoutCacheBust(searchParams) {
  const copy = { ...searchParams };
  if (copy.cacheBust) {
    delete copy.cacheBust;
  }
  return copy;
}

export function withoutParams(searchParams) {
  const copy = { ...searchParams };
  if (copy.query) {
    delete copy.query;
  }
  delete copy.groupedReplies;
  delete copy.condensedEntries;
  return copy;
}

const useSanitizedSearchParams = () => {
  // todo: display toast on error to let user know tags or logbooks couldn't be fetched
  const { data: tags = [] } = ologApi.endpoints.getTags.useQuery();
  const { data: logbooks = [] } = ologApi.endpoints.getLogbooks.useQuery();
  const { data: levels = [] } = ologApi.endpoints.getLevels.useQuery();

  const toSearchParams = useCallback(
    (input) => {
      return queryStringToSearchParameters({
        queryString: input,
        availableTags: tags,
        availableLogbooks: logbooks,
        availableLevels: levels
      });
    },
    [tags, logbooks, levels]
  );

  const toQueryString = useCallback((input) => {
    return searchParamsToQueryString({ searchParams: input });
  }, []);

  return {
    toSearchParams,
    toQueryString
  };
};
export default useSanitizedSearchParams;
