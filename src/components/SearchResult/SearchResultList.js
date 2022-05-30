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
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SearchResultItem from './SearchResultItem';
import LoadingOverlay from 'react-loading-overlay';
import Pagination from 'react-bootstrap/Pagination';
import SearchBox from './SearchBox';


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
    }, [searchResults, searchPageParams.size])

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

    // prevent default to e.g. prevent page reload
    // do NOT trigger search here, as the SearchBox
    // component already triggers this by updating 
    // the searchParams state.
    const submit = (event) => {
        event.preventDefault();
    }

    const toggleFilters = () => {
        setShowFilters(!showFilters)
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

    const showSearchHelp = () => {
        window.open(`${process.env.REACT_APP_BASE_URL}/SearchHelp_en.html`, '_blank');
    }

    const renderPaginationItems = () => {
        let items = [];
        // Calculate first index to render. This depends on the current page index as well as the
        // total page count (which might be greater than the maximum number of buttons: 10).
        let pagesToRender =  Math.min(9, pageCount - 1);
        let firstIndex = Math.max(1, currentPageIndex - pagesToRender);
        let lastIndex = firstIndex + pagesToRender;
        for(let i = firstIndex; i <= lastIndex; i++){
            items.push(<Pagination.Item 
                key={i} 
                active={i === currentPageIndex}
                onClick={() => goToPage(i)}>
                {i}
            </Pagination.Item>)
        }
        return items;
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
        <Container className="grid-item full-height" style={{paddingLeft: "5px", paddingRight: "5px"}} >
            <Form style={{paddingTop: "5px"}} onSubmit={(e) => submit(e)}>
                <Form.Row>
                    <Col style={{flexGrow: "0"}}>
                        <Button size="sm" onClick={() => toggleFilters()}>{showFilters ? ">" : "<"}</Button>
                    </Col>
                    <Col style={{paddingLeft: "0px"}}>
                    <SearchBox 
                        {...{searchParams, setSearchParams, showFilters}}
                    />
                    </Col>
                    <Col style={{flexGrow: "0" }}>
                        <Button 
                            size="sm"
                            onClick={(e) => showSearchHelp()}>
                            Help
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
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

                <div style={{overflowY: 'scroll', height: 'calc(80vh)'}}>
                    {renderedSearchResults}
                </div>
                <div className="pagination-container">
                    <Container>
                        <Row>
                            <Col style={{padding: '0px', maxWidth: '90px'}}>
                            <Form.Label >Hits per page: </Form.Label> 
                            </Col>
                            <Col style={{padding: '0px', maxWidth: '50px'}}>
                            <Form.Control size="sm" 
                                type="input"
                                value={searchPageParams.size}
                                onChange={(e) => setPageSize(e)}
                                />
                            </Col>
                        </Row>
                        <Row style={{visibility: pageCount < 2 ? 'hidden' : 'visible'}}>
                            <Col style={{marginTop: '13px', padding: '0px'}}>
                            <Pagination
                                size='sm'> 
                                <Pagination.First disabled={currentPageIndex === 1}
                                    onClick={() => goToPage(1)}
                                    style={{fontWeight: 'bold'}}>&#124;&lt;</Pagination.First>
                                <Pagination.Prev  onClick={() => goToPage(currentPageIndex - 1)}
                                    disabled={currentPageIndex === 1}
                                    style={{fontWeight: 'bold'}} >&lt;</Pagination.Prev>
                                {renderPaginationItems()}
                                <Pagination.Next onClick={() => goToPage(currentPageIndex + 1)} 
                                    disabled={currentPageIndex === pageCount}
                                    style={{fontWeight: 'bold'}}>&gt;</Pagination.Next>
                                <Pagination.Last disabled={currentPageIndex === pageCount}
                                    onClick={() => goToPage(pageCount)}
                                    style={{fontWeight: 'bold'}}>&gt;&#124;</Pagination.Last>
                                </Pagination>
                            </Col>
                            <Col style={{marginTop: '16px',  padding:'5px', maxWidth: '60px'}}>
                                {currentPageIndex} / {pageCount}
                            </Col>
                        </Row>
                    </Container>
                </div>
                
            </LoadingOverlay>
        </Container>
    )
}

export default SearchResultList;