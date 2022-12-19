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
import ListGroup from 'react-bootstrap/ListGroup';
import Properties from './Properties';
import LogDetailsMetaData from './LogDetailsMetaData';
import styled from 'styled-components';
import Collapse from 'components/shared/Collapse';
import { ListGroupItem } from 'components/shared/ListGroup';

const Container = styled.div`
    padding: 0.5rem;
    border: 1px solid ${({theme}) => theme.colors.light};
`

const LogTitle = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 1.4rem;
`

const Ruler = styled.hr`
    border: none;
    border-top: 1px solid ${({theme}) => theme.colors.light};
`

const Description = styled.div`
    width: 100%;
    padding-top: 5px;
    wordWrap: break-word;
    font-size: 16px;
`

const AttachmentImage = styled.img`
    width: 100%;
`

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
        const attachments = this.props.currentLogEntry.attachments.map((row, index) => {
            var url = `${process.env.REACT_APP_BASE_URL}/logs/attachments/` + this.props.currentLogEntry.id + "/" + row.filename;
            
            if(row.fileMetadataDescription.startsWith('image')){
                return(
                    <ListGroupItem key={index}>
                        <AttachmentImage 
                            onClick={() => {
                                let w = window.open("", row.filename);
                                w.document.open();
                                w.document.write('<html><head><title>' + row.filename + '</title></head>');
                                w.document.write('<body><p><img src=\'' + url + '\'></p></body></html>');
                                w.document.close();
                            }}
                            src={url}
                        />
                    </ListGroupItem>
                )
            }
            else{
                return (
                    <ListGroupItem key={index}>
                        <a target="_blank" rel="noopener noreferrer" href={url}>
                            {row.filename}
                        </a>
                    </ListGroupItem>
                )}
            }
        );
        
        const properties = this.props.currentLogEntry.properties.map((row, index) => {
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
            <Container>
                <LogTitle>
                    <span>{this.props.currentLogEntry.title}</span>
                    <span>{this.props.currentLogEntry.id}</span>
                </LogTitle>
                <Ruler />
                <LogDetailsMetaData currentLogRecord={this.props.currentLogEntry}/>
                <Ruler />
                <Description 
                    dangerouslySetInnerHTML={this.getContent(this.props.currentLogEntry.source)}>
                </Description>
                <Collapse title='Attachments'>
                    {this.props.currentLogEntry.attachments.length > 0 
                        ? <ListGroup>
                            {attachments}
                        </ListGroup>
                        : <p>No Attachments</p> 
                    }
                </Collapse>
                <Collapse title='Properties'>
                    {this.props.currentLogEntry.properties.length > 0 
                        ? properties 
                        : <p>No Properties</p> 
                    }
                </Collapse>
            </Container>
        );
    }
    
}

export default LogEntrySingleView;