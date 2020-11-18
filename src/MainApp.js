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

/**
 * Top level component holding the main UI area components.
 */
class MainApp extends Component {

  state = {
      logRecords: [],
      currentLogRecord: null,
      searchString: ""
    };

  search = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/Olog/logs?` + this.state.searchString)
      .then(response => response.json())
      .then(data => this.setState({logRecords: data}))
  }

  setLogRecord = (record) => {
    this.setState({currentLogRecord: record});
  }

  setSearchString = (searchString, performSearch) => {
    if(searchString.startsWith('&')){
      searchString = searchString.substring(1, searchString.length);
    }
    if(searchString.endsWith('&')){
      searchString = searchString.substring(0, searchString.length - 1);
    }
    this.setState({searchString: searchString});
  }

  render() {
    
    return (
      <>
        <Container fluid className="full-height">
          <Row className="full-height">
            <Col xs={12} sm={12} md={12} lg={2} style={{padding: "2px"}}>
              <Filters logbooks={this.props.logbooks} 
                tags={this.props.tags} 
                setSearchString={this.setSearchString}/>
            </Col>
            <Col xs={12} sm={12} md={12} lg={4} style={{padding: "2px"}}>
              <SearchResultList 
                logs={this.state.logRecords} 
                setLogRecord={this.setLogRecord}
                searchString={this.state.searchString}
                setSearchString={this.setSearchString}
                search={this.search}/> 
            </Col>
            <Col  xs={12} sm={12} md={12} lg={6} style={{padding: "2px"}}>
              <LogDetails currentLogRecord={this.state.currentLogRecord}/>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default MainApp