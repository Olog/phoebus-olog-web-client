/**
 * Copyright (C) 2019 European Spallation Source ERIC.
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
import React, {Component} from 'react';
import OlogMoment from './OlogMoment';
import './css/olog.css';
import Table from 'react-bootstrap/Table';

class SearchResultItem extends Component{

    render(){
        var attachments = this.props.log.attachments.map((row, index) => {
            return (
                <li key={index}>{row.filename} - {row.fileMetadataDescription}</li>
            )
         })

        return(
            <>
                <Table bordered size="sm" onClick={() => this.props.setLogRecord(this.props.log)}>
                    <tbody>
                        <tr>
                            <td>Author</td><td>{this.props.log.owner}</td>
                        </tr>
                        <tr>
                            <td>Created Date</td><td><OlogMoment date={this.props.log.createdDate}/></td>
                        </tr>
                        <tr>
                            <td>Title</td><td>{this.props.log.title}</td>
                        </tr>
                        {this.props.log.description ? null : <tr><td>Desription</td><td>{this.props.log.description}</td></tr>}
                        {this.props.log.attachments.length === 0 ? null : <tr><td colSpan="2">Attachments:<br/>{attachments}</td></tr> }
                    </tbody>
                </Table>
            </>
        )
    }
}

export default SearchResultItem;