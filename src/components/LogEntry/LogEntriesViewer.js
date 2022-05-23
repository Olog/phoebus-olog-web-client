
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

import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import ologService from '../../api/olog-service';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import Filters from '../Filters/Filters';
import LogDetails from '../LogDetails/LogDetails';
import SearchResultList from '../SearchResult/SearchResultList';
import customization from '../../utils/customization';
import { searchParamsToQueryString } from '../../utils/searchParams';
import { ologClientInfoHeader } from '../../utils/utils';

const LogEntriesViewer = ({
    tags, 
    logbooks, 
    userData,
    setReplyAction, 
    showGroup, setShowGroup
}) => {

    const [currentLogEntry, setCurrentLogEntry] = useState(null);
    const [showFilters, setShowFilters] = useState(true);
    const [searchPageParams, setSearchPageParams] = useState({
        sortOrder: "down",
        page: 1,
        size: customization.defaultPageSize
    });
    const [searchParams, setSearchParams] = useState({});
    const [searchResults, setSearchResults] = useState({           // results from search for logs
        logs: [],
        hitCount: 0
    });
    const [searchInProgress, setSearchInProgress] = useState(false);
    const [logGroupRecords, setLogGroupRecords] = useState([]);

    const {id: logId } = useParams();

    // if viewing a specific log entry, then retrieve it
    useEffect(() => {
        if(logId > 0) {
            ologService.get(`/logs/${logId}`)
            .then(res => {
                setCurrentLogEntry(res.data);
            })
            .catch(e => {
                console.error(`Could not find log id ${logId}`, e);
                setCurrentLogEntry(null);
            })
        }
    }, [logId])

    const search = () => {
        
        const query = searchParamsToQueryString(searchParams);
        setSearchInProgress(true);

        console.log("performing search with:")
        console.log(searchParams);
        console.log(searchPageParams);
        console.log(query);
        
        ologService.get(`/logs/search?${query}`, {headers: ologClientInfoHeader()})
        .then(res => {
            if(res.data){
                setSearchResults(res.data);
            }
        })
        .catch(err => {
          if(!err.response) {
            alert("Unable to connect to service to perform search.");
          }
        //   if(err.response && !isPeriodicSearch && err.response.status === 400) {
          if(err.response && err.response.status === 400) {
            alert(`Server returned 'Bad Request' while performing search with query '${query}'`);
          }
        })
        .finally(() => {
            setSearchInProgress(false);
        })

    };

    useEffect(() => {
        search();
    }, [searchParams, searchPageParams])

    const renderLogEntryDetails = () => {
        
        if(currentLogEntry) {
            return (
                <LogDetails {...{
                    showGroup, setShowGroup, 
                    currentLogEntry, setCurrentLogEntry, 
                    logGroupRecords, setLogGroupRecords, 
                    userData, 
                    setReplyAction
                }}/>
            );
        } else {
            if(logId) {
                return (
                    <h5>Log record id {logId} not found</h5>
                );
            } else {
                return (
                    <h5>Search for log entries, and select one to view</h5>
                );
            }
            
        }
    };

    return (
        <>
            <Container fluid className="full-height">
                <Row className="full-height">
                    <Collapse in={showFilters}>
                        <Col xs={{span: 12, order: 3}} sm={{span: 12, order: 3}} md={{span: 12, order: 3}} lg={{span: 2, order: 1}} style={{padding: "2px"}}>
                            <Filters
                                {...{
                                    logbooks,
                                    tags,
                                    searchParams, setSearchParams,
                                    searchPageParams, setSearchPageParams
                                }}
                            />
                        </Col>
                    </Collapse>
                    <Col xs={{span: 12, order: 2}} sm={{span: 12, order: 2}} md={{span: 12, order: 2}} lg={{span: 4, order: 2}} style={{padding: "2px"}}>
                        <SearchResultList {...{
                            searchParams, setSearchParams,
                            searchPageParams, setSearchPageParams,
                            searchResults,
                            searchInProgress,
                            currentLogEntry, setCurrentLogEntry,
                            showFilters, setShowFilters
                        }}/>
                        {/* <div>Search Results Here</div> */}
                    </Col>
                    <Col  
                        xs={{span: 12, order: 1}} 
                        sm={{span: 12, order: 1}} 
                        md={{span: 12, order: 1}} 
                        lg={{span: showFilters ? 6 : 8, order: 3}} 
                        style={{padding: "2px"}} 
                    >
                        {renderLogEntryDetails()}
                    </Col>
                </Row>
            </Container>
        </>
    );

}

export default LogEntriesViewer