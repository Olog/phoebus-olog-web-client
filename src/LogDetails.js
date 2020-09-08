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

import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import OlogMoment from './OlogMoment';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';

class LogDetails extends Component{

    state = {
        openInfo: false
    };

    render(){
        var logbooks = this.props.currentLogRecord && this.props.currentLogRecord.logbooks.sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
            return (
                <span key={index}>{row.name}&nbsp;</span>
            )}
        )

        var tags = this.props.currentLogRecord && this.props.currentLogRecord.tags.sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
            return (
                <span key={index}>row.name}&nbsp;</span>
            )}
        )

        var attachments = this.props.currentLogRecord && this.props.currentLogRecord.attachments.map((row, index) => {
            if(row.fileMetadataDescription === 'image'){
                return(
                    <ListGroup.Item key={index}>
                    <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_BASE_URL}/Olog/logs/attachments/` + this.props.currentLogRecord.id + "/" + row.filename}>
                        <Image key={index} src={`${process.env.REACT_APP_BASE_URL}/Olog/logs/attachments/` + this.props.currentLogRecord.id + "/" + row.filename} thumbnail/>
                    </a>
                    </ListGroup.Item>
                )
            }
            else{
                return (
                    <ListGroup.Item key={index}>
                    <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_BASE_URL}/Olog/logs/attachments/` + this.props.currentLogRecord.id + "/" + row.filename}>
                    {row.filename}
                    </a>
                    </ListGroup.Item>
                )}
            }
        )

        return(
            <div>
                {/* Render only of current log record is defined */}
                {this.props.currentLogRecord &&
                    <Container show={this.props.currentLogRecord}>
                        
                        <Accordion>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="0" onClick={() => this.setState({openInfo: !this.state.openInfo})}>
                                <b>{this.props.currentLogRecord.owner}, <OlogMoment date={this.props.currentLogRecord.createdDate}/></b>
                                &nbsp;{this.state.openInfo ? <FaChevronDown /> : <FaChevronRight/>}
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        Logbooks: {logbooks}<br/>
                                        Tags: {tags}<br/>
                                        Level: {this.props.currentLogRecord.level}<br/>
                                        Created Date: <OlogMoment date={this.props.currentLogRecord.createdDate}/>
                                    </Card.Body>
                                </Accordion.Collapse>
                                <Row>
                                    <Col>
                                        <h6>Description:</h6>
                                        {this.props.currentLogRecord.description}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h6>Attachments:</h6>
                                        <ListGroup>
                                        {attachments}
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </Card>
                        </Accordion>
                           
                    </Container>
                }
            </div>
        )
    }

}

export default LogDetails;
