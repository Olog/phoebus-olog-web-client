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
// Need axios for back-end access as the "fetch" API does not support CORS cookies.
//import axios from 'axios'
import SearchResultList from './SearchResultList';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * Top level component that defines application state. It also handles 
 * login/logout UI and logic.
 */
class MainApp extends Component {

  state = {
      logRecords: [],
      currentLogRecord: null
    };

  getLogRecords = (name) => {
    fetch(`${process.env.REACT_APP_BASE_URL}/Olog/logs?logbooks=` + name)
      .then(response => response.json())
      .then(data => this.setState({logRecords: data}))
  }

  setLogRecord = (record) => {
    this.setState({currentLogRecord: record});
  }

  render() {
    
    return (
      <>
        <Container fluid className="full-height">
          <Row className="full-height">
            <Col xs={12} sm={12} md={12} lg={2} style={{padding: "2px"}}>
              <Filters logbooks={this.props.logbooks} tags={this.props.tags} getLogRecords={this.getLogRecords}/>
            </Col>
            <Col xs={12} sm={12} md={12} lg={4} style={{padding: "2px"}}>
              <SearchResultList logs={this.state.logRecords} setLogRecord={this.setLogRecord} /> 
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