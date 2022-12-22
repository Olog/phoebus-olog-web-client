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
import {useState, useEffect} from 'react';
import SearchResultItem from './SearchResultItem';
import LoadingOverlay from 'components/shared/LoadingOverlay';
import SearchBox from './SearchBox';
import PaginationBar from './PaginationBar';
import { useDispatch } from 'react-redux';
import { updateSearchPageParams } from 'features/searchPageParamsReducer';
import styled from 'styled-components';
import { mobile } from 'config/media';

const Container = styled.div`
    display: flex;
    flex-direction: column;
`

const SearchResultsContainer = styled.div`
    display: flex;
    // flex: 1 1 auto;
    flex: 2 500px;
    flex-direction: column;
    overflow: auto;

    & > * {
        border: 1px solid ${({theme}) => theme.colors.light};
        border-left: none;
        border-right: none;
    }
    & > *:not(:last-child) {
        border-bottom: none;
    }

    ${mobile(`
        order: 999;
    `)}

`

const StyledLoadingOverlay = styled(LoadingOverlay)`
    display: flex;
    flex-direction: column;
`

const StyledPaginationBar = styled(PaginationBar)`
    
`

/**
 * Pane showing search query input and a the list of log entries 
 * matching the query. 
 */
const SearchResultList = ({
    searchParams,
    searchPageParams,
    searchResults,
    searchInProgress,
    currentLogEntry,
    showFilters, setShowFilters,
    className
}) => {

    const [pageCount, setPageCount] = useState(0);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        if(!searchResults){
            setPageCount(0);
            return;
        }
        if(searchPageParams.from === 0) {
            setCurrentPageIndex(0);
        }
        let newPageCount = Math.ceil(searchResults.hitCount / searchPageParams.size);
        setPageCount(newPageCount);
    }, [searchResults, searchPageParams.size, searchPageParams.from])

    useEffect(() => {
        const from = currentPageIndex * searchPageParams.size;
        dispatch(updateSearchPageParams({...searchPageParams, from}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPageIndex]);

    const goToPage = (pageNumber) => {
        if(pageNumber >= 0) {
            setCurrentPageIndex(pageNumber);
        };
    }

    /**
     * Handles input in hits per page field and rejets any
     * value < 1 and > 999, i.e. leading zeros are also rejected.
     */
    const setPageSize = (e) => {
        const re = /^[0-9\b]{1,3}$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            let pageCount = parseInt(e.target.value);
            if(pageCount === 0){
                return;
            }
            dispatch(updateSearchPageParams({...searchPageParams, size: e.target.value}))
        } 
    }
    
    const renderedSearchResults = searchResults.logs.length === 0 ? "No search results" : searchResults.logs.map((item, index) => {
        return <SearchResultItem
                    key={index}
                    log={item}
                    currentLogEntry={currentLogEntry}
                />
    });

    return(
        <Container id='search-results-list' className={className} >
            <SearchBox {...{searchParams, showFilters, setShowFilters}} />
            <StyledLoadingOverlay
                active={searchInProgress}
            >
                <SearchResultsContainer id='search-results-list--container'>
                    {renderedSearchResults}
                </SearchResultsContainer>
                <StyledPaginationBar {...{pageCount, currentPageIndex, goToPage, searchPageParams, setPageSize}} />
            </StyledLoadingOverlay>
        </Container>
    )
}

export default SearchResultList;