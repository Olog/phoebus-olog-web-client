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

import { Pagination, Container, Row, Col, Form } from "react-bootstrap";

const PaginationBar = ({pageCount, currentPageIndex, goToPage, searchPageParams, setPageSize}) => {

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
        if(items.length >= 4) {
            items = [items.slice(0, 3), <Pagination.Ellipsis disabled />];
        }
        return items;
    }

    return (
        <Container fluid className="py-2" >
            <Row className="px-2 pb-2">
                <Col style={{padding: '0px', maxWidth: '90px'}} className="d-flex align-items-center">
                    <Form.Label className="inline-block align-middle m-0" >Hits per page: </Form.Label> 
                </Col>
                <Col style={{padding: '0px', maxWidth: '50px'}}>
                    <Form.Control size="sm" 
                        type="input"
                        value={searchPageParams.size}
                        onChange={(e) => setPageSize(e)}
                        />
                </Col>
            </Row>
            <Row style={{visibility: pageCount < 2 ? 'hidden' : 'visible'}} className="px-2 align-items-center justify-content-between flex-nowrap" >
                <Col sm={'auto'} className="px-0">
                        <Pagination size='sm' className="m-0"> 
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
                <Col sm={'auto'} className='align-middle text-center'>
                    {`${currentPageIndex} / ${pageCount}`}
                </Col>
            </Row>
        </Container>
    );
}

export default PaginationBar;