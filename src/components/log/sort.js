/**
 * Sorts log entries based on created date.
 * input array to be sorted when this method returns.
 * @param {*} logs, list of log entries
 * @param {*} descending, true if sort order should be descending, otherwise false
 */
export function sortLogsDateCreated(logs, descending){
    if(descending){
        return logs.sort((a, b) => b.createdDate - a.createdDate);
    }
    else{
        return logs.sort((a, b) => a.createdDate - b.createdDate);
    }
}