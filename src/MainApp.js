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
      sortAscending: false,
      showGroup: false,
      logGroupRecords: [],
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
    let tree = getLogEntryTree(this.state.searchResult, this.state.sortAscending);
    this.setState({logEntryTree: tree, searchInProgress: false});
  }

  setCurrentLogEntry = (logEntry) => {
      this.setState({selectedLogEntryId: logEntry.id});
      this.props.setCurrentLogEntry(logEntry);
      for (var i = 0; i < this.state.logGroupRecords.length; i++) {
          if (this.state.logGroupRecords[i].id === logEntry.id) {
              return null;
          }
      }
      this.setState({showGroup: false});
  }

  setSearchString = (searchString, performSearch) => {
    this.setState({searchString: searchString});
  }

  setSortAscending = (ascending) => {
    this.setState({sortAscending: ascending});
  }

  setShowGroup = (val) => {
    this.setState({showGroup: val});
  }

  setLogGroupRecords = (recs) => {
    this.setState({logGroupRecords: recs});
  }

  render() {
    return (
      <>
        <Container fluid className="full-height">
          <Row className="full-height">
            {<Col xs={{span: 12, order: 3}} sm={{span: 12, order: 3}} md={{span: 12, order: 3}} lg={{span: 2, order: 1}} style={{padding: "2px"}}>
              <Filters logbooks={this.props.logbooks} 
                tags={this.props.tags} 
                setSearchString={this.setSearchString}/>
            </Col>}
            <Col xs={{span: 12, order: 2}} sm={{span: 12, order: 2}} md={{span: 12, order: 2}} lg={{span: 4, order: 2}} style={{padding: "2px"}}>
              <SearchResultList {...this.state}
                setCurrentLogEntry={this.setCurrentLogEntry}
                setSearchString={this.setSearchString}
                search={this.search}
                setSortAscending={this.setSortAscending}/> 
            </Col>
            <Col  xs={{span: 12, order: 1}} sm={{span: 12, order: 1}} md={{span: 12, order: 1}} lg={{span: 6, order: 3}} style={{padding: "2px"}}>
              <LogDetails 
                userData={this.props.userData}
                currentLogEntry={this.props.currentLogEntry}
                setReplyAction={this.props.setReplyAction}
                setLogGroupRecords={this.setLogGroupRecords}
                logGroupRecords={this.state.logGroupRecords}
                showGroup={this.state.showGroup}
                setShowGroup={this.setShowGroup} />
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default MainApp
