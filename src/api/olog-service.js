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

const ologServiceBaseUrl = process.env.REACT_APP_BASE_URL; // e.g. http://localhost:8080/Olog

// Need axios for back-end access as the "fetch" API does not support CORS cookies.
const ologService = axios.create({
    baseURL: ologServiceBaseUrl
});

export function checkSession () {
    // Try to get user data from back-end.
    // If server returns user data with non-null userName, there is a valid session.
    return ologService.get('/user', { withCredentials: true })
            .then(res => {return res.data})
            .catch(err => alert("Unable to check login session: " + err));
}

export default ologService;