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
import Table from 'react-bootstrap/Table';
import Property from './Property';
import { Remarkable } from 'remarkable';
//import prettify from 'pretty-remarkable';
import imageProcessor from './image-processor';

import './css/olog.css';



class LogDetails extends Component{


    remarkable = new Remarkable('full', {
        html:         false,        // Enable HTML tags in source
        xhtmlOut:     false,        // Use '/' to close single tags (<br />)
        breaks:       false,        // Convert '\n' in paragraphs into <br>
        langPrefix:   'language-',  // CSS language prefix for fenced blocks
        linkTarget:   '',           // set target to open link in
        // Enable some language-neutral replacements + quotes beautification
        typographer:  false,
      
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
        quotes: '“”‘’',
      });
    
    state = {
        openInfo: false
    };

    componentDidMount = () => {
        this.remarkable.use(imageProcessor);
    }


    getContent = (source) => {
        return {__html: this.remarkable.render(source)};
    }

    render(){
        var logbooks = this.props.currentLogRecord && this.props.currentLogRecord.logbooks.sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
            return (
                <span key={index}>{row.name},</span>
            )}
        )

        var tags = this.props.currentLogRecord && this.props.currentLogRecord.tags.sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
            return (
                <span key={index}>{row.name},</span>
            )}
        )

        var attachments = this.props.currentLogRecord && this.props.currentLogRecord.attachments.map((row, index) => {
            if(row.fileMetadataDescription.startsWith('image')){
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

        //var content = <div>{this.remarkable.render({this.props.currentLogRecord ? this.props.currentLogRecord.source : null})}</div>;

        var properties = 
            this.props.currentLogRecord && this.props.currentLogRecord.properties.map((row, index) => {
                return(
                   <Property key={index} property={row}/>
                )
            })

        return(
            <Container className="grid-item full-height">
               <h6>Log Details</h6>
                {/* Render only of current log record is defined */}
                {this.props.currentLogRecord &&
                        <Accordion className="list-item">
                            <Accordion.Toggle as={Card.Header} eventKey="0" onClick={() => this.setState({openInfo: !this.state.openInfo})}>
                            <b>{this.props.currentLogRecord.owner}, <OlogMoment date={this.props.currentLogRecord.createdDate}/></b>
                            &nbsp;{this.state.openInfo ? <FaChevronDown /> : <FaChevronRight/>}
                            </Accordion.Toggle>
                            
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Table bordered size="sm">
                                        <tbody>
                                            <tr><td style={{width: "100px"}}>Logbooks</td><td>{logbooks}</td></tr>
                                            <tr><td>Tags</td><td>{tags}</td></tr>
                                            <tr><td>Level</td><td>{this.props.currentLogRecord.level}</td></tr>
                                            <tr><td>Created Date</td><td><OlogMoment date={this.props.currentLogRecord.createdDate}/></td></tr>
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Accordion.Collapse>
                            <Table bordered size="sm">
                                <tbody>
                                    <tr><td style={{width: "100px"}}>Title</td><td>{this.props.currentLogRecord.title}</td></tr>
                                </tbody>
                            </Table>
                            <div 
                                dangerouslySetInnerHTML={this.getContent(this.props.currentLogRecord.source)}></div>
                            <Row>
                                <Col>
                                    <h6>Attachments:</h6>
                                    <ListGroup>
                                        {attachments}
                                    </ListGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h6>Properties:</h6>
                                    <ListGroup>
                                        {properties}
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Accordion>
                }
            </Container>
        )
    }

}

export default LogDetails;
