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
import SearchResultItem from './SearchResultItem';
import LoadingOverlay from 'components/shared/LoadingOverlay';
import SearchBox from './SearchBox';
import PaginationBar from './PaginationBar';
import styled from 'styled-components';
import { mobile } from 'config/media';
import { sortLogsDateCreated } from 'utils';

const Container = styled.div`
    display: flex;
    flex-direction: column;
`

const SearchResultsContainer = styled.ol`
    display: flex;
    flex-direction: column;
    overflow: auto;
    flex: 2 0px;

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
        flex: 2 500px;
    `)}

`

const StyledSearchBox = styled(SearchBox)`
    flex: 0 0 auto;
`

const StyledLoadingOverlay = styled(LoadingOverlay)`
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    border-radius: inherit;
`

const StyledPaginationBar = styled(PaginationBar)`
    flex: 0 0 auto;
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

    // Guarantee that sort is applied for the current page of results
    const sortedLogs = [...searchResults.logs];
    if(sortedLogs.length > 0) {
        sortLogsDateCreated(sortedLogs, searchPageParams.sort === 'down');
    }
    const sortedResults = {...searchResults, logs: sortedLogs};
    const renderedSearchResults = sortedResults.logs.length === 0 ? "No search results" : sortedResults.logs.map((item, index) => {
        return <SearchResultItem
                    key={index}
                    log={item}
                    currentLogEntry={currentLogEntry}
                />
    });

    return(
        <Container id='search-results-list' className={className} >
            <StyledLoadingOverlay
                active={searchInProgress}
                size={10}
                message='Loading...'
            >
                <StyledSearchBox {...{searchParams, showFilters, setShowFilters}} />
                <SearchResultsContainer id='search-results-list--container' aria-label='Search Results' >
                    {renderedSearchResults}
                </SearchResultsContainer>
                <StyledPaginationBar {...{searchResults, searchPageParams}} />
            </StyledLoadingOverlay>
        </Container>
    )
}

export default SearchResultList;