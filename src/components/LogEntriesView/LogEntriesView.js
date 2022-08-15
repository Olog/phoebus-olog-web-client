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

import {useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ologService from '../../api/olog-service';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LogDetails from '../LogDetails/LogDetails';
import SearchResultList from '../SearchResult/SearchResultList';
import customization from '../../utils/customization';
import CollapsibleFilters from '../Filters/CollapsibleFilters';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearchPageParams } from '../../features/searchPageParamsReducer';
import { useSearchLogsQuery } from '../../services/ologApi';
import { updateCurrentLogEntry } from '../../features/currentLogEntryReducer';
import ServiceErrorBanner from '../ErrorBanner/ServiceErrorBanner';

const LogEntriesView = ({
    tags, 
    logbooks, 
    userData,
    setReplyAction, 
    currentLogEntry
}) => {

    const [showFilters, setShowFilters] = useState(false);
    const [showGroup, setShowGroup] = useState(false);
    
    const dispatch = useDispatch();
    const searchParams = useSelector(state => state.searchParams);
    const searchPageParams = useSelector(state => state.searchPageParams);
    const { 
        data: searchResults={
            logs: [],
            hitCount: 0
        },
        error: searchResultError, 
        isLoading: searchInProgress 
    } = useSearchLogsQuery({searchParams, searchPageParams}, {pollingInterval: customization.defaultSearchFrequency});
    if(searchResultError) {
        console.error("An error occurred while fetching search results", searchResultError);
    }

    const [logGroupRecords, setLogGroupRecords] = useState([]);

    const {id: logId } = useParams();

    // On changes to search params, reset the page to zero
    useEffect(() => {
        dispatch(updateSearchPageParams({...searchPageParams, from: 0}))
        // Ignore warning about missing dependency; we do *not* want
        // to update searchPageParams when searchPageParams changes...
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // if viewing a specific log entry, then retrieve it
    useEffect(() => {
        if(logId > 0) {
            ologService.get(`/logs/${logId}`)
            .then(res => {
                dispatch(updateCurrentLogEntry(res.data));
            })
            .catch(e => {
                console.error(`Could not find log id ${logId}`, e);
                dispatch(updateCurrentLogEntry(null));
            })
        }
    }, [logId, dispatch])

    // 
    useEffect(() => {
        setShowGroup(false);
    }, [currentLogEntry])

    const renderLogEntryDetails = () => {
        
        if(currentLogEntry) {
            return (
                <LogDetails {...{
                    showGroup, setShowGroup, 
                    currentLogEntry, 
                    logGroupRecords, setLogGroupRecords, 
                    userData, 
                    setReplyAction,
                    searchResults
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
        <Container fluid className="h-100">
            {searchResultError && 
                <Row>
                    <ServiceErrorBanner title="Search Error" serviceName="logbook" error={searchResultError} />
                </Row>
            }
            <Row className="h-100">
                <CollapsibleFilters {...{
                    logbooks,
                    tags,
                    showFilters,
                    searchParams,
                    searchPageParams
                }}/>
                <Col xs={{span: '12', order: 2}} lg={{span: 4, order: 2}} className="h-100 p-1">
                    <SearchResultList {...{
                        searchParams,
                        searchPageParams,
                        searchResults,
                        searchInProgress,
                        currentLogEntry,
                        showFilters, setShowFilters
                    }}/>
                </Col>
                <Col  
                    xs={{span: 12, order: 1}} 
                    lg={{span: showFilters ? 6 : 8, order: 3}} 
                    className="p-1"
                >
                    {renderLogEntryDetails()}
                </Col>
            </Row>
        </Container>
    );

}

export default LogEntriesView