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
import {searchParamsToQueryString, queryStringToSearchParameters} from 'utils/searchParams';
import { useDispatch } from "react-redux";
import { forceUpdateSearchParams } from "features/searchParamsReducer";
import { StyledTextInput } from "components/shared/input/TextInput";
import VisuallyHiddenText from "components/shared/VisuallyHiddenText";

const SearchBoxInput = ({searchParams, showFilters, className}) => {

    const [searchString, setSearchString] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if(searchParams) {
            const copy = {...searchParams};
            if(copy.cacheBust) {
                delete copy.cacheBust;
            }
            setSearchString(searchParamsToQueryString(copy));
        }
    }, [searchParams]);

    const onChange = (event) => {
        setSearchString(event.target.value);
    };

    const onKeyDown = (event) => {
        if(event.key === 'Enter') {
            dispatch(forceUpdateSearchParams(queryStringToSearchParameters(searchString)));
        }
    }

    return (
        <>
            <VisuallyHiddenText><label htmlFor="search">Search</label></VisuallyHiddenText>
            <StyledTextInput size="sm" 
                name='search'
                type='search'
                disabled={showFilters}
                placeholder="No search string"
                style={{fontSize: "12px"}}
                value={searchString}
                onChange={(e) => onChange(e)}
                onKeyDown={onKeyDown}
                className={className}
            />
        </>
    );
}

export default SearchBoxInput;