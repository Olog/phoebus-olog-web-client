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

const options = {
  arrayFormat: "comma",
  sort: false,
  encode: false
};

const valuesToArray = (obj) => {
  const copy = { ...obj };
  for (const key in copy) {
    if (!Array.isArray(copy[key])) {
      copy[key] = [copy[key]];
    }
  }
  return copy;
};

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
  const toSearchParams = useCallback((input) => {
    const parsedParams = queryStringParser.parse(input, options);
    const transformedParams = valuesToArray(parsedParams);
    return transformedParams;
  }, []);

  const toQueryString = useCallback((searchParams) => {
    return queryStringParser.stringify(searchParams, options);
  }, []);

  return {
    toSearchParams,
    toQueryString
  };
};
export default useSanitizedSearchParams;
