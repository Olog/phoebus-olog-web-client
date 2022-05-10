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
import Cookies from 'universal-cookie';
import Pagination from 'react-bootstrap/Pagination';
import customization from '../../utils/customization';
import SearchBox from './SearchBox';


/**
 * Pane showing search query input and a the list of log entries 
 * matching the query. 
 */
class SearchResultList extends Component{

    state = {
        expandSymbol: ">",
        pageItems: [],
        currentPageIndex: 1,
        pageSize: customization.defaultPageSize,
        pageCount: 1
    }

    cookies = new Cookies();

    componentDidMount = () => {
        this.search();
    }

    search = () => {
        this.setState({currentPageIndex: 1}, () => {
            this.props.search(this.props.sortOrder, (this.state.currentPageIndex - 1) * this.state.pageSize, this.state.pageSize, this.updatePaginationControls);
        });
    }

    updatePaginationControls = () => {
        if(!this.props.searchResult){
            this.setState({pageCount: 0});
            return;
        }
        // Calculate page count
        let newPageCount = Math.ceil(this.props.searchResult.hitCount / this.state.pageSize);
        
        this.setState({pageCount: newPageCount, pageItems: []}, () => {
            let items = [];
            // Calculate first index to render. This depends on the current page index as well as the
            // total page count (which might be greater than the maximum number of buttons: 10).
            let pagesToRender =  Math.min(9, this.state.pageCount - 1);
            let firstIndex = Math.max(1, this.state.currentPageIndex - pagesToRender);
            let lastIndex = firstIndex + pagesToRender;
            for(let i = firstIndex; i <= lastIndex; i++){
                items.push(<Pagination.Item 
                    key={i} 
                    active={i === this.state.currentPageIndex}
                    onClick={() => this.goToPage(i)}>
                    {i}
                </Pagination.Item>)
            }
    
            this.setState({pageItems: [...this.state.pageItems, ...items]});
        });
    }

    goToPage = (pageNumber) => {
        this.setState({currentPageIndex: pageNumber}, () => {
            this.search();
        });
    }

    submit = (event) => {
        event.preventDefault();
        this.search(this.props.sortOrder);
    }

    // setSearchString = (event) => {
    //     let searchParams = queryStringToSearchParameters(event.target.value);
    //     this.props.setSearchParams(searchParams);
    // }

    toggleFilters = () => {
        this.props.toggleFilters();
        let symbol = this.props.showFilters ? ">" : "<";
        this.setState({expandSymbol: symbol}, () => {
            if(!this.props.showFilters){ // Invoke search when filters view is collapsed
                this.search(this.props.sortOrder);
            }
        });
    }

    /**
     * Handles input in hits per page field and rejets any
     * value < 1 and > 999, i.e. leading zeros are also rejected.
     */
    setPageSize = (e) => {
        const re = /^[0-9\b]{1,3}$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            let pageCount = parseInt(e.target.value);
            if(pageCount === 0){
                return;
            }
            this.setState({pageSize: e.target.value})
        }   
    }

    handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            this.setState({currentPageIndex: 1}, () => this.search());
        }
    }

    showSearchHelp = () => {
        window.open(`${process.env.REACT_APP_BASE_URL}/SearchHelp_en.html`, '_blank');
    }

    render(){

        var list = this.props.searchResult.logs.length === 0 ? "No search results" : this.props.searchResult.logs.map((item, index) => {
            return <SearchResultItem
                        key={index}
                        log={item}
                        childItem={false}
                        setCurrentLogEntry={this.props.setCurrentLogEntry}
                        selectedLogEntryId={this.props.selectedLogEntryId}/>
        });

        // console.log("search params in searchResultList:");
        // console.log(this.props.searchParams);

        return(
            <Container className="grid-item full-height" style={{paddingLeft: "5px", paddingRight: "5px"}} >
                <Form style={{paddingTop: "5px"}} onSubmit={(e) => this.submit(e)}>
                    <Form.Row>
                        <Col style={{flexGrow: "0"}}>
                            <Button size="sm" onClick={() => this.toggleFilters()}>{this.state.expandSymbol}</Button>
                        </Col>
                        <Col style={{paddingLeft: "0px"}}>
                        <SearchBox 
                            searchParams={this.props.searchParams}
                            setSearchParams={this.props.setSearchParams}
                            showFilters={this.props.showFilters}
                            theprops={this.props}
                        />
                        </Col>
                        <Col style={{flexGrow: "0" }}>
                            <Button 
                                size="sm"
                                onClick={(e) => this.showSearchHelp()}>
                                Help
                            </Button>
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

                    <div style={{overflowY: 'scroll', height: 'calc(80vh)'}}>
                        {list}
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
                                    value={this.state.pageSize}
                                    onChange={(e) => this.setPageSize(e)}
                                    />
                               </Col>
                            </Row>
                            <Row style={{visibility: this.state.pageCount < 2 ? 'hidden' : 'visible'}}>
                               <Col style={{marginTop: '13px', padding: '0px'}}>
                                <Pagination
                                    size='sm'> 
                                    <Pagination.First disabled={this.state.currentPageIndex === 1}
                                        onClick={() => this.goToPage(1)}
                                        style={{fontWeight: 'bold'}}>&#124;&lt;</Pagination.First>
                                    <Pagination.Prev  onClick={() => this.goToPage(this.state.currentPageIndex - 1)}
                                        disabled={this.state.currentPageIndex === 1}
                                        style={{fontWeight: 'bold'}} >&lt;</Pagination.Prev>
                                    {this.state.pageItems}
                                    <Pagination.Next onClick={() => this.goToPage(this.state.currentPageIndex + 1)} 
                                        disabled={this.state.currentPageIndex === this.state.pageCount}
                                        style={{fontWeight: 'bold'}}>&gt;</Pagination.Next>
                                    <Pagination.Last disabled={this.state.currentPageIndex === this.state.pageCount}
                                        onClick={() => this.goToPage(this.state.pageCount)}
                                        style={{fontWeight: 'bold'}}>&gt;&#124;</Pagination.Last>
                                    </Pagination>
                                </Col>
                                <Col style={{marginTop: '16px',  padding:'5px', maxWidth: '60px'}}>
                                    {this.state.currentPageIndex} / {this.state.pageCount}
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