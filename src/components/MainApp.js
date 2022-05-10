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
import Filters from './Filters/Filters'
import LogDetails from './LogDetails/LogDetails'
import SearchResultList from './SearchResult/SearchResultList';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import customization from '../utils/customization';
import {ologClientInfoHeader} from '../utils/utils.js';
import {queryStringToSearchParameters, searchParamsToQueryString} from '../utils/searchParams';
import Cookies from 'universal-cookie';
import { withRouter } from 'react-router-dom';
import { TaskTimer } from 'tasktimer';

// Timer task to handle periodic search
const timer = new TaskTimer(30000);


/**
 * Top level component holding the main UI area components.
 */
class MainApp extends Component {

    state = {
          logEntryTree: [],
          selectedLogEntryId: 0,    // current log entry being displayed
          searchResult: {           // results from search for logs
            logs: [],
            hitCount: 0
          },
          searchInProgress: false,
          logGroupRecords: [],
          showFilters: false,       // whether to show the Filters component or not
          searchParams: {},         // start, end, logbooks, tags, etc.
          showIdNotFound: false,
          sortOrder: "down" 
        };

    cookies = new Cookies();
    
    componentDidMount = () => {
      if(this.props.match && this.props.match.params && this.props.match.params.id > 0){
        this.loadLogEntry(this.props.match.params.id);
      }
      
    }

    loadLogEntry = (id) => {
      if(id < 1){
          return;
      }
      this.setState({showIdNotFound: false});
      fetch(`${process.env.REACT_APP_BASE_URL}/logs/` + id)
      .then(response => {
          if(response.ok){
              return response.json();
          }
          else{
              throw Error("Server returned error.");
          }
      })
      .then(data => {
        if(data){
            this.setCurrentLogEntry(data);
        }
      })
      .catch(() => {
          this.setCurrentLogEntry(null);
          this.setState({showIdNotFound: true});
      });
  }

  /**
   * Called when user requests explicit search from UI.
   * @param {*} sortOrder 
   * @param {*} from 
   * @param {*} size 
   * @param {*} callback 
   */
    search = (sortOrder, from, size, callback) => {
      // Stop periodic search
      timer.reset();
      // Check if search parameters have been defined
      if(Object.values(this.state.searchParams).length === 0){
        let searchParameters = {};
        // Read from cookie
        let searchParamsFromCookie = this.cookies.get('searchString');
        // If this is empty/undefined, fall back to default search params defined in customization
        if(!searchParamsFromCookie || searchParamsFromCookie === ''){
          searchParameters = customization.defaultSearchParams;
        }
        else{
          searchParameters = queryStringToSearchParameters(searchParamsFromCookie);
        }
        this.setState({searchParams: searchParameters, searchInProgress: true}, () => {
          this.doSearch(this.updateQuery(sortOrder, from, size), false, callback);
        });
      }
      else{
        this.setState({searchInProgress: true}, () => {
          this.doSearch(this.updateQuery(sortOrder, from, size), false, callback);
        });
      }
    }

    updateQuery = (sortOrder, from, size) => {
      let query = searchParamsToQueryString(this.state.searchParams);
      this.cookies.set('searchString', query, {path: '/', maxAge: '100000000'});
      return query += "&sort=" + sortOrder + "&from=" + from + "&size=" + size;
    }

    /**
     * Dispatches search request to service
     * @param {*} query The query string
     * @param {*} isPeriodicSearch indicates if this is called in a periodic search context or not
     * @param {*} callback Function called when server response arrives containing matching log entries
     */
    doSearch = (query, isPeriodicSearch, callback) => {
      fetch(`${process.env.REACT_APP_BASE_URL}/logs/search?` + query, {headers: ologClientInfoHeader()})
            .then(response => {
              this.setState({searchInProgress: false}); 
              if(response.ok){
                return response.json();
              } 
              else if(!isPeriodicSearch && response.status === 400){
                alert("Server returned 'Bad Request'.")
              }
            })
            .then(data => {
              if(data){
                this.setState({searchResult: data}, () => callback());
                if(!isPeriodicSearch){
                  timer.add(task => this.doSearch(query, true, callback)).start();
                }
              }
            })
            .catch(() => {
              timer.reset();
              this.setState({searchInProgress: false}); 
              if(!isPeriodicSearch){
                alert("Unable to connect to service.");
              }
            });
    }

    setCurrentLogEntry = (logEntry) => {
       if(!logEntry){
         return;
       }
        this.setState({selectedLogEntryId: logEntry.id});
        this.props.setCurrentLogEntry(logEntry);
        this.setState({showGroup: false});
        this.props.history.push('/logs/' + logEntry.id);
    }

    setLogGroupRecords = (recs) => {
        this.setState({logGroupRecords: recs});
    }

    toggleFilters = () => {
        this.setState({showFilters: !this.state.showFilters});
    }

    setSearchParams = (params) => {
        this.setState({searchParams: params});
    }

    setSortOrder = (order) => {
      this.setState({currentPageIndex: 1, sortOrder: order});
    }

  render() {
    
    // console.log("search params mainApp:");
    // console.log(this.state.searchParams);

    return (
      <>
        <Container fluid className="full-height">
          <Row className="full-height">
            <Collapse in={this.state.showFilters}>
                <Col xs={{span: 12, order: 3}} sm={{span: 12, order: 3}} md={{span: 12, order: 3}} lg={{span: 2, order: 1}} style={{padding: "2px"}}>
                  <Filters
                    logbooks={this.props.logbooks}
                    tags={this.props.tags}
                    searchParams={this.state.searchParams}
                    setSearchParams={this.setSearchParams}
                    sortOrder={this.state.sortOrder}
                    setSortOrder={this.setSortOrder}/>
                </Col>
            </Collapse>
            <Col xs={{span: 12, order: 2}} sm={{span: 12, order: 2}} md={{span: 12, order: 2}} lg={{span: 4, order: 2}} style={{padding: "2px"}}>
              <SearchResultList
                searchParams = {this.state.searchParams}
                setSearchParams={this.setSearchParams}
                search={this.search}
                searchInProgress={this.state.searchInProgress}
                searchResult={this.state.searchResult}
                sortOrder={this.state.sortOrder}
                setCurrentLogEntry={this.setCurrentLogEntry}
                selectedLogEntryId={this.state.selectedLogEntryId}
                toggleFilters={this.toggleFilters}
                showFilters={this.state.showFilters}
              />
            </Col>
            <Col  xs={{span: 12, order: 1}} sm={{span: 12, order: 1}} md={{span: 12, order: 1}} lg={{span: this.state.showFilters ? 6 : 8, order: 3}} style={{padding: "2px"}}>
              {!this.state.showIdNotFound && 
                <LogDetails {...this.state} {...this.props}
                  setCurrentLogEntry={this.setCurrentLogEntry}
                  setReplyAction={this.props.setReplyAction}
                  setLogGroupRecords={this.setLogGroupRecords}
                  setShowGroup={this.props.setShowGroup} />}
              {this.state.showIdNotFound &&
                <h5>Log record id {this.props.match.params.id} not found</h5>}
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default withRouter(MainApp);
