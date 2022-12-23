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
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
`

const GroupContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    cursor: pointer;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.20); 
    }
`

const Content = styled.div`
    word-wrap: break-word;
`

 /**
 * Merged view of all log entries 
 */
const LogEntryGroupView = ({remarkable, currentLogEntry, logGroupRecords, setLogGroupRecords, className}) => {

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
            <GroupContainer key={index} onClick={() => showLog(row)} >
                <GroupHeader logEntry={row} />
                <Content dangerouslySetInnerHTML={getContent(row.source)}/>
            </GroupContainer>
        );
    });

    return(
        <Container className={className}>
            {logGroupItems}
        </Container>
    );
    
}

export default LogEntryGroupView;
