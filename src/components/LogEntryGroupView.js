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

 import React, { Component } from 'react';
 import '../css/olog.css';
 import {getLogEntryGroupId, sortLogsDateCreated} from '../utils/utils';
 import GroupHeader from './GroupHeader';
 
 /**
 * Merged view of all log entries 
 */
class LogEntryGroupView extends Component{

    componentDidMount = () => {
        this.search();
    }

    getContent = (source) => {
        return {__html: this.props.remarkable.render(source)};
    }

    showLog = (log) => {
        this.props.setCurrentLogEntry(log);
    }

    search = () => {
        fetch(`${process.env.REACT_APP_BASE_URL}/logs?properties=Log Entry Group.id.` + getLogEntryGroupId(this.props.currentLogEntry.properties))
          .then(response => response.json())
          .then(data => {
            let sortedResult = sortLogsDateCreated(data, false);
            this.props.setLogGroupRecords(sortedResult);
          });
    }

    render(){

        var logGroupItems = this.props.logGroupRecords.map((row, index) => {
            return(
                <div key={index}>
                    <GroupHeader logEntry={row} showLog={this.showLog}/>
                    <div style={{paddingTop: "5px", wordWrap: "break-word"}} className="olog-table"
                                    dangerouslySetInnerHTML={this.getContent(row.source)}/>
                </div>
            );
        });
    
        return(
            <>
                {logGroupItems}
            </>
        );
    }
    
}

export default LogEntryGroupView;
