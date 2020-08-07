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
import React, {Component} from 'react'
import Moment from 'react-moment';
import moment from 'moment';
import OlogMoment from './OlogMoment'

import './css/olog.css'

class SearchResultItem extends Component{

    render(){
        var attachments = this.props.log.attachments.map((row, index) => {
            return (
                <li  key={index}>{row.filename} - {row.fileMetadataDescription}</li>
            )
         })

        return(
            <>
              <div className="search-list-item">
                Author: {this.props.log.owner} <br/>
                Created Date: <OlogMoment date={this.props.log.createdDate}/> <br/>
                Modified Date: <OlogMoment date={this.props.log.modifyDate}/><br/>
                Description: {this.props.log.description} <br/>
                Attachments:<br/>
                <ul className="olog-ul">{attachments}</ul>
              </div>
            </>
        )
    }
}

export default SearchResultItem;