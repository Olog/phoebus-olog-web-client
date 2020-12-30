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
     if(!logbooks || logbooks.length === 0){
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
    if(!tags || tags.length === 0){
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

function getTitleSearchString(searchCriteria){
     if(searchCriteria.title && searchCriteria.title !== ""){
         return "&title=" + searchCriteria.title;
     }
     return "";
}

function getTextSearchString(searchCriteria){
    if(searchCriteria.text && searchCriteria.text !== ""){
        return "&desc=" + searchCriteria.text;
    }
    return "";
}

function getLevelSearchString(searchCriteria){
    if(searchCriteria.level && searchCriteria.level !== ""){
        return "&level=" + searchCriteria.level;
    }
    return "";
}

function getAuthorSearchString(searchCriteria){
    if(searchCriteria.owner && searchCriteria.owner !== ""){
        return "&owner=" + searchCriteria.owner;
    }
    return "";
}

function getTimeRangeString(searchCriteria){
    return "&start=" + moment(searchCriteria.startDate).format(dateTimeFormat) +
        "&end=" + moment(searchCriteria.endDate).format(dateTimeFormat)
}

export function getSearchString(searchCriteria){
    return constructLogbooksString(searchCriteria.logbooks) 
        + constructTagsString(searchCriteria.tags)
        + getTimeRangeString(searchCriteria)
        + getTitleSearchString(searchCriteria)
        + getTextSearchString(searchCriteria)
        + getLevelSearchString(searchCriteria)
        + getAuthorSearchString(searchCriteria);
}

/**
 * Extracts the elements of a commonmark string like ![whatever](http://image.png){width=100 height=100}
 * where {width=100 height=100} is optional and a non-standard extension supported by commonmark-java. The
 * purpose is to be able to construct a <img> tag and set inline width and height attributes.
 * @param {string} rawImageMarkup 
 */

/**
 * This is essentially a "remarkable" plugin processing image objects
 */
/*
export default md => {
    md.renderer.render = (tokens, options, env) => {
        let str = '';
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].type === 'inline') {
                let split = matchImage(tokens[i].content);
                if(split && split[0]){
                    str += '<img src="' + split[2] + '"';
                    if(split[1]){
                        str += ' alt="' + split[1] + '"';
                    }
                    if(!split[3]){
                        str += '>';
                    }
                    else if(split[4]){
                        str += ' ' + split[4] + '>';
                    }
                }
                else{
                    const content = tokens[i].content
                    str += (content || '')
                }
            } else {
                const content = tokens[i].content
                str += (content || '')
            }
        }
        console.log(str);
        return str;
    }
}


export default md => {
    md.renderer.render = (tokens, options, env) => {
        let str = ''
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].type === 'inline') {
                str += md.renderer.render(tokens[i].children, options, env);
            } else {
                // console.log('content', tokens[i])
                const content = tokens[i].content
                str += (content || '')
            }
        }
        return str
    }
}
*/


