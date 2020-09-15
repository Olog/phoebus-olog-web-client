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
import Filters from './Filters'
import LogDetails from './LogDetails'
// Need axios for back-end access as the "fetch" API does not support CORS cookies.
//import axios from 'axios'

import './css/olog.css';
import SearchResultList from './SearchResultList';
import Grid from '@material-ui/core/Grid';

/**
 * Top level component that defines application state. It also handles 
 * login/logout UI and logic.
 */
class MainApp extends Component {

  state = {
      logbooks: [],
      tags: [],
      logRecords: [],
      userData: {userName: "", roles: []},
      currentLogRecord: null
    };
  
  componentDidMount() {
    this.refreshLogbooks();
    this.refreshTags();
    //this.getLogRecords();
  }

  refreshLogbooks = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/Olog/logbooks`)
    .then(response => response.json())
    .then(data => this.setState({logbooks: data}))
    .catch(() => this.setState({logbooks: []}));
  }

  refreshTags = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/Olog/tags`)
    .then(response => response.json())
    .then(data => {
      if(data){
          this.setState({tags: data});
      }
    })
    .catch(() => this.setState({tags: []}));
  }

  setUserData = (userData) => {
    this.setState({userData: userData});
  }

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
      <div> 
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Banner userData={this.state.userData}  
                setUserData={this.setUserData} 
                refreshLogbooks={this.refreshLogbooks}
                refreshTags={this.refreshTags}/>
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={2} >
            <Filters logbooks={this.state.logbooks} tags={this.state.tags} getLogRecords={this.getLogRecords}/>
          </Grid>
          <Grid item xs={12} sm={8} md={4} lg={4}>
            <SearchResultList logs={this.state.logRecords} setLogRecord={this.setLogRecord} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <LogDetails currentLogRecord={this.state.currentLogRecord}/>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default MainApp