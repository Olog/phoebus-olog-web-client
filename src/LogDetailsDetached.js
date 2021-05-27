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
class LogDetailsDetached extends Component{

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
        attachmentVisible: false,
        currentLogRecord: null,
        currentLogEntryId: 0,
        showError: false
    };

    componentDidMount = () => {
        this.remarkable.use(imageProcessor, {urlPrefix: customization.urlPrefix});      
        this.setState({currentLogEntryId: this.props.match.params.id}, this.loadLogEntry);
    }

    getContent = (source) => {
        return {__html: this.remarkable.render(source)};
    }

    loadLogEntry = () => {
        if(this.state.currentLogEntryId < 1){
            return;
        }
        this.setState({showError: false});
        fetch(`${process.env.REACT_APP_BASE_URL}/logs/` + this.state.currentLogEntryId)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            else{
                throw Error("Server returned error.");
            }
        })
        .then(data => {
          if(data){
              this.setState({currentLogRecord: data});
          }
        })
        .catch(() => {
            this.setState({currentLogRecord: null, showError: true});
        });
    }

    render(){

        var attachments = this.state.currentLogRecord && this.state.currentLogRecord.attachments.map((row, index) => {
            if(row.fileMetadataDescription.startsWith('image')){
                return(
                    <ListGroup.Item key={index}>
                    <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_BASE_URL}/logs/attachments/` + this.state.currentLogRecord.id + "/" + row.filename}>
                        <Image key={index} src={`${process.env.REACT_APP_BASE_URL}/logs/attachments/` + this.state.currentLogRecord.id + "/" + row.filename} thumbnail/>
                    </a>
                    </ListGroup.Item>
                )
            }
            else{
                return (
                    <ListGroup.Item key={index}>
                    <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_BASE_URL}/logs/attachments/` + this.state.currentLogRecord.id + "/" + row.filename}>
                    {row.filename}
                    </a>
                    </ListGroup.Item>
                )}
            }
        );
        
        var properties = 
            this.state.currentLogRecord && this.state.currentLogRecord.properties.map((row, index) => {
                return(
                   <Property key={index} property={row}/>
                )
            });

        return(
            <Container className="grid-item full-height">
                {this.state.showError && <h6>Log entry id {this.state.currentLogEntryId} not found</h6>}
                {/* Render only of current log record is defined */}
                {this.state.currentLogRecord &&
                    <>
                        <h6 className="log-details-title">{this.state.currentLogRecord.title}</h6>
                        <LogDetailsMetaData currentLogRecord={this.state.currentLogRecord}/>
                        <div style={{paddingTop: "5px", wordWrap: "break-word"}} className="olog-table"
                            dangerouslySetInnerHTML={this.getContent(this.state.currentLogRecord.source)}>
                        </div>
                        {
                            this.state.currentLogRecord.attachments.length > 0 &&
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
                            this.state.currentLogRecord.properties.length > 0 &&
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

export default LogDetailsDetached;
