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
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateSearchPageParams } from 'features/searchPageParamsReducer';
import PageSizeInput from './PageSizeInput';
import { Box, Pagination, Stack, Typography } from '@mui/material';

const PaginationBar = ({searchResults, searchPageParams}) => {

    const [pageCount, setPageCount] = useState(0);
    const [currentPageIndex, setCurrentPageIndex] = useState(1);
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


    const isMobile = useMediaQuery({ query: '(max-width: 539px)' });

    let maxPaginationItems = 6;
    if(isMobile) {
        maxPaginationItems = 3;
    }

    let paginationPage = Math.floor(currentPageIndex / maxPaginationItems);
    let firstIndex = paginationPage * maxPaginationItems;
    const pagesToRender = Math.min(pageCount - firstIndex, maxPaginationItems);

    return (
        <Stack padding={1} >
            <Box>
                <PageSizeInput 
                    initialValue={searchPageParams.size}
                    onValidChange={(value) => dispatch(updateSearchPageParams({...searchPageParams, size: value}))}
                />
            </Box>
            {pageCount >= 2 ? 
                <Stack flexDirection="row" alignItems="center" justifyContent="center" gap={0.5}>
                    <Pagination 
                        page={currentPageIndex + 1}
                        count={pagesToRender}
                        onChange={(event, value) => { setCurrentPageIndex(value - 1)}}
                        variant="outlined"
                        shape="rounded"
                        color="primary"
                    />
                    <Typography fontSize={"0.875rem"}>{`${currentPageIndex + 1} / ${pageCount}`}</Typography>
                </Stack>
            : null}
        </Stack>
    );
}

export default PaginationBar;