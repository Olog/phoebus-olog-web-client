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

import { useState, useEffect } from 'react';
// import Collapse from 'react-bootstrap/Collapse';
import Collapse from './Collapse';
import Filters from '../Filters/Filters';
import Col from 'react-bootstrap/Col';
import { useDispatch } from 'react-redux';
import { updateSearchParams } from '../../features/searchParamsReducer';
import { updateSearchPageParams } from '../../features/searchPageParamsReducer';

const CollapsibleFilters = ({logbooks, tags, showFilters, searchParams, searchPageParams}) => {

    const [tempSearchParams, setTempSearchParams] = useState({...searchParams});
    const [tempSearchPageParams, setTempSearchPageParams] = useState({...searchPageParams});
    const dispatch = useDispatch();

    useEffect(() => {
        setTempSearchParams(searchParams);
        setTempSearchPageParams(searchPageParams);
    }, [searchParams, searchPageParams])

    const submitSearchParams = () => {
        dispatch(updateSearchParams(tempSearchParams));
        dispatch(updateSearchPageParams(tempSearchPageParams));
    }

    return (

        <Collapse show={showFilters} onExiting={submitSearchParams} className="p-1">
            <Col xs={{span: 12, order: 3}} lg={{span: 2, order: 1}} >
                <Filters
                    {...{
                        logbooks,
                        tags,
                        searchParams: tempSearchParams, setSearchParams: setTempSearchParams,
                        searchPageParams: tempSearchPageParams, setSearchPageParams: setTempSearchPageParams,
                        submitSearchParams: submitSearchParams
                    }}
                />
            </Col>
        </Collapse>
    );
}

export default CollapsibleFilters;