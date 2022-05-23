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
import Table from 'react-bootstrap/Table';
import { FaPaperclip } from "react-icons/fa";
import '../../css/olog.css';
import { formatFullDateTime, getLogEntryGroupId } from '../../utils/utils';

const SearchResultItem = ({log, currentLogEntry, setCurrentLogEntry}) => {

    const formatDescription = (description) => {
        let length = 75;
        if(!description){
            return "";
        }
        let ellipsis = description.length > length ? "..." : "";
        return description.substring(0, length) + ellipsis;
    }

    const renderLog = () => {
        if(!log) {
            return "";
        } else {
            return (
                <div className={`${currentLogEntry.id === log.id ? "list-item selected-log-entry" : "list-item"}`}>
                    <Table size="sm" onClick={() => setCurrentLogEntry(log)}>
                        <tbody>
                            <tr>
                                <td style={{fontSize: "18px", fontWeight: "200"}}>{log.title}</td>
                                <td style={{textAlign: "right"}}>{log.attachments && log.attachments.length  !== 0 ? <FaPaperclip/> : ""}</td>
                            </tr>
                            <tr>
                                <td>{log.owner}</td><td style={{textAlign: "right"}}>
                                    {formatFullDateTime(log.createdDate)}</td>
                            </tr>
                            <tr>
                                <td>{formatDescription(log.description)}</td>
                                <td style={{textAlign: "right"}}>{log.id}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            );
        }
    }

    return(
        <div className={`${getLogEntryGroupId(log.properties) !== null ? "grouped-item" : ""}`}>
            {renderLog()}
        </div>
    )
    
}

export default SearchResultItem;