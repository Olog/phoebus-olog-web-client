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
import React, {Component} from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Logbooks from './Logbooks'
import Tags from './Tags'
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import Container from 'react-bootstrap/Container'

class Filters extends Component{

    state = {
        openLogbooks: true,
        openTags: false,
        openTimespan: false,
        openFromTo: false
    };

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
                       <Logbooks logbooks={this.props.logbooks} getLogRecords={this.props.getLogRecords}/>
                    </Accordion.Collapse>
                </Accordion>
                <Accordion>
                    <Accordion.Toggle as={Card.Header} eventKey="0" onClick={() => this.setState({openTags: !this.state.openTags})}>
                        {this.state.openTags ? <FaChevronDown /> : <FaChevronRight/> } TAGS
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                       <Tags tags={this.props.tags}/>
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
                                        <Button style={{padding: "0px", fontSize: "12px"}} variant="link" >{timeSpan}</Button>
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