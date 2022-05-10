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

import {queryStringToSearchParameters, searchParamsToQueryString} from './searchParams';

test('search params to query string: string', () => {
    
    const searchParams = {
        "foo": "bar",
        "baz": "billy"
    }

    let actual = searchParamsToQueryString(searchParams);
    let expected = "foo=bar&baz=billy";
    expect(actual).toBe(expected);

});

test('search params to query string: list', () => {
    
    const searchParams = {
        "foo": "bar",
        "baz": ["billy", "bob", "cookie monster"],
        "whoops": "oh well"
    }

    let actual = searchParamsToQueryString(searchParams);
    let expected = "foo=bar&baz=billy,bob,cookie monster&whoops=oh well";
    expect(actual).toBe(expected);

});

test('query string to search params: string', () => {
    
    const searchParamsString = "tags=bar&logbooks=billy";

    let actual = queryStringToSearchParameters(searchParamsString);
    let expected = {
        "tags": "bar",
        "logbooks": "billy"
    };
    expect(actual).toEqual(expected);

});

test('query string to search params: list', () => {

    const searchParamsString = "tags=bar&logbooks=billy,bob,cookie monster&level=oh well";

    let actual = queryStringToSearchParameters(searchParamsString);
    let expected = {
        "tags": "bar",
        "logbooks": ["billy", "bob", "cookie monster"],
        "level": "oh well"
    };
    expect(actual).toEqual(expected);

});

test('query string to search params: unsupported keywords are ignored', () => {

    const searchParamsString = "tags=bar&logbooks=billy&fooey=bluey&level=oh well"; // note the unsupported param fooey

    let actual = queryStringToSearchParameters(searchParamsString);
    let expected = {
        "tags": "bar",
        "logbooks": "billy",
        "level": "oh well"
    };
    expect(actual).toEqual(expected);

});