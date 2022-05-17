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

import queryString from 'query-string';

const supportedKeys = ["desc", "logbooks", "tags", "start", "end", "owner", "title", "level", "properties", "attachments", "text"];

const options = {
    arrayFormat: "comma",
    sort: false,
    encode: false
}

/**
 * Constructs a map of search parameters from the specified query string. Note that some filtering is
 * applied: unsupported key words are ignored.
 * @param {*} query 
 * @returns 
 */
 export function queryStringToSearchParameters(query) {
    
    let result = queryString.parse(query, options);
    for(let key of Object.keys(result)) {
        if(!supportedKeys.includes(key)) {
            delete result[key];
        }
    }

    return result;

}

/**
 * Constructs a query string from the search parameter map.
 */
export function searchParamsToQueryString(map){
    return queryString.stringify(map, options);
}