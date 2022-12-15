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
 import Properties from './Properties';
 import LogDetailsMetaData from './LogDetailsMetaData';
//  import '../../css/olog.css';
 import Accordion from 'react-bootstrap/Accordion';
 import Card from 'react-bootstrap/Card';
 import { FaChevronRight, FaChevronDown } from "react-icons/fa";

class LogEntrySingleView extends Component{

    state = {
        openInfo: false,
        attachmentVisible: true,
        propertiesVisible: false
    };

    getContent = (source) => {
        return {__html: this.props.remarkable.render(source)};
    }

    render(){
        var attachments = this.props.currentLogEntry.attachments.map((row, index) => {
            var url = `${process.env.REACT_APP_BASE_URL}/logs/attachments/` + this.props.currentLogEntry.id + "/" + row.filename;
            
            if(row.fileMetadataDescription.startsWith('image')){
                return(
                    <ListGroup.Item key={index}>
                    <button style={{border: "none"}}>
                        <Image key={index} style={{border: "none"}}
                        onClick={() => {
                            let w = window.open("", row.filename);
                            w.document.open();
                            w.document.write('<html><head><title>' + row.filename + '</title></head>');
                            w.document.write('<body><p><img src=\'' + url + '\'></p></body></html>');
                            w.document.close();
                        }}
                        src={url} thumbnail/>
                    </button>
                    </ListGroup.Item>
                )
            }
            else{
                return (
                    <ListGroup.Item key={index}>
                    <a target="_blank" rel="noopener noreferrer" href={url}>
                    {row.filename}
                    </a>
                    </ListGroup.Item>
                )}
            }
        );
        
        var properties = this.props.currentLogEntry.properties.map((row, index) => {
                if(row.name !== 'Log Entry Group'){
                    return(
                        <Properties key={index} property={row}/>
                     )
                }
                else{
                    return null;
                }
            });
    
        return(
            <>
                <div className="log-details-title">
                    <span>{this.props.currentLogEntry.title}</span>
                    <span style={{float: "right"}}>{this.props.currentLogEntry.id}</span>
                </div>
                <LogDetailsMetaData currentLogRecord={this.props.currentLogEntry}/>
                <div style={{paddingTop: "5px", wordWrap: "break-word", fontSize: "16px"}} className="olog-table"
                    dangerouslySetInnerHTML={this.getContent(this.props.currentLogEntry.source)}>
                </div>
                <Accordion defaultActiveKey="0"> 
                    <Accordion.Toggle as={Card.Header} eventKey="0" style={{padding: "2px"}}
                    onClick={() => this.setState({attachmentVisible: !this.state.attachmentVisible})}>
                    {this.state.attachmentVisible ? <FaChevronDown /> : <FaChevronRight/> } Attachments
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <ListGroup>
                            {this.props.currentLogEntry.attachments.length === 0 ? <p>No Attachments</p> : attachments}
                        </ListGroup>
                    </Accordion.Collapse>
                </Accordion>
                <Accordion>
                    <Accordion.Toggle as={Card.Header} eventKey="0" style={{padding: "2px"}}
                        onClick={() => this.setState({propertiesVisible: !this.state.propertiesVisible})}>
                        {this.state.propertiesVisible ? <FaChevronDown /> : <FaChevronRight/> } Properties
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <ListGroup>
                            {this.props.currentLogEntry.properties.length === 0 ? <p>No Properties</p> : properties}
                        </ListGroup>
                    </Accordion.Collapse>
                </Accordion>
            </>
        );
    }
    
}

export default LogEntrySingleView;