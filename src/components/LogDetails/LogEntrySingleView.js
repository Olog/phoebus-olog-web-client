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

import ListGroup from 'components/shared/ListGroup';
import Properties from './Properties';
import LogDetailsMetaData from './LogDetailsMetaData';
import styled from 'styled-components';
import Collapse from 'components/shared/Collapse';
import { ListGroupItem } from 'components/shared/ListGroup';

const Container = styled.div`
    padding: 0.5rem;
    height: 100%;
    overflow: auto;
`

const LogTitle = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 1.4rem;
`

const Ruler = styled.hr`
    border: none;
    border-top: 1px solid ${({theme}) => theme.colors.light};
    margin: 0.5rem 0;
`

const Description = styled.div`
    width: 100%;
    max-width: 33vw;
    padding-top: 0.5rem;
    padding-bottom: 1rem;
    wordWrap: break-word;
    font-size: 1.2rem;
`

const AttachmentImage = styled.img`
    width: 100%;

    &:hover {
        cursor: pointer;
    }
`

const LogEntrySingleView = ({remarkable, currentLogEntry, className}) => {

    const getContent = (source) => {
        return {__html: remarkable.render(source)};
    }

    
    const attachments = currentLogEntry.attachments.map((attachment, index) => {
        const url = `${process.env.REACT_APP_BASE_URL}/attachment/` + attachment.id;
        
        if(attachment.fileMetadataDescription.startsWith('image')){
            return(
                <ListGroupItem key={index}>
                    <AttachmentImage 
                        onClick={() => {
                            let w = window.open("", attachment.filename);
                            w.document.open();
                            w.document.write('<html><head><title>' + attachment.filename + '</title></head>');
                            w.document.write('<body><p><img src=\'' + url + '\'></p></body></html>');
                            w.document.close();
                        }}
                        src={url}
                        alt={attachment.filename}
                    />
                </ListGroupItem>
            )
        } else {
            return (
                <ListGroupItem key={index}>
                    <a target="_blank" rel="noopener noreferrer" href={url}>
                        {attachment.filename}
                    </a>
                </ListGroupItem>
            )}
        }
    );
    
    const properties = currentLogEntry.properties
        .filter(property => property.name !== 'Log Entry Group')
        .map((property, index) => <Properties key={index} property={property}/>);

    return(
        <Container className={className}>
            <LogTitle>
                <span>{currentLogEntry.title}</span>
                <span>{currentLogEntry.id}</span>
            </LogTitle>
            <Ruler />
            <LogDetailsMetaData currentLogRecord={currentLogEntry}/>
            <Ruler />
            <Description 
                dangerouslySetInnerHTML={getContent(currentLogEntry.source)}>
            </Description>
            <Collapse title='Attachments'>
                {currentLogEntry.attachments.length > 0 
                    ? <ListGroup>
                        {attachments}
                    </ListGroup>
                    : <p>No Attachments</p> 
                }
            </Collapse>
            <Collapse title='Properties'>
                {properties?.length > 0
                    ? properties 
                    : <p>No Properties</p> 
                }
            </Collapse>
        </Container>
    );
    
}

export default LogEntrySingleView;