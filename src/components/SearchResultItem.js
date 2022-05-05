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
import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import { FaPaperclip } from "react-icons/fa";
import '../css/olog.css';
import { formatFullDateTime, getLogEntryGroupId } from '../utils/utils';

class SearchResultItem extends Component{

    formatDescription = (description) => {
        let length = 75;
        if(!description){
            return "";
        }
        let ellipsis = description.length > length ? "..." : "";
        return description.substring(0, length) + ellipsis;
    }

    render(){
        return(
            <div className={`${getLogEntryGroupId(this.props.log.properties) !== null ? "grouped-item" : ""}`}>
            {this.props.log ? 
            <div className={`${this.props.selectedLogEntryId === this.props.log.id ? "list-item selected-log-entry" : "list-item"}`}>
                <Table size="sm" onClick={() => this.props.setCurrentLogEntry(this.props.log)}>
                    <tbody>
                        <tr>
                            <td style={{fontSize: "18px", fontWeight: "200"}}>{this.props.log.title}</td>
                            <td style={{textAlign: "right"}}>{this.props.log.attachments && this.props.log.attachments.length  !== 0 ? <FaPaperclip/> : ""}</td>
                        </tr>
                        <tr>
                            <td>{this.props.log.owner}</td><td style={{textAlign: "right"}}>
                                {formatFullDateTime(this.props.log.createdDate)}</td>
                        </tr>
                        <tr>
                            <td>{this.formatDescription(this.props.log.description)}</td>
                            <td style={{textAlign: "right"}}>{this.props.log.id}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            : ""}
            </div>
        )
    }
}

export default SearchResultItem;