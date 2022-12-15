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
    gap: 0.5rem;
`

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
            items.push(<Item
                key={i} 
                active={i === currentPageIndex}
                onClick={() => goToPage(i)}
                alt={`Page ${i+1}`}
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
                            disabled={currentPageIndex === pageCount - 1}
                        />
                    </Pagination>
                    <div>{`${currentPageIndex + 1} / ${pageCount}`}</div>
                </PaginationContainer>
            : null}
        </Container>
    );
}

export default PaginationBar;