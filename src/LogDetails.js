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
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Property from './Property';
import { Remarkable } from 'remarkable';
import imageProcessor from './image-processor';
import LogDetailsMetaData from './LogDetailsMetaData';
import './css/olog.css';
import customization from './customization';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * A view show all details of a log entry. Images are renderd, if such are
 * present. Other types of attachments are rendered as links.
 */
class LogDetails extends Component{

    remarkable = new Remarkable('full', {
        html:         false,        // Enable HTML tags in source
        xhtmlOut:     false,        // Use '/' to close single tags (<br />)
        breaks:       false,        // Convert '\n' in paragraphs into <br>
        langPrefix:   'language-',  // CSS language prefix for fenced blocks
        linkTarget:   '',           // set target to open link in
        // Enable some language-neutral replacements + quotes beautification
        typographer:  false,
      });
    
    state = {
        openInfo: false,
        attachmentVisible: false
    };

    componentDidMount = () => {
        this.remarkable.use(imageProcessor, {urlPrefix: customization.urlPrefix});
    }

    getContent = (source) => {
        return {__html: this.remarkable.render(source)};
    }

    render(){
        var attachments = this.props.currentLogRecord && this.props.currentLogRecord.attachments.map((row, index) => {
            if(row.fileMetadataDescription.startsWith('image')){
                return(
                    <ListGroup.Item key={index}>
                    <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_BASE_URL}/logs/attachments/` + this.props.currentLogRecord.id + "/" + row.filename}>
                        <Image key={index} src={`${process.env.REACT_APP_BASE_URL}/logs/attachments/` + this.props.currentLogRecord.id + "/" + row.filename} thumbnail/>
                    </a>
                    </ListGroup.Item>
                )
            }
            else{
                return (
                    <ListGroup.Item key={index}>
                    <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_BASE_URL}/logs/attachments/` + this.props.currentLogRecord.id + "/" + row.filename}>
                    {row.filename}
                    </a>
                    </ListGroup.Item>
                )}
            }
        );
        
        var properties = 
            this.props.currentLogRecord && this.props.currentLogRecord.properties.map((row, index) => {
                return(
                   <Property key={index} property={row}/>
                )
            });
        

        return(
            <Container className="grid-item full-height">
                {/* Render only of current log record is defined */}
                {this.props.currentLogRecord &&
                    <>
                        <h6 className="log-details-title">{this.props.currentLogRecord.title}</h6>
                        <LogDetailsMetaData currentLogRecord={this.props.currentLogRecord}/>
                        <div style={{paddingTop: "5px", wordWrap: "break-word"}} className="olog-table"
                            dangerouslySetInnerHTML={this.getContent(this.props.currentLogRecord.source)}>
                        </div>
                        {
                            this.props.currentLogRecord.attachments.length > 0 &&
                            <>
                            <Accordion>
                                <Accordion.Toggle as={Card.Header} eventKey="0" 
                                onClick={() => this.setState({attachmentVisible: !this.state.attachmentVisible})}>
                                {this.state.attachmentVisible ? <FaChevronDown /> : <FaChevronRight/> } Attachments
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <ListGroup>
                                        {attachments}
                                    </ListGroup>
                                </Accordion.Collapse>
                            </Accordion>
                            </>
                        }
                        {
                            this.props.currentLogRecord.properties.length > 0 &&
                            <Row>
                                <Col>
                                    <h6>Properties:</h6>
                                    <ListGroup>
                                        {properties}
                                    </ListGroup>
                                </Col>
                            </Row>
                        }
                    </>
                }
            </Container>
        )
    }

}

export default LogDetails;
