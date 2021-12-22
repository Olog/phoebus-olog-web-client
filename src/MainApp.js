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
import Collapse from 'react-bootstrap/Collapse';
import customization from './customization';
import {queryStringToSearchParameters, searchParamsToQueryString} from './utils.js';
import Cookies from 'universal-cookie';


/**
 * Top level component holding the main UI area components.
 */
class MainApp extends Component {

    state = {
          logEntryTree: [],
          selectedLogEntryId: 0,
          searchResult: {
            logs: [],
            hitCount: 0
          },
          searchInProgress: false,
          logGroupRecords: [],
          showFilters: false,
          searchParams: {}
        };

    cookies = new Cookies();

    componentDidMount = () =>{
      
    }

    search = (sortOrder, from, size, callback) => {
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
          this.doSearch(sortOrder, from, size, callback);
        });
      }
      else{
        this.doSearch(sortOrder, from, size, callback);
      }
    }

    doSearch = (sortOrder, from, size, callback) => {
      let query = searchParamsToQueryString(this.state.searchParams);
      this.cookies.set('searchString', query, {path: '/', maxAge: '100000000'});
      // Append sort, from and size
      query += "&sort=" + sortOrder + "&from=" + from + "&size=" + size;
      fetch(`${process.env.REACT_APP_BASE_URL}/logs/search?` + query)
            .then(response => {if(response.ok){return response.json();} else {return []}})
            .then(data => {
              this.setState({searchResult: data, searchInProgress: false}, () => callback());
            })
            .catch(() => {this.setState({searchInProgress: false}); alert("Olog service off-line?");})
    }

    setCurrentLogEntry = (logEntry) => {
        this.setState({selectedLogEntryId: logEntry.id});
        this.props.setCurrentLogEntry(logEntry);
        this.setState({showGroup: false});
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

  render() {

    return (
      <>
        <Container fluid className="full-height">
          <Row className="full-height">
            <Collapse in={this.state.showFilters}>
                <Col xs={{span: 12, order: 3}} sm={{span: 12, order: 3}} md={{span: 12, order: 3}} lg={{span: 2, order: 1}} style={{padding: "2px"}}>
                  <Filters
                    {...this.state} {...this.props}
                    setSearchParams={this.setSearchParams}/>
                </Col>
            </Collapse>
            <Col xs={{span: 12, order: 2}} sm={{span: 12, order: 2}} md={{span: 12, order: 2}} lg={{span: 4, order: 2}} style={{padding: "2px"}}>
              <SearchResultList {...this.state} {...this.props}
                setCurrentLogEntry={this.setCurrentLogEntry}
                setSearchParams={this.setSearchParams}
                search={this.search}
                toggleFilters={this.toggleFilters}/>
            </Col>
            <Col  xs={{span: 12, order: 1}} sm={{span: 12, order: 1}} md={{span: 12, order: 1}} lg={{span: this.state.showFilters ? 6 : 8, order: 3}} style={{padding: "2px"}}>
              <LogDetails {...this.state} {...this.props}
                setCurrentLogEntry={this.setCurrentLogEntry}
                setReplyAction={this.props.setReplyAction}
                setLogGroupRecords={this.setLogGroupRecords}
                setShowGroup={this.props.setShowGroup} />
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default MainApp
