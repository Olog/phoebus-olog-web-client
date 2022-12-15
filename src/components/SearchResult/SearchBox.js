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
import Button from "../common/Button"
import SearchBoxInput from "./SearchBoxInput"

const Form = styled.form`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem
    // height: 100%;
`

const StyledSearchBoxInput = styled(SearchBoxInput)`
    display: block;
    flex-grow: 1;
    background-color: green;
`

const FilterButton = styled(Button)`
    height: 2rem;
`

const HelpButton = styled(Button)`
    height: 2rem;
`

const SearchBox = ({searchParams, showFilters, setShowFilters}) => {
    
    const toggleFilters = () => {
        setShowFilters(!showFilters)
    }

    const showSearchHelp = () => {
        window.open(`${process.env.REACT_APP_BASE_URL}/SearchHelp_en.html`, '_blank');
    }

    // prevent default to e.g. prevent page reload
    // do NOT trigger search here, as the SearchBox
    // component already triggers this by updating 
    // the searchParams state.
    const submit = (event) => {
        event.preventDefault();
    }
    
    return (
        <Form onSubmit={(e) => submit(e)}>
            <FilterButton variant='secondary' onClick={() => toggleFilters()} aria-label="Show Search Filters" >{showFilters ? ">" : "<"}</FilterButton>
            <StyledSearchBoxInput
                {...{searchParams, showFilters}}
            />
            <HelpButton variant='secondary' onClick={(e) => showSearchHelp()}>Help</HelpButton>
        </Form>
    );
}

export default SearchBox;