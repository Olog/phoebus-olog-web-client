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
import Banner from './Banner';
//import MainView from './MainView';
// Need axios for back-end access as the "fetch" API does not support CORS cookies.
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Logbooks from './Logbooks'

import './css/olog.css';

/**
 * Top level component that defines application state. It also handles 
 * login/logout UI and logic.
 */
class App extends Component {

  state = {
    logbooks: [],
    userData: {userName: "", roles: []}
  }

  createLogbook = (name) => {
    // TODO add error handling if request fails.
   axios.put(`${process.env.REACT_APP_BASE_URL}/Olog/logbooks/` + name, {name: name, state: "Active"}, { withCredentials: true })
    .then(res => {
        this.setState(prevState => ({logbooks: [...prevState.logbooks, res.data]}));
    });
  };

  componentDidMount() {
    this.refreshLogbooks();
  }

  refreshLogbooks = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/Olog/logbooks`)
    .then(response => response.json())
    .then(data => this.setState({logbooks: data}))

  fetch(`${process.env.REACT_APP_BASE_URL}/user`)
    .then(data => this.setState({userData : data}))
  }

  setUserData = (userData) => {
    this.setState({userData: userData});
  }

  render() {

    return (
      <div>
         <Container fluid>
          <Row>
            <Col>
              <Banner userData={this.state.userData}  setUserData={this.setUserData} refreshLogbooks={this.refreshLogbooks}/>
            </Col>
          </Row>
          <Row> 
            <Col className="cell-style" sm={true}>
              <Logbooks logbooks={this.state.logbooks}/>
            </Col>
            <Col className="cell-style" sm={true}>
              Foo
            </Col>
            <Col className="cell-style">
              Bar
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default App