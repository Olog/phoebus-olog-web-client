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
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SearchResultItem from './SearchResultItem';
import LoadingOverlay from 'react-loading-overlay';
import SearchBox from './SearchBox';
import PaginationBar from './PaginationBar';


/**
 * Pane showing search query input and a the list of log entries 
 * matching the query. 
 */
const SearchResultList = ({
    searchParams, setSearchParams,
    searchPageParams, setSearchPageParams,
    searchResults,
    searchInProgress,
    currentLogEntry, setCurrentLogEntry,
    showFilters, setShowFilters
}) => {

    const [pageCount, setPageCount] = useState(0);
    const [currentPageIndex, setCurrentPageIndex] = useState(1);

    useEffect(() => {
        if(!searchResults){
            setPageCount(0);
            return;
        }
        if(searchPageParams.from === 0) {
            setCurrentPageIndex(1);
        }
        let newPageCount = Math.ceil(searchResults.hitCount / searchPageParams.size);
        setPageCount(newPageCount);
    }, [searchResults, searchPageParams.size, searchPageParams.from])

    useEffect(() => {
        const from = (currentPageIndex-1) * searchPageParams.size;
        setSearchPageParams({...searchPageParams, from});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPageIndex]);

    const goToPage = (pageNumber) => {
        if(pageNumber > 0) {
            setCurrentPageIndex(pageNumber)
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
            setSearchPageParams({...searchPageParams, size: e.target.value})
        } 
    }
    
    const renderedSearchResults = searchResults.logs.length === 0 ? "No search results" : searchResults.logs.map((item, index) => {
        return <SearchResultItem
                    key={index}
                    log={item}
                    currentLogEntry={currentLogEntry}
                    setCurrentLogEntry={setCurrentLogEntry}
                />
    });

    return(
        <Container fluid className="grid-item h-100 p-0" >
            <Row noGutters className='h-100 flex-column'>
                <Col sm='auto' >
                    <SearchBox {...{searchParams, setSearchParams, showFilters, setShowFilters}} />
                </Col>    
                <Col xs='auto' lg={{span: null, order: 3}}>
                    <PaginationBar {...{pageCount, currentPageIndex, goToPage, searchPageParams, setPageSize}} />
                </Col>
                <Col style={{overflowY: 'scroll'}} className="border-top border-bottom" >
                    <LoadingOverlay
                    active={searchInProgress}
                    spinner
                    styles={{
                        overlay: (base) => ({
                            ...base,
                            background: 'rgba(97, 97, 97, 0.3)',
                            '& svg circle': {stroke: 'rgba(19, 68, 83, 0.9) !important'}
                        })
                        }}>
                            {renderedSearchResults}
                        </LoadingOverlay>
                </Col>
            </Row>
        </Container>
    )
}

export default SearchResultList;