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

import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { PaginationItem, Next, Pagination, Prev } from 'components/Pagination';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateSearchPageParams } from 'features/searchPageParamsReducer';
import PageSizeInput from './PageSizeInput';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 0.5rem;
`

const PageSizeContainer = styled.div`

`

const PaginationContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
`

const PagePosition = styled.div`
    white-space: nowrap;
`

const PaginationBar = ({searchResults, searchPageParams}) => {

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
        // dispatch only if different, to prevent infinite loop
        if(searchPageParams.from !== from) {
            dispatch(updateSearchPageParams({...searchPageParams, from}));
        }
    }, [currentPageIndex, dispatch, searchPageParams]);

    const goToPage = (pageNumber) => {
        if(pageNumber >= 0) {
            setCurrentPageIndex(pageNumber);
        };
    }

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
            const isCurrentPage = i === currentPageIndex;
            items.push(<PaginationItem
                key={i} 
                active={isCurrentPage}
                onClick={() => {
                    if(!isCurrentPage) {
                        goToPage(i)
                    }
                }}
                label={`go to page ${i+1}`}
            >
                {i + 1}
            </PaginationItem>)
        }
        return items;
    }

    const prevDisabled = currentPageIndex === 0;
    const nextDisabled = currentPageIndex + 1 === pageCount;
    const onClickPreviousPage = () => {
        if(!prevDisabled) {
            goToPage(currentPageIndex - 1);
        }
    }
    const onClickNextPage = () => {
        if(!nextDisabled) {
            goToPage(currentPageIndex + 1);
        }
    }

    return (
        <Container>
            <PageSizeContainer>
                <PageSizeInput 
                    initialValue={searchPageParams.size}
                    onValidChange={(value) => dispatch(updateSearchPageParams({...searchPageParams, size: value}))}
                />
            </PageSizeContainer>
            {pageCount >= 2 ? 
                <PaginationContainer>
                    <Pagination>
                        <Prev onClick={onClickPreviousPage} disabled={prevDisabled} />
                        {renderPaginationItems()}
                        <Next onClick={onClickNextPage} disabled={nextDisabled} />
                    </Pagination>
                    <PagePosition>{`${currentPageIndex + 1} / ${pageCount}`}</PagePosition>
                </PaginationContainer>
            : null}
        </Container>
    );
}

export default PaginationBar;