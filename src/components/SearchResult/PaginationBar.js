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
import { StyledLabeledTextInput } from 'components/shared/input/TextInput';
import { Item, Next, Pagination, Prev } from 'components/Pagination';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateSearchPageParams } from 'features/searchPageParamsReducer';

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
        dispatch(updateSearchPageParams({...searchPageParams, from}));
        // TODO: Investigate / fix the circular looping here and remove es-lint disable
        // eslint-disable-next-line 
    }, [currentPageIndex, dispatch, searchPageParams.size]);

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
            items.push(<Item
                key={i} 
                active={i === currentPageIndex}
                onClick={() => goToPage(i)}
                aria-label={`Page ${i+1}`}
            >
                {i + 1}
            </Item>)
        }
        return items;
    }

    return (
        <Container>
            <PageSizeContainer>
                <StyledLabeledTextInput
                    name='pageSize'
                    label='Hits per page:'
                    value={searchPageParams.size}
                    onChange={(e) => setPageSize(e)}
                    inlineLabel
                />
            </PageSizeContainer>
            {pageCount >= 2 ? 
                <PaginationContainer>
                    <Pagination>
                        <Prev onClick={() => goToPage(currentPageIndex - 1)} 
                            disabled={currentPageIndex === 0}
                        />
                        {renderPaginationItems()}
                        <Next onClick={() => goToPage(currentPageIndex + 1)}
                            disabled={currentPageIndex + 1 === pageCount}
                        />
                    </Pagination>
                    <PagePosition>{`${currentPageIndex + 1} / ${pageCount}`}</PagePosition>
                </PaginationContainer>
            : null}
        </Container>
    );
}

export default PaginationBar;