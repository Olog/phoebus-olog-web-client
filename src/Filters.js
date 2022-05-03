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
import React, {Component} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Logbooks from './Logbooks';
import Tags from './Tags';
import { FaChevronRight, FaChevronDown, FaCalendarAlt } from "react-icons/fa";
import Container from 'react-bootstrap/Container';
import {setSearchParam, removeSearchParam, dateToString} from './utils';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import DateTimePicker from 'react-datetime-picker';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import customization from './customization';

/**
 * Component holding search criteria elements, i.e.
 * logbooks, tags and time range.
 */
class Filters extends Component{

    state = {
        openLogbooks: false,
        openTags: false,
        searchCriteria: {
            logbooks: [], // Used by logbooks selector
            tags: []      // Used by tags selector
          },
        startDate: new Date(), // Used by calendar component
        endDate: new Date(),   // Used by calendar component
        showSelectStartTime: false,
        showSelectEndTime: false
    };

    /**
     * Add or remove logbook from search criteria.
     * @param {string} logbookName 
     * @param {boolean} add 
     */
    addLogbookToSearchCriteria = (logbookName, add) => {
        const copy = {...this.state.searchCriteria};
        if(add){
            copy.logbooks.push(logbookName);
        }
        else{
            copy.logbooks = copy.logbooks.filter(item => item !== logbookName);
        }
        this.setState({searchCriteria: copy}, 
            () =>  {
                let searchParams = {};
                let logbooksString = this.state.searchCriteria.logbooks.join(",");
                if(logbooksString !== ''){
                    searchParams = setSearchParam(this.props.searchParams, 'logbooks', logbooksString);
                }
                else{
                    searchParams = removeSearchParam(this.props.searchParams, 'logbooks');
                }
                this.props.setSearchParams(searchParams);
            });
    }

    /**
     * Update tags search criteria, idempotently
     * @param {array} tags
     */
    updateLogbookSearchCriteria = (logs) => {
        console.log(logs);
        if(logs) {
            let copy = {...this.state.searchCriteria}
            copy.logs = logs;
            this.setState({searchCriteria: copy}, () =>  { 
                let searchParams = {};
                let logsString = this.state.searchCriteria.logs.join(",");
                if(logsString !== ''){
                searchParams = setSearchParam(this.props.searchParams, 'logbooks', logsString);
                }
                else{
                searchParams = removeSearchParam(this.props.searchParams, 'logbooks');
                }
                this.props.setSearchParams(searchParams);
            });
        }
    }

    /**
     * Update tags search criteria, idempotently
     * @param {array} tags
     */
    updateTagSearchCriteria = (tags) => {
        if(tags) {
            let copy = {...this.state.searchCriteria}
            copy.tags = tags;
            this.setState({searchCriteria: copy}, () =>  { 
                let searchParams = {};
                let tagsString = this.state.searchCriteria.tags.join(",");
                if(tagsString !== ''){
                searchParams = setSearchParam(this.props.searchParams, 'tags', tagsString);
                }
                else{
                searchParams = removeSearchParam(this.props.searchParams, 'tags');
                }
                this.props.setSearchParams(searchParams);
            });
        }
    }

    setStartDate = (value) => {
        let start = dateToString(value);
        let searchParams = setSearchParam(this.props.searchParams, 'start', start);
        this.props.setSearchParams(searchParams);
        this.setState({startDate: value}); // This is for the calendar component only
    }

    setEndDate = (value) => {
        let end = dateToString(value);
        let searchParams = setSearchParam(this.props.searchParams, 'end', end);
        this.props.setSearchParams(searchParams);
        this.setState({endDate: value}); // This is for the calendar component only
    }

    applyAndClose = () => {
        this.setState({showSelectStartTime: false, showSelectEndTime: false});
    }

    inputChanged = (event, key) => {
      let searchParams = {};
      if(event.target.value !== ''){
        searchParams = setSearchParam(this.props.searchParams, key, event.target.value);
      }
      else{
        searchParams = removeSearchParam(this.props.searchParams, key);
      }
      this.props.setSearchParams(searchParams);
    }

    render(){
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
                                    value={this.props.searchParams['title'] || ''}
                                    onChange={(e) => this.inputChanged(e, 'title')}/>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">Text:</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <Form.Control size="sm"
                                    type="text"
                                    value={this.props.searchParams['text'] || ''}
                                    onChange={(e) => this.inputChanged(e, 'text')}/>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">{customization.level}:</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <Form.Control size="sm"
                                    type="text"
                                    value={this.props.searchParams['level'] || ''}
                                    onChange={(e) => this.inputChanged(e, 'level')}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Logbooks:</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <Logbooks
                                logbooks={this.props.logbooks}
                                searchCriteria={this.state.searchCriteria}
                                updateLogbookSearchCriteria={this.updateLogbookSearchCriteria}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Tags:</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <Tags tags={this.props.tags}
                                            searchCriteria={this.state.searchCriteria}
                                            updateTagSearchCriteria={this.updateTagSearchCriteria}/>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">Author:</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <Form.Control size="sm"
                                    type="text"
                                    value={this.props.searchParams['owner'] || ''}
                                    onChange={(e) => this.inputChanged(e, 'owner')}/>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">Start Time:</td>
                        </tr>
                        <tr>
                            <td style={{width: "100%"}}>
                            <Form.Control size="sm"
                                type="text"
                                value={this.props.searchParams['start'] || ''}
                                onChange={(e) => this.inputChanged(e, 'start')}/>
                            </td>
                            <td><Button size="sm" onClick={() => this.setState({showSelectStartTime: true})}><FaCalendarAlt/></Button></td>
                        </tr>
                        <tr>
                            <td style={{width: "40px"}}>End Time:</td>
                        </tr>
                        <tr>
                            <td style={{width: "100%"}}>
                            <Form.Control size="sm"
                                type="text"
                                value={this.props.searchParams['end'] || ''}
                                onChange={(e) => this.inputChanged(e, 'end')}/>
                            </td>
                            <td><Button size="sm" onClick={() => this.setState({showSelectEndTime: true})}><FaCalendarAlt/></Button></td>
                        </tr>
                        <tr>
                            <td><Form.Check style={{paddingTop: "5px"}}
                                    type='radio'
                                    checked={this.props.sortOrder === 'down'}
                                    label='Sort descending on date'
                                    onChange={(e) => this.props.setSortOrder("down")}/>
                            </td>
                        </tr>
                        <tr>
                            <td><Form.Check 
                                    type='radio'
                                    label='Sort ascending on date'
                                    checked={this.props.sortOrder === 'up'}
                                    onChange={(e) => this.props.setSortOrder("up")}/>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">Attachments:</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <Form.Control size="sm"
                                    type="text"
                                    value={this.props.searchParams['attachments'] || ''}
                                    onChange={(e) => this.inputChanged(e, 'attachments')}/>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
            {
            <Modal show={this.state.showSelectStartTime} onHide={() => this.setState({showSelectStartTime: false})}>
               <Modal.Header closeButton>
                   <Modal.Title>Select Start Time</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                <DateTimePicker
                   onChange={(value) => this.setStartDate(value)}
                   style={{width:30}}
                   value={this.state.startDate}
                   format='y-MM-dd HH:mm'
                   clearIcon=""
                   disableClock></DateTimePicker>
               </Modal.Body>
               <Modal.Footer>
               <Button variant="primary" type="submit" onClick={() => this.applyAndClose()}>
                     Apply
               </Button>
               <Button variant="secondary" type="button" onClick={() => this.setState({showSelectStartTime: false})}>
                     Cancel
               </Button>
             </Modal.Footer>
            </Modal>
            }
            {
            <Modal show={this.state.showSelectEndTime}
                    onHide={() => this.setState({showSelectEndTime: false})}>
                <Modal.Header closeButton>
                   <Modal.Title>Select End Time</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                 <DateTimePicker
                   onChange={(value) => this.setEndDate(value)}
                   value={this.state.endDate}
                   format='y-MM-dd HH:mm'
                   clearIcon=""
                   disableClock></DateTimePicker>
               </Modal.Body>
               <Modal.Footer>
                   <Button variant="primary" type="submit" onClick={() => this.applyAndClose()}>
                         Apply
                   </Button>
                   <Button variant="secondary" type="button" onClick={() => this.setState({showSelectEndTime: false})}>
                         Cancel
                   </Button>
               </Modal.Footer>
            </Modal>
            }
            </>
        )
    }
}

export default Filters;
