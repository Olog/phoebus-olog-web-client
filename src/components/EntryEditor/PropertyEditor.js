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
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import {BsXCircle} from 'react-icons/bs';
import Table from 'react-bootstrap/esm/Table';

class PropertyEditor extends Component{

    updateValue = (event, attribute) => {
        this.props.updateAttributeValue(this.props.property, attribute, event.target.value);
    }

    render(){

        var rows = this.props.property.attributes.map((attribute, index) => {
            return (
                <tr key={index}>
                    <td style={{verticalAlign: "middle"}}>{attribute.name}</td>
                    <td> <Form.Control size="sm" 
                                type="input" 
                                defaultValue={attribute.value}
                                style={{fontSize: "12px"}}
                                onChange={(e) => this.updateValue(e, attribute)}/> 
                    </td>
                </tr>
            )
        });

        return(
            <div className="property-editor">
              <Form.Row>
                <Col>
                    <Form.Label column="sm"><b>{this.props.property.name}</b></Form.Label>
                </Col>
                <Col><BsXCircle style={{float: "right"}} 
                    onClick={() => this.props.removeProperty(this.props.property.name)}/></Col>
              </Form.Row>
              
              <Form.Row>
                <Col>
                    <Table bordered size="sm">
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>
                </Col>
              </Form.Row>
            </div>
        )
    }
}

export default PropertyEditor;