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

/**
 * Simple wrapper class holding data to describe a tree item: one parent log entry
 * plus optionally an array of child log entries. Only one level of depth is supported,
 * i.e. child items cannot be parent items holding an additional level of child items.
 */
import {getLogEntryGroupId} from './utils';

class TreeItem {
    constructor(){
        this.logEntries = [];
    }

    getLogGroupId(){
        if(!this.logEntries || this.logEntries.length === 0){
            return null;
        }
        return getLogEntryGroupId(this.logEntries[0].properties);
    }

    /**
     * Adds a new log entry. In order to guarantee that parent log entry is
     * always the oldest, the array of log entires is sorted once the new element
     * has been added.
     * 
     * Log entries will  be silently ignored when:
     * 1) The new log entry defines a different log group id than the one already
     * defined implicitly in this object.
     * 2) The new log entry does not define a log group id, but this object does.
     * 3) The new log entry defines a log group id, but this object does not. This will
     * ensure that log entries not defining a log group id will be put in a TreeItem 
     * that cannot hold child items.
     * @param {*} logEntry 
     * @returns 
     */
    addLogEntry(logEntry, sortAscending){
        let newGroupId = getLogEntryGroupId(logEntry.properties);
        let existingGroupId = this.getLogGroupId();
        // A group id is defined, so new entry must define same group id.
        if(existingGroupId && newGroupId && existingGroupId !== newGroupId){
            return;
        }
        // A group id is defined, so new entry must also define one
        else if(existingGroupId && !newGroupId){
            return;
        }
        // A group id is not defined, so new entry may not define one, i.e.
        // a TreeItem may contain child elements if the parent does
        // not define a group id.
        else if(this.logEntries.length > 0 && !existingGroupId && newGroupId){
            return;
        }
        // Check that the new entry is not a duplicate.
        for(var i = 0; i < this.logEntries.length; i++){
            if(this.logEntries[i].id === logEntry.id){
                return;
            }
        }
        this.logEntries.push(logEntry);
        if(sortAscending){
            this.logEntries.sort((a, b) => a.createdDate - b.createdDate);
        }
        else{
            this.logEntries.sort((a, b) => b.createdDate - a.createdDate);
        }
    }

    getParent(){
        if(!this.logEntries || this.logEntries.length === 0){
            return null;
        }
        return this.logEntries[0];
    }

    getChildItems(){
        if(!this.logEntries || this.logEntries.length === 0){
            return null;
        }
        let copy = [...this.logEntries];
        let subArray = [];
        for(var i = 1; i < copy.length; i++){
            subArray.push(copy[i]);
        }
        return subArray;
    }
}

export default TreeItem;