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

import React, { useEffect } from "react";

import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import {searchParamsToQueryString, queryStringToSearchParameters} from '../../utils/searchParams';
import Tooltip from 'react-bootstrap/Tooltip';
import { useDispatch } from "react-redux";
import { updateSearchParams } from "../../features/searchParamsReducer";
import styled from "styled-components";
import { StyledTextInput } from "../input/TextInput";

const StyledInput = styled(StyledTextInput)`
    width: 100%;
    height: 100%;
`

const SearchBoxInput = ({searchParams, showFilters, className}) => {

    const [searchString, setSearchString] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if(searchParams) {
            setSearchString(searchParamsToQueryString(searchParams));
        }
    }, [searchParams]);

    const onChange = (event) => {
        setSearchString(event.target.value);
    };

    const onKeyDown = (event) => {
        if(event.key === 'Enter') {
            dispatch(updateSearchParams(queryStringToSearchParameters(searchString)));
        }
    }

    return (
        // <OverlayTrigger delay={{ hide: 750, show: 300 }}
        //         overlay={(props) => (
        //             <Tooltip {...props}>Edit and press Enter to search</Tooltip>
        //         )}
        //         rootClose
        //         placement="bottom"
        //         className={className}
        // >
        // <div className={className}>
        // </div>
            <StyledTextInput size="sm" 
                name='search'
                type="input"
                disabled={showFilters}
                placeholder="No search string"
                style={{fontSize: "12px"}}
                value={searchString}
                onChange={(e) => onChange(e)}
                onKeyDown={onKeyDown}
            />
        // </OverlayTrigger>
    );
}

export default SearchBoxInput;