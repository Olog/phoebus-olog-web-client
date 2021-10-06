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
import Filters from './Filters'
import LogDetails from './LogDetails'
import SearchResultList from './SearchResultList';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {getLogEntryTree} from './utils';

/**
 * Top level component holding the main UI area components.
 */
class MainApp extends Component {

  state = {
      logEntryTree: [],
      searchString: "start=12 hours&end=now",
      selectedLogEntryId: 0,
      searchResult: [],
      searchInProgress: false,
      sortAscending: false
    };

  search = () => {

    this.setState({searchInProgress: true}, () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/logs?` + this.state.searchString)
      .then(response => {if(response.ok){return response.json();} else {return []}})
      .then(data => {
        this.setState({searchResult: data}, () => this.constructTree());
      })
      .catch(() => {this.setState({searchInProgress: false}); alert("Olog service off-line?");})});
  }

  constructTree = () => {
    console.log(this.state.sortAscending);
    let tree = getLogEntryTree(this.state.searchResult, this.state.sortAscending);
    this.setState({logEntryTree: tree, searchInProgress: false});
    console.log(tree);
  }

  setLogEntry = (logEntry) => {
    this.setState({selectedLogEntryId: logEntry.id, showGroup: false});
    this.props.setCurrentLogEntry(logEntry);
  }

  setSearchString = (searchString, performSearch) => {
    this.setState({searchString: searchString});
  }

  reverseSort = () => {
    this.setState(prevState => ({sortAscending: !prevState.sortAscending}), () => this.constructTree());
  }

  render() {
    return (
      <>
        <Container fluid className="full-height">
          <Row className="full-height">
            {<Col xs={12} sm={12} md={12} lg={2} style={{padding: "2px"}}>
              <Filters logbooks={this.props.logbooks} 
                tags={this.props.tags} 
                setSearchString={this.setSearchString}/>
            </Col>}
            <Col xs={12} sm={12} md={12} lg={4} style={{padding: "2px"}}>
              <SearchResultList 
                logEntryTree={this.state.logEntryTree} 
                setCurrentLogEntry={this.setLogEntry}
                searchString={this.state.searchString}
                setSearchString={this.setSearchString}
                selectedLogEntryId={this.state.selectedLogEntryId}
                search={this.search}
                searchInProgress={this.state.searchInProgress}
                sortAscending={this.state.sortAscending}
                reverseSort={this.reverseSort}/> 
            </Col>
            <Col  xs={12} sm={12} md={12} lg={6} style={{padding: "2px"}}>
              <LogDetails 
                currentLogEntry={this.props.currentLogEntry}
                setReplyAction={this.props.setReplyAction} />
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default MainApp