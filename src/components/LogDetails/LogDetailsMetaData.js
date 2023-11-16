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

 import React from 'react';
 import OlogMoment from './OlogMoment';
 import customization from 'config/customization';
import styled from 'styled-components';
import { Link } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";

const Container = styled.div`
    font-size: 0.8rem;
    padding-bottom: 1rem;
`

const DetailRow = styled.div`
    display: flex;
    gap: 1rem;
`

const Key = styled.div`
    flex: 0 0 5rem;
    text-align: right;
`

const Value = styled.div`
    flex-grow: 1;
    font-weight: bold;
`

const LogDetailsMetaData = ({currentLogRecord}) => {
        
    const logbooks = currentLogRecord && currentLogRecord.logbooks.slice().sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
        if(index === currentLogRecord.logbooks.length - 1){
            return(<span key={index}>{row.name}</span>);
        }
        else{
            return (<span key={index}>{row.name},&nbsp;</span>);
        }    
    });

    const tags = currentLogRecord && currentLogRecord.tags.slice().sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
        if(index === currentLogRecord.tags.length - 1){
            return(<span key={index}>{row.name}</span>);
        }
        else{
            return (<span key={index}>{row.name},&nbsp;</span>);
        } 
    });    
    
    return (
        <Container>
            <DetailRow>
                <Key>Author</Key><Value data-testid="meta-author">{currentLogRecord.owner}</Value>
            </DetailRow>
            <DetailRow>
                <Key>Created</Key>
                <Value data-testid="meta-created">
                    { currentLogRecord.modifyDate 
                        ? <span><OlogMoment date={currentLogRecord.modifyDate}/> <Link component={RouterLink} to={`/logs/${currentLogRecord.id}/history`}>(edited)</Link></span>
                        : <OlogMoment date={currentLogRecord.createdDate}/>
                    }
                </Value>
            </DetailRow>
            <DetailRow>
                <Key>Logbooks</Key><Value data-testid="meta-logbooks">{logbooks}</Value>
            </DetailRow>
            <DetailRow>
                <Key>Tags</Key><Value data-testid="meta-tags">{tags}</Value>
            </DetailRow>
            <DetailRow>
                <Key>{customization.level}</Key><Value data-testid="meta-entrytype">{currentLogRecord.level}</Value>
            </DetailRow>
        </Container>
    );

}

export default LogDetailsMetaData;