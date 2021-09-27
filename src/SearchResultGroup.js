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

/**
 * View for a log entry group, i.e. one log entry parent item appearing
 * as first element in a list, followed by n child items rendered in
 * a slightly different manner to indicate the parent/child relationship.
 */
class SearchResultGroup extends Component{


    render(){
        //let copy = [...this.props.logEntries].slice(0, this.props.logEntries.length - 1).sort((a, b) => a.createdDate - b.createdDate);
        var childItems = this.props.logEntries.getChildItems().map((row, index) => {
                return (
                    <SearchResultItem 
                        childItem={true}
                        key={index} 
                        log={row} 
                        setCurrentLogEntry={this.props.setCurrentLogEntry}
                        selectedLogEntryId={this.props.selectedLogEntryId}/>
                )
            });

        return(
            <>
                <SearchResultItem 
                            childItem={false}
                            key={this.props.logEntries.getParent().id} 
                            log={this.props.logEntries.getParent()} 
                            setCurrentLogEntry={this.props.setCurrentLogEntry}
                            selectedLogEntryId={this.props.selectedLogEntryId}/>
                <ListGroup className="olog-ul">{childItems}</ListGroup>
            
            </>
           
        );
    }
}

export default SearchResultGroup;
