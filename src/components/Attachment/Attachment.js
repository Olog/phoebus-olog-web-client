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
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { FaRegFile } from "react-icons/fa";

const Attachment = ({attachment, removeAttachment}) => {

    if(attachment.file.type.toLowerCase().startsWith("image")){
        return(
            <div className="attachment">
                <Button variant="danger" onClick={() => removeAttachment(attachment.file)}>Remove</Button>
                <Image src={URL.createObjectURL(attachment.file)} className="attachment"/>
                <p>{attachment.file.name}</p>
            </div>
        )
    }
    else{
        return(
            <div className="attachment">
                <Button variant="danger" onClick={() => removeAttachment(attachment.file)}>Remove</Button><br/>
                <FaRegFile style={{marginTop: "5px"}} size={56}/>
                <p>{attachment.file.name}</p>
            </div>
        )
    }
}

export default Attachment;