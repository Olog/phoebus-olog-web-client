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
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SearchResultItem from './SearchResultItem';
import LoadingOverlay from 'react-loading-overlay';
import { FaArrowUp, FaArrowDown} from "react-icons/fa";
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import {searchParamsToQueryString, queryStringToSearchParameters} from './utils';
import Tooltip from 'react-bootstrap/Tooltip';
import Cookies from 'universal-cookie';
import Pagination from 'react-bootstrap/Pagination';
import customization from './customization';


/**
 * Pane showing search query input and a the list of log entries 
 * matching the query. 
 */
class SearchResultList extends Component{

    state = {
        expandSymbol: ">",
        sortOrder: 'down',
    }

    cookies = new Cookies();

    componentDidMount = () => {
        this.props.search();
    }

    search = (sortOrder) => {
        this.setState({sortOrder: sortOrder}, () => this.props.setSortOrder(this.state.sortOrder));
        // Set the cookie with a long maxAge. For each new search the expiration date of the
        // cookie will be updated, so specifying an exact date may not be meaningful.
        this.cookies.set('searchString', searchParamsToQueryString(this.props.searchParams), {path: '/', maxAge: '100000000'});
        this.props.search();
    }

    submit = (event) => {
        event.preventDefault();
        this.search(this.state.sortOrder);
    }

    setSearchString = (event) => {
        let searchParams = queryStringToSearchParameters(event.target.value);
        this.props.setSearchParams(searchParams);
    }

    popover = (
        <Popover id="1">
          <Popover.Title as="h4">How to specify search string</Popover.Title>
          <Popover.Content>To define a time span, specify "start" and "end" times. These can be specified in
                    two different manners:
                    <ol>
                        <li>Relative date/time using expressions like <b>12 hours</b>,
                            <b>1 day</b>, <b>3 weeks</b> or <b>now</b>. The actual timestamp will be calculated
                            by the log service when the search query is submitted.</li>
                        <li>Absolute date/time on the format <pre style={{margin: "0px"}}>yyyy-MM-dd HH:mm:ss.SSS</pre> e.g. <b>2020-12-24 15:30:30.000</b>.</li>
                    </ol>
            </Popover.Content>
        </Popover>
      );

    toggleFilters = () => {
        this.props.toggleFilters();
        let symbol = this.props.showFilters ? ">" : "<";
        this.setState({expandSymbol: symbol});
    }

    setPageSize = (pageSize) => {

    }

    render(){

        var list = this.props.searchResult.map((item, index) => {
            return <SearchResultItem
                        key={index}
                        log={item}
                        childItem={false}
                        setCurrentLogEntry={this.props.setCurrentLogEntry}
                        selectedLogEntryId={this.props.selectedLogEntryId}/>
        });

        return(
            <Container className="grid-item full-height" style={{paddingLeft: "5px", paddingRight: "5px"}}>
                <Form style={{paddingTop: "5px"}} onSubmit={(e) => this.submit(e)}>
                    <Form.Row>
                        <Col style={{flexGrow: "0"}}>
                            <Button size="sm" onClick={() => this.toggleFilters()}>{this.state.expandSymbol}</Button>
                        </Col>
                        <Col style={{flexGrow: "0", paddingTop: "7px"}}>
                            <OverlayTrigger trigger="click"
                                overlay={this.popover}
                                rootClose
                                placement="right">
                                <Form.Label>Query: </Form.Label>
                            </OverlayTrigger>
                        </Col>
                        <Col style={{paddingLeft: "0px"}}>
                            <Form.Control size="sm" 
                                type="input"
                                disabled={this.props.showFilters}
                                placeholder="No search string"
                                style={{fontSize: "12px"}}
                                defaultValue={searchParamsToQueryString(this.props.searchParams)}
                                onChange={(e) => this.setSearchString(e)}>
                            </Form.Control>
                        </Col>
                        <Col style={{flexGrow: "0",paddingTop: "7px"}}>
                            <Form.Label>Search: </Form.Label>
                        </Col>
                        <Col style={{flexGrow: "0" }}>
                            <OverlayTrigger delay={{ hide: 450, show: 300 }}
                                overlay={(props) => (
                                    <Tooltip {...props}>Search and sort descending on date</Tooltip>
                                )}
                                rootClose
                                placement="bottom">
                                    <Button 
                                        size="sm"
                                        onClick={(e) => this.search('down')}>
                                        <FaArrowDown/>
                                    </Button>
                            </OverlayTrigger>
                        </Col>
                        <Col style={{flexGrow: "0", paddingLeft: "0px", paddingRight: "0px" }}>
                            <OverlayTrigger delay={{ hide: 450, show: 300 }}
                                    overlay={(props) => (
                                        <Tooltip {...props}>Search and sort ascending on date</Tooltip>
                                    )}
                                    rootClose
                                    placement="bottom">
                                    <Button 
                                        size="sm"
                                        onClick={(e) => this.search('up')}>
                                        <FaArrowUp/>
                                    </Button>
                            </OverlayTrigger>
                        </Col>
                    </Form.Row>
                </Form>
                <LoadingOverlay
                    active={this.props.searchInProgress}
                    spinner
                    styles={{
                        overlay: (base) => ({
                          ...base,
                          background: 'rgba(97, 97, 97, 0.3)',
                          '& svg circle': {stroke: 'rgba(19, 68, 83, 0.9) !important'}
                        })
                      }}>
                    <div style={{overflowY: 'scroll', height: 'calc(100vh)'}}>
                        {this.props.searchResult.length > 0 ?
                            list :
                            "No search results"}
                    </div>
                    <div style={{borderColor: 'rgba(97, 97, 97, 0.5)', borderStyle: 'solid', borderWidth: '1px', marginBottom: '3px'}}>
                    <Container>
                           <Row>
                               <Col style={{marginTop: '10px', paddingRight: '0px'}}>
                                <Form.Label >Hits Per Page: </Form.Label> 
                               </Col>
                               <Col style={{paddingLeft: '0px'}}>
                                <Form.Control size="sm" 
                                    type="number"
                                    style={{fontSize: "12px", marginTop: '6px', width: '60px'}}
                                    defaultValue={customization.defaultPageSize}
                                    onChange={(e) => this.setPageSize(e)}/>
                               </Col>
                               <Col style={{width: '100%'}}>
                               </Col>
                               <Col>
                                <Pagination style={{marginTop: '5px', marginBottom: '4px'}}> 
                                    <Pagination.First />
                                    <Pagination.Prev />
                                    <Pagination.Item>1</Pagination.Item>
                                    <Pagination.Item>2</Pagination.Item>
                                    <Pagination.Item>3</Pagination.Item>
                                    <Pagination.Item>4</Pagination.Item>
                                    <Pagination.Item>5</Pagination.Item>
                                    <Pagination.Next />
                                    <Pagination.Last />
                                    </Pagination>
                                </Col>
                           </Row>
                       </Container>
                    </div>
                    
                </LoadingOverlay>
            </Container>
        )
    }
}

export default SearchResultList;