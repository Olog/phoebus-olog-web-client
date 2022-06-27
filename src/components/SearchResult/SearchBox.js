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

import { Form, Col, Button } from "react-bootstrap"
import SearchBoxInput from "./SearchBoxInput"

const SearchBox = ({searchParams, setSearchParams, showFilters, setShowFilters}) => {
    
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
        < Form style={{paddingTop: "5px"}} onSubmit={(e) => submit(e)}>
            <Form.Row>
                <Col style={{flexGrow: "0"}}>
                    <Button size="sm" onClick={() => toggleFilters()}>{showFilters ? ">" : "<"}</Button>
                </Col>
                <Col style={{paddingLeft: "0px"}}>
                <SearchBoxInput
                    {...{searchParams, setSearchParams, showFilters}}
                />
                </Col>
                <Col style={{flexGrow: "0" }}>
                    <Button 
                        size="sm"
                        onClick={(e) => showSearchHelp()}>
                        Help
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
}

export default SearchBox;