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
import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import Table from 'react-bootstrap/Table';

const Properties = (props) => {

    const [visible, setVisible] = useState(true);

    return(
        <>
            <Accordion defaultActiveKey="0">
                <Accordion.Toggle eventKey="0" onClick={() => setVisible(!visible)}>
                        {visible ? <FaChevronDown /> : <FaChevronRight/> } {props.property.name}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Table size="sm" bordered>
                        <tbody>
                            {props.property.attributes.map((a, index) => (<tr key={index}><td>{a.name}</td><td>{a.value}</td></tr>))}
                        </tbody>
                    </Table>
                </Accordion.Collapse>
            </Accordion>
        </>
    )
}

export default Properties;