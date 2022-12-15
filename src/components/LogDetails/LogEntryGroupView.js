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

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ologService from 'api/olog-service';
import { updateCurrentLogEntry } from 'features/currentLogEntryReducer';
import {getLogEntryGroupId, sortLogsDateCreated} from 'utils';
import GroupHeader from './GroupHeader';
 
 /**
 * Merged view of all log entries 
 */
const LogEntryGroupView = ({remarkable, currentLogEntry, logGroupRecords, setLogGroupRecords}) => {

    const dispatch = useDispatch();

    useEffect(() => {
        ologService.get(`/logs?properties=Log Entry Group.id.${getLogEntryGroupId(currentLogEntry.properties)}`)
        .then(res => {
            let sortedResult = sortLogsDateCreated(res.data, false);
            setLogGroupRecords(sortedResult);
        })
        .catch(e => console.error("Could not fetch logs by group", e));
    });

    const getContent = (source) => {
        return {__html: remarkable.render(source)};
    }

    const showLog = (log) => {
        dispatch(updateCurrentLogEntry(log));
    }

    const logGroupItems = logGroupRecords.map((row, index) => {
        return(
            <div key={index} style={{cursor: 'pointer'}}>
                <GroupHeader logEntry={row} showLog={showLog}/>
                <div style={{paddingTop: "5px", wordWrap: "break-word"}} className="olog-table"
                                dangerouslySetInnerHTML={getContent(row.source)}/>
            </div>
        );
    });

    return(
        <>
            {logGroupItems}
        </>
    );
    
}

export default LogEntryGroupView;
