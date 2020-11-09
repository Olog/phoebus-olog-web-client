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
import Card from 'react-bootstrap/Card';
import Logbooks from './Logbooks';
import Tags from './Tags';
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import Container from 'react-bootstrap/Container';
import FormCheck from 'react-bootstrap/FormCheck';

/**
 * Component holding search criteria elements, i.e.
 * logbooks, tags and time range.
 */
class Filters extends Component{

    state = {
        openLogbooks: true,
        openTags: false,
        openTimespan: false,
        openFromTo: false,
        searchCriteria: {
            logbooks: [],
            tags: [],
            timeSpan: 1,
            from: null,
            to: null
          }
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
                const searchCriteriaCopy = {...this.state.searchCriteria};
                console.log(searchCriteriaCopy);
                this.props.search(searchCriteriaCopy);
            });
    }

    /**
     * Add or remove tag from search criteria.
     * @param {string} tagName 
     * @param {boolean} add 
     */
    addTagToSearchCriteria = (tagName, add) => {
        const copy = {...this.state.searchCriteria};
        if(add){
            copy.tags.push(tagName);
        }
        else{
            copy.tags = copy.tags.filter(item => item !== tagName);
        }
        this.setState({searchCriteria: copy});
    }

    timespanChanged = (event) => {
        const copy = {...this.state.searchCriteria};
        copy.timeSpan = parseInt(event.target.id);
        this.setState({searchCriteria: copy});
    }


    render(){

        let timeSpans = ["Last minute", "Last hour", "Last day", "Last week"];

        return(
            <Container className="grid-item full-height">
              <h6>Filter Log Entries</h6>
                <Accordion defaultActiveKey="0">
                    <Accordion.Toggle as={Card.Header} eventKey="0" onClick={() => this.setState({openLogbooks: !this.state.openLogbooks})}>
                        {this.state.openLogbooks ? <FaChevronDown /> : <FaChevronRight/> } LOGBOOKS
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                       <Logbooks 
                        logbooks={this.props.logbooks} 
                        searchCriteria={this.state.searchCriteria}
                        addLogbookToSearchCriteria={this.addLogbookToSearchCriteria}/>
                    </Accordion.Collapse>
                </Accordion>
                <Accordion>
                    <Accordion.Toggle as={Card.Header} eventKey="0" onClick={() => this.setState({openTags: !this.state.openTags})}>
                        {this.state.openTags ? <FaChevronDown /> : <FaChevronRight/> } TAGS
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                       <Tags tags={this.props.tags}
                            searchCriteria={this.state.searchCriteria}
                            addTagToSearchCriteria={this.addTagToSearchCriteria}/>
                    </Accordion.Collapse>
                </Accordion>
                <Accordion>
                    <Accordion.Toggle as={Card.Header} eventKey="0" onClick={() => this.setState({openTimespan: !this.state.openTimespan})}>
                        {this.state.openTimespan ? <FaChevronDown /> : <FaChevronRight/> } CREATED FROM
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <ul  className="olog-ul">
                            {timeSpans.map((timeSpan, index) => (
                                    <li key={index}>
                                        <FormCheck>
                                            <FormCheck.Input type="radio" 
                                                id={index + 1} // For some reason {index} does not work when index = 0.
                                                checked={this.state.searchCriteria.timeSpan === index + 1}
                                                onChange={this.timespanChanged}/>
                                            <FormCheck.Label>{timeSpan}</FormCheck.Label>
                                        </FormCheck>
                                    </li>
                            ))}
                        </ul>
                    </Accordion.Collapse>
                </Accordion>
                <Accordion>
                    <Accordion.Toggle as={Card.Header} eventKey="0" onClick={() => this.setState({openFromTo: !this.state.openFromTo})}>
                        {this.state.openFromTo ? <FaChevronDown /> : <FaChevronRight/> } CREATED FROM - TO
                    </Accordion.Toggle>
                </Accordion>
            </Container>
        )
    }
}

export default Filters;