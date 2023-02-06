/**
 * Copyright (C) 2021 European Spallation Source ERIC.
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

import axios from "axios";
import { APP_BASE_URL } from "constants";

// Need axios for back-end access as the "fetch" API does not support CORS cookies.
const ologService = axios.create({
    baseURL: APP_BASE_URL
});

/**
 * A wrapper around setTimeout that allows awaiting a delay.
 * @param {number} duration duration in milliseconds to delay.
 * @returns a resolvable Promise.
 */
const delay = (duration) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration)
    })
}

/**
 * Perform an Olog Service request with a retry policy
 * @param {string} method           HTTP request method.
 * @param {string} path             Request path.
 * @param {string} options          axios request options.
 * @param {number} retries          number of maximum retries.
 * @param {function} retryCondition Function taking the current response and returning true if the call should be retried.
 * @param {function} retryDelay     Function taking the current retry count and returning the milliseconds to delay the retry.
 * @returns HTTP response that does not match the retry condition 
 */
export const ologServiceWithRetry = async ({method, path, options, retries=5, retryCondition = () => true, retryDelay = (count) => 30}) => {

    let retryCount = 0;
    let shouldRetry = true;
    let res = null;
    while(shouldRetry && retryCount < retries) { 
        try {
            res = await ologService.request({method, url: path, ...options});
        } catch (e) {
            res = e;
        }
        if(retryCondition(res)) {
            shouldRetry = true;
        } else {
            shouldRetry = false;
        }
        retryCount++;
        await delay(retryDelay(retryCount));
    }
    return res;
}

export function checkSession () {
    // Try to get user data from back-end.
    // If server returns user data with non-null userName, there is a valid session.
    return ologService.get('/user', { withCredentials: true })
            .then(res => {return res.data})
            .catch(err => alert("Unable to check login session: " + err));
}

export default ologService;