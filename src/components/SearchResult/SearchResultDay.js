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
import React, {Component} from 'react';
import SearchResultItem from './SearchResultItem';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';

class SearchResultDay extends Component{

    isToday = (date) => {
        return date === moment().format('YYYY-MM-DD');
    }

    render(){
        var entries = this.props.logEntries.map((row, index) => {
            return (
                <SearchResultItem  
                    key={index} 
                    log={row} 
                    setCurrentLogEntry={this.props.setCurrentLogEntry}
                    selectedLogEntryId={this.props.selectedLogEntryId}/>
            )
        })

        return(
            <>
            <p style={{color: "#007cff", 
                fontWeight: "600", 
                paddingTop: "15px", 
                marginBottom: "5px",
                borderBottom: "1px solid #e0e0e0"}}>{this.isToday(this.props.dateString) ? "Today" : this.props.dateString}</p>
            <ListGroup className="olog-ul">{entries}</ListGroup>
            </>
        );
    }
}

export default SearchResultDay;