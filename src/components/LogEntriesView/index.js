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
import ologService from 'api/olog-service';
import LogDetails from 'components/LogDetails';
import SearchResultList from 'components/SearchResult/SearchResultList';
import customization from 'utils/customization';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearchPageParams } from 'features/searchPageParamsReducer';
import { useSearchLogsQuery } from 'services/ologApi';
import { updateCurrentLogEntry } from 'features/currentLogEntryReducer';
import ServiceErrorBanner from 'components/ErrorBanner';
import styled from 'styled-components';
import Filters from 'components/Filters';
import { mobile } from 'config/media';

const ContentContainer = styled.div`
    height: 100%;
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;

    ${mobile(`
        flex-direction: column;
        overflow: auto;
        height: auto;
    `)}
`

const StyledFilters = styled(Filters)`
    flex: 0 0 20%;
    border: 1px solid ${({theme}) => theme.colors.light};
    border-radius: 5px;

    ${mobile(`
        order: 9;
        width: 100%;
    `)}
`

const StyledSearchResultList = styled(SearchResultList)`
    flex: 0 0 30%;
    border: 1px solid ${({theme}) => theme.colors.light};
    border-radius: 5px;

    ${mobile(`
        flex: 1 50%;
        width: 100%;
    `)}
`

const LogDetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 0 0;
    border: 1px solid ${({theme}) => theme.colors.light};
    border-radius: 5px;

    ${mobile(`
        order: -1;
        width: 100%;
    `)}
`

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
        isFetching: searchInProgress 
    } = useSearchLogsQuery({searchParams, searchPageParams}, {
        pollingInterval: customization.defaultSearchFrequency,
        refetchOnMountOrArgChange: true
    });
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
        // If the entry isn't already in the search results, then fetch it
        if(!searchResults?.logs?.find(it => `${it.id}` === `${logId}`)) {
            const signal = new AbortController();
            if(logId > 0) {
                ologService.get(`/logs/${logId}`, {signal})
                .then(res => {
                    dispatch(updateCurrentLogEntry(res.data));
                })
                .catch(e => {
                    console.error(`Could not find log id ${logId}`, e);
                    dispatch(updateCurrentLogEntry(null));
                })
            }
            return () => {
                signal.abort();
            }
        }

    }, [searchResults, logId, dispatch])

    useEffect(() => {
        setShowGroup(false);
    }, [currentLogEntry])

    const renderedLogEntryDetails = (() => {
        
        if(currentLogEntry) {
            return <LogDetails {...{
                        showGroup, setShowGroup, 
                        currentLogEntry, 
                        logGroupRecords, setLogGroupRecords, 
                        userData, 
                        setReplyAction,
                        searchResults
                    }}/>
        } else {
            if(logId) {
                return <h5>Log record id {logId} not found</h5>
            } else {
                return <h5>Search for log entries, and select one to view</h5>
            }   
        }

    })();
    
    return (
        <>
            {searchResultError ? <ServiceErrorBanner title="Search Error" serviceName="logbook" error={searchResultError}/> : null}
            <ContentContainer id='log-entries-view-content'>
                <StyledFilters {...{
                    logbooks,
                    tags,
                    showFilters
                }}/>
                <StyledSearchResultList {...{
                    searchParams,
                    searchPageParams,
                    searchResults,
                    searchInProgress,
                    currentLogEntry,
                    showFilters, setShowFilters
                }}/>
                <LogDetailsContainer id='logdetails-container'>{renderedLogEntryDetails}</LogDetailsContainer>
            </ContentContainer>
        </>
    );

}

export default LogEntriesView