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
 import Image from 'react-bootstrap/Image';
 import ListGroup from 'react-bootstrap/ListGroup';
 import Property from './Property';
 import LogDetailsMetaData from './LogDetailsMetaData';
 import './css/olog.css';
 import Accordion from 'react-bootstrap/Accordion';
 import Card from 'react-bootstrap/Card';
 import { FaChevronRight, FaChevronDown } from "react-icons/fa";
 /**
 * Merged view of all log entries 
 */
class LogEntrySingleView extends Component{

    state = {
        openInfo: false,
        attachmentVisible: true,
        propertiesVisible: false,
        showGroup: false
    };

    getContent = (source) => {
        return {__html: this.props.remarkable.render(source)};
    }

    render(){
        var attachments = this.props.currentLogRecord.attachments.map((row, index) => {
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
        
        var properties = this.props.currentLogRecord.properties.map((row, index) => {
                if(row.name !== 'Log Entry Group'){
                    return(
                        <Property key={index} property={row}/>
                     )
                }
                else{
                    return null;
                }
            });
    
        return(
            <>
                <div className="log-details-title">
                    <span>{this.props.currentLogRecord.title}</span>
                    <span style={{float: "right"}}>{this.props.currentLogRecord.id}</span>
                </div>
                <LogDetailsMetaData currentLogRecord={this.props.currentLogRecord}/>
                <div style={{paddingTop: "5px", wordWrap: "break-word"}} className="olog-table"
                    dangerouslySetInnerHTML={this.getContent(this.props.currentLogRecord.source)}>
                </div>
                <Accordion defaultActiveKey="0">
                    <Accordion.Toggle as={Card.Header} eventKey="0" 
                    onClick={() => this.setState({attachmentVisible: !this.state.attachmentVisible})}>
                    {this.state.attachmentVisible ? <FaChevronDown /> : <FaChevronRight/> } Attachments
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <ListGroup>
                            {this.props.currentLogRecord.attachments.length === 0 ? <p>No Attachments</p> : attachments}
                        </ListGroup>
                    </Accordion.Collapse>
                </Accordion>
                <Accordion>
                    <Accordion.Toggle as={Card.Header} eventKey="0" 
                        onClick={() => this.setState({propertiesVisible: !this.state.propertiesVisible})}>
                        {this.state.propertiesVisible ? <FaChevronDown /> : <FaChevronRight/> } Properties
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <ListGroup>
                            {this.props.currentLogRecord.properties.length === 0 ? <p>No Properties</p> : properties}
                        </ListGroup>
                    </Accordion.Collapse>
                </Accordion>
            </>
        );
    }
    
}

export default LogEntrySingleView;