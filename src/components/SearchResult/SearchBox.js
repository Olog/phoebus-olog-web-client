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

import styled from "styled-components"
import Button from "components/shared/Button"
import SearchBoxInput from "./SearchBoxInput"

const Container = styled.div`
    width: 100%;
    padding: 0.25rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    & > .searchbox {
        display: flex;
        gap: 0.25rem; 
    }
    & .advanced-search {
        display: flex;
        justify-content: flex-end;
    }
`

const StyledSearchBoxInput = styled(SearchBoxInput)`
    display: block;
    flex-grow: 1;
`

const FilterLinkToggle = styled.button`
    padding: 0;
    border: none;
    background: none;
    color: blue;
    font-style: italic;
    &:hover {
        text-decoration: underline;
        cursor: pointer;
    }
`

const HelpButton = styled(Button)`
    padding: 0 1rem;
`

const SearchBox = ({searchParams, showFilters, setShowFilters, className}) => {

    const toggleFilters = (e) => {
        setShowFilters(!showFilters)
    }

    const showSearchHelp = () => {
        window.open(`${process.env.REACT_APP_BASE_URL}/SearchHelp_en.html`, '_blank');
    }
    
    return (
        <Container className={className} >
            <div className="searchbox">
                <StyledSearchBoxInput
                    {...{searchParams, showFilters, isFetching: true}}
                />
                <HelpButton variant='secondary' onClick={(e) => showSearchHelp()}>Help</HelpButton>
            </div>
            <div className="advanced-search">
                <FilterLinkToggle type="button" onClick={(e) => toggleFilters(e)} aria-expanded={showFilters} >{showFilters ? "Hide Advanced Search" : "Show Advanced Search"}</FilterLinkToggle>
            </div>
        </Container>
    );
}

export default SearchBox;