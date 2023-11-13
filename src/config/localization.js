/**
 * Copyright (C) 2019 European Spallation Source ERIC.
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
import moment from 'moment';
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers';

const shortTimeFormat = 'HH:mm';
const shortDateFormat = 'YYYY-MM-DD';
const fullDateTime = 'YYYY-MM-DD HH:mm:ss';

export { moment };

export function formatShortTime(date){
    return moment(date).format(shortTimeFormat);
}

export function formatShortDate(date){
    return moment(date).format(shortDateFormat);
}

export function formatFullDateTime(date){
    return moment(date).format(fullDateTime);
}

/**
 * Converts a JavaScript Date object to a string on format yyyy-MM-dd HH:mm:ss.
 */
export function dateToString(value){
    return value.getFullYear() + '-' + ('0' + (value.getMonth() + 1)).slice(-2) + '-' +
           ("0" + value.getDate()).slice(-2) + ' ' + ('0' + value.getHours()).slice(-2) +
           ':' + ('0' + value.getMinutes()).slice(-2) + ':' +
           ('0' + value.getSeconds()).slice(-2);
}

export const LocalizationProvider = ({children, ...props}) => {

    return (
        <MuiLocalizationProvider dateAdapter={AdapterMoment} {...props} >
            {children}
        </MuiLocalizationProvider>
    )
}