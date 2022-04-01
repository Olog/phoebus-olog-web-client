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
 import React from 'react';
 import OlogMoment from './OlogMoment';
 
 /**
  * Simple component rendering a header item when showing a merged view of 
  * multiple (grouped) log entries. When user clicks on the header, the associated
  * log entry is shown in full, i.e. using the "non-grouped" log entry view.
  * @param {} props 
  * @returns 
  */
 const GroupHeader = (props) => {
 
     return(
         <div className="separator" onClick={() => props.showLog(props.logEntry)}>
             <OlogMoment date={props.logEntry.createdDate}/>, 
                {props.logEntry.owner}, 
                {props.logEntry.title} 
                <span style={{float: "right"}}>{props.logEntry.id}</span>
                {props.logEntry.attachments.length > 0 && <div className='attachment-icon'/>}
         </div>
     )
 }
 
 export default GroupHeader;