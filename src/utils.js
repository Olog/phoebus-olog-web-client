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
import moment from 'moment';

 const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss.SSS';

 function constructLogbooksString(logbooks){ 
     if(logbooks.length === 0){
         return "";
     }
     var logbooksString = "logbooks=";
     for(var i = 0; i < logbooks.length - 1; i++){
         logbooksString += logbooks[i];
         logbooksString += ",";
     }
     logbooksString += logbooks[logbooks.length - 1];
     return logbooksString;
 }

 function constructTagsString(tags){ 
    if(tags.length === 0){
        return "";
    }
    var tagsString = "&tags=";
    for(var i = 0; i < tags.length - 1; i++){
        tagsString += tags[i];
        tagsString += ",";
    }
    tagsString += tags[tags.length - 1];
    return tagsString;
}

function constructTimeSpanString(timeSpan){
    switch(timeSpan){
        case 1:
            return moment().subtract(1, 'minutes').format(dateTimeFormat);
        case 2:
            return moment().subtract(1, 'hours').format(dateTimeFormat);
        case 3:
        default:
            return moment().subtract(1, 'days').format(dateTimeFormat);
        case 4:
            return moment().subtract(1, 'weeks').format(dateTimeFormat);
    }
}

 export function getSearchString(searchCriteria){
    return constructLogbooksString(searchCriteria.logbooks) 
        + constructTagsString(searchCriteria.tags)
        + "&start=" + constructTimeSpanString(searchCriteria.timeSpan)
        + "&end=" + moment().format(dateTimeFormat);
 }