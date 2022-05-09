/**
 * Copyright (C) 2019 European Spallation Source ERIC.
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
import React, {useEffect, useState} from 'react';
import Logbooks from '../Logbooks/Logbooks';
import Tags from '../Tags/Tags';
import { FaCalendarAlt } from "react-icons/fa";
import Container from 'react-bootstrap/Container';
import {setSearchParam, removeSearchParam, dateToString} from '../../utils/utils';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import DateTimePicker from 'react-datetime-picker';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import customization from '../../utils/customization';

/**
 * Component holding search criteria elements, i.e.
 * logbooks, tags and time range.
 */
// class Filters extends Component{
const Filters = ({logbooks, tags, searchParams, setSearchParams, sortOrder, setSortOrder}) => {

    // const [openLogbooks, setOpenLogBooks] = useState(false);
    // const [openTags, setOpenTags] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({
        logbooks: [], // Used by logbooks selector
        tags: []      // Used by tags selector
    });
    const [startDate, _setStartDate] = useState(new Date()); // Used by calendar component
    const [endDate, _setEndDate] = useState(new Date()); // Used by calendar component
    const [showSelectStartTime, setShowSelectStartTime] = useState(false);
    const [showSelectEndTime, setShowSelectEndTime] = useState(false);
    // state = {
    //     openLogbooks: false,
    //     openTags: false,
    //     searchCriteria: {
    //         logbooks: [], // Used by logbooks selector
    //         tags: []      // Used by tags selector
    //       },
    //     startDate: new Date(), // Used by calendar component
    //     endDate: new Date(),   // Used by calendar component
    //     showSelectStartTime: false,
    //     showSelectEndTime: false
    // };

    useEffect(() => {
        let updatedSearchParams = {};
        let logbooksString = searchCriteria.logbooks.join(",");
        console.log("logbooks string")
        console.log(logbooksString)
        if(logbooksString !== ''){
            updatedSearchParams = setSearchParam(searchParams, 'logbooks', logbooksString);
        }
        else{
            updatedSearchParams = removeSearchParam(searchParams, 'logbooks');
        }
        setSearchParams(updatedSearchParams);
    }, [searchCriteria.logbooks, searchParams.logbooks, setSearchParams]);

    useEffect(() => {
        let updatedSearchParams = {};
        let tagsString = searchCriteria.tags.join(",");
        if(tagsString !== ''){
            updatedSearchParams = setSearchParam(searchParams, 'tags', tagsString);
        }
        else{
            updatedSearchParams = removeSearchParam(searchParams, 'tags');
        }
        setSearchParams(updatedSearchParams);
    }, [searchCriteria.tags, searchParams.tags, setSearchParams]);

    /**
     * Update tags search criteria, idempotently
     * @param {array} tags
     */
    const updateLogbookSearchCriteria = (logs) => {
        if(logs) {
            let copy = {...searchCriteria}
            copy.logbooks = logs;
            setSearchCriteria(copy);
        }
    }

    /**
     * Update tags search criteria, idempotently
     * @param {array} tags
     */
    const updateTagSearchCriteria = (tags) => {
        if(tags) {
            let copy = {...searchCriteria}
            copy.tags = tags;
            // this.setState({searchCriteria: copy}, () =>  { 
            // setSearchCriteria(copy, () => {
            //     let searchParams = {};
            //     let tagsString = searchCriteria.tags.join(",");
            //     if(tagsString !== ''){
            //     searchParams = setSearchParam(searchParams, 'tags', tagsString);
            //     }
            //     else{
            //     searchParams = removeSearchParam(searchParams, 'tags');
            //     }
            //     setSearchParams(searchParams);
            // });
            setSearchCriteria(copy);
        }
    }

    const setStartDate = (value) => {
        let start = dateToString(value);
        let _searchParams = setSearchParam(searchParams, 'start', start);
        setSearchParams(_searchParams);
        // this.setState({startDate: value}); 
        _setStartDate(value); // This is for the calendar component only
    }

    const setEndDate = (value) => {
        let end = dateToString(value);
        let _searchParams = setSearchParam(searchParams, 'end', end);
        setSearchParams(_searchParams);
        // this.setState({endDate: value}); 
        _setEndDate(value); // This is for the calendar component only
    }

    const applyAndClose = () => {
        // this.setState({showSelectStartTime: false, showSelectEndTime: false});
        setShowSelectStartTime(false);
        setShowSelectEndTime(false);
    }

    const inputChanged = (event, key) => {
      let searchParams = {};
      if(event.target.value !== ''){
        searchParams = setSearchParam(searchParams, key, event.target.value);
      }
      else{
        searchParams = removeSearchParam(searchParams, key);
      }
      setSearchParams(searchParams);
    }

    
    return(
        <>
        <Container className="grid-item filters full-height" style={{padding: "8px"}}>
            <Table size="sm" className="search-fields-table">
                <tbody>
                    <tr>
                        <td colSpan="2">Title:</td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <Form.Control size="sm"
                                type="text"
                                value={searchParams['title'] || ''}
                                onChange={(e) => inputChanged(e, 'title')}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">Text:</td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <Form.Control size="sm"
                                type="text"
                                value={searchParams['text'] || ''}
                                onChange={(e) => inputChanged(e, 'text')}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">{customization.level}:</td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <Form.Control size="sm"
                                type="text"
                                value={searchParams['level'] || ''}
                                onChange={(e) => inputChanged(e, 'level')}/>
                        </td>
                    </tr>
                    <tr>
                        <td>Logbooks:</td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <Logbooks
                            logbooks={logbooks}
                            searchCriteria={searchCriteria}
                            updateLogbookSearchCriteria={updateLogbookSearchCriteria}/>
                        </td>
                    </tr>
                    <tr>
                        <td>Tags:</td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <Tags tags={tags}
                                        searchCriteria={searchCriteria}
                                        updateTagSearchCriteria={updateTagSearchCriteria}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">Author:</td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <Form.Control size="sm"
                                type="text"
                                value={searchParams['owner'] || ''}
                                onChange={(e) => inputChanged(e, 'owner')}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">Start Time:</td>
                    </tr>
                    <tr>
                        <td style={{width: "100%"}}>
                        <Form.Control size="sm"
                            type="text"
                            value={searchParams['start'] || ''}
                            onChange={(e) => inputChanged(e, 'start')}/>
                        </td>
                        {/* <td><Button size="sm" onClick={() => this.setState({showSelectStartTime: true})}><FaCalendarAlt/></Button></td> */}
                        <td><Button size="sm" onClick={() => setShowSelectStartTime(true)}><FaCalendarAlt/></Button></td>
                    </tr>
                    <tr>
                        <td style={{width: "40px"}}>End Time:</td>
                    </tr>
                    <tr>
                        <td style={{width: "100%"}}>
                        <Form.Control size="sm"
                            type="text"
                            value={searchParams['end'] || ''}
                            onChange={(e) => inputChanged(e, 'end')}/>
                        </td>
                        {/* <td><Button size="sm" onClick={() => this.setState({showSelectEndTime: true})}><FaCalendarAlt/></Button></td> */}
                        <td><Button size="sm" onClick={() => setShowSelectEndTime(true)}><FaCalendarAlt/></Button></td>
                    </tr>
                    <tr>
                        <td><Form.Check style={{paddingTop: "5px"}}
                                type='radio'
                                checked={sortOrder === 'down'}
                                label='Sort descending on date'
                                onChange={(e) => setSortOrder("down")}/>
                        </td>
                    </tr>
                    <tr>
                        <td><Form.Check 
                                type='radio'
                                label='Sort ascending on date'
                                checked={sortOrder === 'up'}
                                onChange={(e) => setSortOrder("up")}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">Attachments:</td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <Form.Control size="sm"
                                type="text"
                                value={searchParams['attachments'] || ''}
                                onChange={(e) => inputChanged(e, 'attachments')}/>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Container>
        {
        // <Modal show={showSelectStartTime} onHide={() => this.setState({showSelectStartTime: false})}>
        <Modal show={showSelectStartTime} onHide={() => setShowSelectStartTime(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Select Start Time</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <DateTimePicker
                onChange={(value) => setStartDate(value)}
                style={{width:30}}
                value={startDate}
                format='y-MM-dd HH:mm'
                clearIcon=""
                disableClock></DateTimePicker>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" type="submit" onClick={() => applyAndClose()}>
                    Apply
            </Button>
            {/* <Button variant="secondary" type="button" onClick={() => this.setState({showSelectStartTime: false})}> */}
            <Button variant="secondary" type="button" onClick={() => setShowSelectStartTime(false)}>
                    Cancel
            </Button>
            </Modal.Footer>
        </Modal>
        }
        {
        <Modal show={showSelectEndTime}
                // onHide={() => this.setState({showSelectEndTime: false})}
                onHide={() => showSelectEndTime(false)}
            >
            <Modal.Header closeButton>
                <Modal.Title>Select End Time</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DateTimePicker
                onChange={(value) => setEndDate(value)}
                value={endDate}
                format='y-MM-dd HH:mm'
                clearIcon=""
                disableClock></DateTimePicker>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" onClick={() => applyAndClose()}>
                        Apply
                </Button>
                {/* <Button variant="secondary" type="button" onClick={() => this.setState({showSelectEndTime: false})}> */}
                <Button variant="secondary" type="button" onClick={() => setShowSelectEndTime(false)}>
                        Cancel
                </Button>
            </Modal.Footer>
        </Modal>
        }
        </>
    );
}

export default Filters;