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
 import OlogMoment from './OlogMoment';
 import customization from 'utils/customization';
import styled from 'styled-components';

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

class LogDetailsMetaData extends Component {
  
    render () {        
        
        const logbooks = this.props.currentLogRecord && this.props.currentLogRecord.logbooks.slice().sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
            if(index === this.props.currentLogRecord.logbooks.length - 1){
                return(<span key={index}>{row.name}</span>);
            }
            else{
                return (<span key={index}>{row.name},&nbsp;</span>);
            }    
        });
    
        const tags = this.props.currentLogRecord && this.props.currentLogRecord.tags.slice().sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
            if(index === this.props.currentLogRecord.tags.length - 1){
                return(<span key={index}>{row.name}</span>);
            }
            else{
                return (<span key={index}>{row.name},&nbsp;</span>);
            } 
        });    
        
        return (
            // <div className="log-details-meta-data">
            //     <Table>
            //         <tbody>
            //             <tr><td>Author</td><td><b>{this.props.currentLogRecord.owner}</b></td></tr>
            //             <tr><td>Created</td><td><b><OlogMoment date={this.props.currentLogRecord.createdDate}/></b></td></tr>
            //             <tr><td>Logbooks</td><td><b>{logbooks}</b></td></tr>
            //             <tr><td>Tags</td><td><b>{tags}</b></td></tr>
            //             <tr><td>{customization.level}</td><td><b>{this.props.currentLogRecord.level}</b></td></tr>
            //         </tbody>
            //     </Table>
            // </div>
            <Container>
                <DetailRow>
                    <Key>Author</Key><Value>{this.props.currentLogRecord.owner}</Value>
                </DetailRow>
                <DetailRow>
                    <Key>Created</Key><Value><OlogMoment date={this.props.currentLogRecord.createdDate}/></Value>
                </DetailRow>
                <DetailRow>
                    <Key>Logbooks</Key><Value>{logbooks}</Value>
                </DetailRow>
                <DetailRow>
                    <Key>Tags</Key><Value>{tags}</Value>
                </DetailRow>
                <DetailRow>
                    <Key>{customization.level}</Key><Value>{this.props.currentLogRecord.level}</Value>
                </DetailRow>
                <DetailRow>
                    <Key>Author</Key><Value>{this.props.currentLogRecord.owner}</Value>
                </DetailRow>
            </Container>
        );
    }
  }
   
  export default LogDetailsMetaData;