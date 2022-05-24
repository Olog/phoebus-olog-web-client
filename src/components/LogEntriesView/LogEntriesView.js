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

import {useState, useEffect, useRef, useMemo } from 'react';
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
import { TaskTimer } from 'tasktimer';
import Cookies from 'universal-cookie';

const LogEntriesView = ({
    tags, 
    logbooks, 
    userData,
    setReplyAction, 
    showGroup, setShowGroup
}) => {

    const timerRef = useRef(new TaskTimer(customization.defaultSearchFrequency));
    const cookies = useMemo(() => new Cookies(), []);
    const [currentLogEntry, setCurrentLogEntry] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchPageParams, setSearchPageParams] = useState({
        sortOrder: "down",
        from: 0,
        size: customization.defaultPageSize
    });
    const [searchParams, setSearchParams] = useState({...customization.defaultSearchParams});
    const [searchResults, setSearchResults] = useState({
        logs: [],
        hitCount: 0
    });
    const [searchInProgress, setSearchInProgress] = useState(false);
    const [logGroupRecords, setLogGroupRecords] = useState([]);

    const {id: logId } = useParams();

    // on initial render, restore search states from cookies if present
    useEffect(() => {
        let searchParamsFromCookie = cookies.get(customization.searchParamsCookie);
        if(searchParamsFromCookie){
            setSearchParams(searchParamsFromCookie);
        }
        let searchPageParamsFromCookie = cookies.get(customization.searchPageParamsCookie);
        if(searchPageParamsFromCookie){
            setSearchPageParams(searchPageParamsFromCookie);
        }
    }, [cookies]);

    // on initial render, add task to perform search periodically
    useEffect(() => {
        timerRef.current.add(search);
        timerRef.current.start();

        // Cleanup timer when component will unmount
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            timerRef.current.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // On changes to search or paging params, search and
    // reset the timers
    useEffect(() => {
        timerRef.current.reset();
        timerRef.current.add(search).start();
        search();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchPageParams, searchParams]);

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

        // save current search params to cookies
        cookies.set(customization.searchParamsCookie, searchParams, {path: '/', maxAge: '100000000'});
        cookies.set(customization.searchPageParamsCookie, searchPageParams, {path: '/', maxAge: '100000000'});

        // search
        const query = searchParamsToQueryString({...searchParams, ...searchPageParams});
        setSearchInProgress(true);

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
          if(err.response && err.response.status === 400) {
            alert(`Server returned 'Bad Request' while performing search with query '${query}'`);
          }
        })
        .finally(() => {
            setSearchInProgress(false);
        })

    };

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

export default LogEntriesView