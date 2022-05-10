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