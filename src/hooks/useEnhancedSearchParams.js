import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import queryStringParser from "query-string";

const options = {
  arrayFormat: "comma",
  sort: false,
  encode: false,
  skipNull: true,
  types: {
    title: "string",
    desc: "string",
    level: "string[]",
    logbooks: "string[]",
    tags: "string[]"
  }
};

export function withoutParams(searchParams) {
  const copy = { ...searchParams };
  delete copy.groupedReplies;
  delete copy.condensedEntries;
  return copy;
}

const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

export const removeEmptyKeys = (params) => {
  const cleanedParams = {};

  Object.entries(withoutParams(params)).forEach(([key, value]) => {
    if (
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return;
    }

    if (typeof value === "string" && value.trim() === "") {
      return;
    }

    cleanedParams[key] = value;
  });

  return cleanedParams;
};

// `query` is free text, so it bypasses query-string: otherwise "," would parse
// to an array and "&" or "+" wouldn't survive the round trip.
export const toUrlSearchParams = (searchParams) => {
  const { query, ...rest } = removeEmptyKeys(searchParams);
  const urlParams = new URLSearchParams(
    queryStringParser.stringify(rest, options)
  );
  if (query) {
    urlParams.set("query", query);
  }
  return urlParams;
};

export const fromUrlSearchParams = (urlParams) => {
  const rest = new URLSearchParams(urlParams);
  rest.delete("query");
  const parsed = queryStringParser.parse(
    decodeURIComponent(rest.toString()),
    options
  );
  const query = urlParams.get("query");
  return query === null ? parsed : { ...parsed, query };
};

export const useEnhancedSearchParams = () => {
  const [params, setParams] = useSearchParams();

  const searchParams = useMemo(() => fromUrlSearchParams(params), [params]);

  const setSearchParams = useCallback(
    (newParams, navigateOptions) => {
      setParams(toUrlSearchParams(newParams), navigateOptions);
    },
    [setParams]
  );

  const isSearchActive = useMemo(() => {
    return !isEmptyObject(searchParams);
  }, [searchParams]);

  const hasQuery = !!searchParams.query?.trim();

  return {
    searchParams,
    setSearchParams,
    isSearchActive,
    hasQuery
  };
};
