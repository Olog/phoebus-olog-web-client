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

import { test, expect } from "vitest";
import {
  queryStringToSearchParameters,
  searchParamsToQueryString
} from "./useSanitizedSearchParams";

const buildTags = (names) => {
  return names.map((name) => ({
    name,
    state: "Active"
  }));
};

const buildLogbooks = (names) => {
  return names.map((name) => ({
    name,
    owner: "test owner",
    state: "Active"
  }));
};

test("search params to query string: string", () => {
  const searchParams = {
    foo: "bar",
    baz: "billy",
    tags: buildTags(["foo"]),
    logbooks: buildTags(["bar"])
  };

  let actual = searchParamsToQueryString({ searchParams });
  let expected = "foo=bar&baz=billy&tags=foo&logbooks=bar";
  expect(actual).toBe(expected);
});

test("search params to query string: list", () => {
  const searchParams = {
    foo: "bar",
    baz: ["billy", "bob", "cookie monster"],
    whoops: "oh well",
    tags: buildTags(["foo", "bar"]),
    logbooks: buildTags(["baz", "whee"])
  };

  let actual = searchParamsToQueryString({ searchParams });
  let expected =
    "foo=bar&baz=billy,bob,cookie monster&whoops=oh well&tags=foo,bar&logbooks=baz,whee";
  expect(actual).toBe(expected);
});

test("query string to search params: string", () => {
  const queryString = "tags=bar&logbooks=billy";
  const availableTags = buildTags(["bar"]);
  const availableLogbooks = buildLogbooks(["billy"]);

  let actual = queryStringToSearchParameters({
    queryString,
    availableTags,
    availableLogbooks
  });
  let expected = {
    tags: availableTags.filter((it) => it.name === "bar"),
    logbooks: availableLogbooks.filter((it) => it.name === "billy")
  };
  expect(actual).toEqual(expected);
});

test("query string to search params: list", () => {
  const queryString =
    "tags=bar&logbooks=billy,bob,cookie monster&level=oh well";
  const availableTags = buildTags(["bar"]);
  const availableLogbooks = buildLogbooks(["billy", "bob", "cookie monster"]);

  let actual = queryStringToSearchParameters({
    queryString,
    availableTags,
    availableLogbooks
  });
  let expected = {
    tags: availableTags.filter((it) => it.name === "bar"),
    logbooks: availableLogbooks.filter((it) =>
      ["billy", "bob", "cookie monster"].includes(it.name)
    ),
    level: "oh well"
  };
  expect(actual).toEqual(expected);
});

test("query string to search params: unsupported keywords are ignored", () => {
  const queryString = "fooey=bluey&level=oh well"; // note the unsupported param fooey

  let actual = queryStringToSearchParameters({ queryString });
  let expected = {
    level: "oh well",
    logbooks: [],
    tags: []
  };
  expect(actual).toEqual(expected);
});
