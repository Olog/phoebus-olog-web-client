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
import { useMediaQuery } from 'react-responsive';

const PaginationBar = ({pageCount, currentPageIndex, goToPage, searchPageParams, setPageSize}) => {

    const isMobile = useMediaQuery({ query: '(max-width: 539px)' })

    let maxPaginationItems = 6;
    if(isMobile) {
        maxPaginationItems = 3;
    }

    const renderPaginationItems = () => {

        let paginationPage = Math.floor(currentPageIndex / maxPaginationItems);

        let firstIndex = paginationPage * maxPaginationItems;
        let pagesToRender = Math.min(pageCount - firstIndex, maxPaginationItems);
        let lastIndex = firstIndex + (pagesToRender);

        let items = [];
        for(let i = firstIndex; i < lastIndex; i++){
            items.push(<Pagination.Item 
                key={i} 
                active={i === currentPageIndex}
                onClick={() => goToPage(i)}>
                {i + 1}
            </Pagination.Item>)
        }
        return items;
    }

    return (
        <Container fluid className="py-2" >
            <Row className="p-2">
                <Col className="d-flex align-items-center justify-content-between p-0 pr-1" >
                    <Col className="d-flex align-items-center p-0 pr-1" xs='auto' >
                        <Form.Label className="inline-block align-middle m-0 text-nowrap" >Hits per page:</Form.Label> 
                        <Col style={{padding: '0px', maxWidth: '40px'}}>
                            <Form.Control size="sm" 
                                type="input"
                                value={searchPageParams.size}
                                onChange={(e) => setPageSize(e)}
                                
                                />
                        </Col>
                    </Col>
                    <Col sm={'auto'} style={{visibility: pageCount < 2 ? 'hidden' : 'visible'}} className="d-flex align-items-center justify-content-end px-0">
                        <Pagination size='sm' className="m-0"> 
                            <Pagination.Prev  onClick={() => goToPage(currentPageIndex - 1)} 
                                disabled={currentPageIndex === 0}
                                style={{fontWeight: 'bold'}} >&lt;</Pagination.Prev>
                            {renderPaginationItems()}
                            <Pagination.Next onClick={() => goToPage(currentPageIndex + 1)}
                                disabled={currentPageIndex === pageCount - 1}
                                style={{fontWeight: 'bold'}}>&gt;</Pagination.Next>
                        </Pagination>
                        <Col sm={'auto'} className='align-middle text-center px-0 pl-2' style={{flexGrow: 0, maxWidth: '2.5rem'}}>
                            {`${currentPageIndex + 1} / ${pageCount}`}
                        </Col>
                    </Col>
                </Col>
                
            </Row>
        </Container>
    );
}

export default PaginationBar;