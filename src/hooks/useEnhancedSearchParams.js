import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import queryStringParser from "query-string";

const options = {
  arrayFormat: "comma",
  sort: false,
  encode: false,
  skipNull: true,
  types: {
    level: "string[]",
    logbooks: "string[]",
    tags: "string[]"
  }
};

export function withoutParams(searchParams) {
  const copy = { ...searchParams };
  delete copy.query;
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

export const useEnhancedSearchParams = () => {
  const [params, setParams] = useSearchParams();

  const toSearchParams = useCallback((searchParams) => {
    return queryStringParser.parse(searchParams, options);
  }, []);

  const toQueryString = useCallback((searchParams) => {
    return queryStringParser.stringify(searchParams, options);
  }, []);

  const searchParams = useMemo(() => {
    return queryStringParser.parse(params.toString(), options);
  }, [params]);

  const setSearchParams = useCallback(
    (newParams) => {
      setParams(toQueryString(removeEmptyKeys(newParams)));
    },
    [setParams, toQueryString]
  );

  const isSearchActive = useMemo(() => {
    return !isEmptyObject(searchParams);
  }, [searchParams]);

  return {
    searchParams,
    toSearchParams,
    toQueryString,
    setSearchParams,
    isSearchActive
  };
};
