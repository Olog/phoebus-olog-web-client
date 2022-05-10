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
import {formatShortDate, 
    sortSearchResultByDay, 
    removeImageMarkup, 
    getLogEntryGroupId, 
    sortLogsDateCreated,
    setSearchParam,
    removeSearchParam,
    dateToString} from './utils';
import { queryStringToSearchParameters, searchParamsToQueryString } from './searchParams';
import moment from 'moment';

test('sortSearchResultByDay', () => {
    let searchResult = [];

    let date1 = moment().toDate();
    searchResult.push({createdDate: date1});
    searchResult.push({createdDate: date1});

    let date2 = moment().subtract(2, 'days').toDate();
    searchResult.push({createdDate: date2});
    searchResult.push({createdDate: date2});
    searchResult.push({createdDate: date2});

    let date3 = moment().subtract(2, 'weeks').toDate();
    searchResult.push({createdDate: date3});

    let result = sortSearchResultByDay(searchResult);
    expect(result).toBeDefined();
    expect(result[formatShortDate(date1)].length).toBe(2);
    expect(result[formatShortDate(date2)].length).toBe(3);
    expect(result[formatShortDate(date3)].length).toBe(1);
});

test('sortSearchResultByDayUnsortedResult', () => {
    let searchResult = [];

    let date1 = moment().subtract(2, 'weeks').toDate();
    searchResult.push({createdDate: date1});
    searchResult.push({createdDate: date1});

    let date2 = moment().toDate();
    searchResult.push({createdDate: date2});
    searchResult.push({createdDate: date2});
    searchResult.push({createdDate: date2});

    let date3 = moment().subtract(2, 'days').toDate();
    searchResult.push({createdDate: date3});

    let result = sortSearchResultByDay(searchResult);
    expect(result).toBeDefined();
    let previousDate = null;
    // Check that result array is sorted on date (descending).
    Object.entries(result).forEach(([key, value]) => {
        if(!previousDate){
            previousDate = moment(key, 'YYYY-MM-DD');
            return;
        }
        let nextDate = moment(key, 'YYYY-MM-DD');
        expect(nextDate.isBefore(previousDate)).toBeTruthy();
        previousDate = nextDate;
    });
});

test('sortSearchByDayNoResult', () => {
    let searchResult = [];
    let result = sortSearchResultByDay(searchResult);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);

    result = sortSearchResultByDay(null);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
});

test('removeImageMarkupNoOtherContent', () => {
    let markup = "![](attachment/123456789){width=100 height=100}";
    let result = removeImageMarkup(markup, "123456789");
    expect(result).toBe("");
});

test('removeImageMarkupWithOtherContent', () => {
    let markup = "ABC ![](attachment/123456789){width=100 height=100} DEF";
    let result = removeImageMarkup(markup, "123456789");
    expect(result).toBe("ABC  DEF");
});

test('removeImageMarkupMultipleEmbeddedImages', () => {
    let markup = "![](attachment/ABCDE){width=100 height=100}\n![](attachment/123456789){width=100 height=100}\n![](attachment/abcde){width=100 height=100}";
    let result = removeImageMarkup(markup, "123456789");
    expect(result).toBe("![](attachment/ABCDE){width=100 height=100}\n\n![](attachment/abcde){width=100 height=100}");
});

test('removeImageMarkupNonMatchingImageMarkup', () => {
    let markup = "![](attachment/123456789){width=100 height=100}";
    let result = removeImageMarkup(markup, "abcde");
    expect(result).toBe("![](attachment/123456789){width=100 height=100}");
});

test('removeImageMarkupNoImageMarkup', () => {
    let markup = "whatever";
    let result = removeImageMarkup(markup, "123456789");
    expect(result).toBe("whatever");
});

test('getLogEntryGroup', () => {
    let logEntry = {
        properties: [
            {"name" : "Log Entry Group", "attributes" : [{"name" : "id", "value" : "myLogEntryGroupId"}]}
        ]
    }
    let result = getLogEntryGroupId(logEntry.properties);
    expect(result).toBe("myLogEntryGroupId");
});

test('getLogEntryGroupNoMatch', () => {
    let logEntry = {
        properties: [
            {"name" : "not a log entry group", "attributes" : [{"name" : "id", "value" : "myLogEntryGroupId"}]}
        ]
    }
    let result = getLogEntryGroupId(logEntry.properties);
    expect(result).toBeNull();

    logEntry = {
        properties: [
            {"name" : "Log Entry Group", "attributes" : [{"name" : "not an id", "value" : "myLogEntryGroupId"}]}
        ]
    }
    result = getLogEntryGroupId(logEntry.properties);
    expect(result).toBeNull();
});

test('sortLogsDateCreatedDescending', () => {
    let searchResult = [];
    let date1 = moment().toDate();
    searchResult.push({id: '1', createdDate: date1});
    let date2 = moment().subtract(2, 'days').toDate();
    searchResult.push({id: '2', createdDate: date2});
   
    let result = sortLogsDateCreated(searchResult, true);
    expect(result[0].id).toBe('1');
    expect(result.length).toBe(2);
});

test('sortLogsDateCreatedAscending', () => {
    let searchResult = [];
    let date1 = moment().toDate();
    searchResult.push({id: '1', createdDate: date1});
    let date2 = moment().subtract(2, 'days').toDate();
    searchResult.push({id: '2', createdDate: date2});
   
    let result = sortLogsDateCreated(searchResult, false);
    expect(result[0].id).toBe('2');
    expect(result.length).toBe(2);
});


test('getLogEntryGroupMissing', () => {
    let logEntry = {
        properties: [
            {name : "Not Log Entry Group", attributes : [{"name" : "id", "value" : "myLogEntryGroupId"}]}
        ]
    }
    let result = getLogEntryGroupId(logEntry.properties);
    expect(result).toBeNull();

    logEntry = {
        properties: [
            {name : "Log Entry Group"}
        ]
    }
    result = getLogEntryGroupId(logEntry.properties);
    expect(result).toBeNull();

    logEntry = {
        properties: [
            {name : "Log Entry Group", attributes : []}
        ]
    }
    result = getLogEntryGroupId(logEntry.properties);
    expect(result).toBeNull();

    logEntry = {
        properties: [
            {name : "Log Entry Group", attributes : [{name : "not id", value : "myLogEntryGroupId"}]}
        ]
    }
    result = getLogEntryGroupId(logEntry.properties);
    expect(result).toBeNull();
});

test('queryStringToSearchParameters', () => {
    let query = "start=b&end=D&foo=bar";
    let map = queryStringToSearchParameters(query);

    expect(map['start']).toBe('b');
    // Unsupported query params should be undefined
    expect(map['foo']).toBeUndefined();
});

test('setSearchParam', () => {
    let map = [];
    map['a'] = 'A';

    map = setSearchParam(map, 'sort', 'up');
    let query = searchParamsToQueryString(map);
    expect(query).toBe('a=A&sort=up');

    map = [];
    map['a'] = 'A';
    map['sort'] = 'up';

    map = setSearchParam(map, 'sort', 'down');
    query = searchParamsToQueryString(map);
    expect(query).toBe('a=A&sort=down');
});

test('removeSearchParam', () => {
    let map = [];
    map['a'] = 'A';
    map['sort'] = 'up';

    map = removeSearchParam(map, 'sort');
    let query = searchParamsToQueryString(map);
    expect(query).toBe('a=A');
});

test('dateToString', () => {
    let now = new Date();
    let string = dateToString(now);
    expect(string.length).toBe(19);
})