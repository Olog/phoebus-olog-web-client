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
import { FaPaperclip } from 'react-icons/fa';
import styled from 'styled-components';
import FormattedDate from 'components/shared/FormattedDate';
 
const Container = styled.div`
    display: flex;
    background-color: ${({theme}) => theme.colors.light};
    font-size: 1.2rem;
`

const Right = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-left: auto;
`

 /**
  * Simple component rendering a header item when showing a merged view of 
  * multiple (grouped) log entries. When user clicks on the header, the associated
  * log entry is shown in full, i.e. using the "non-grouped" log entry view.
  * @param {} props 
  * @returns 
  */
 const GroupHeader = ({logEntry}) => {
 
     return(
         <Container>
             <FormattedDate date={logEntry.createdDate} fontSize="1.2rem" />{", "}{logEntry.owner}{", "}{logEntry.title}
             <Right>
                <span>{logEntry.id}</span>
                {logEntry.attachments.length > 0 ? <FaPaperclip /> : null}
             </Right>
         </Container>
     )
 }
 
 export default GroupHeader;