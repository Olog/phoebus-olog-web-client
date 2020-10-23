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

class PropertyRow extends Component{

    state = { key: "",
              value: ""
            };
    
    keyChanged = (event) => {
        this.setState({key: event.target.value});
    }

    valueChanged = (event) => {
        this.setState({value: event.target.value});
    }

    render(){
        return(
            <>
                <Form.Row>
                    <Col xs="auto">
                        <Form.Control 
                            required
                            type="text" 
                            placeholder="Enter key" 
                            value={this.state.key}
                            onChange={this.keyChanged}/>
                         <Form.Control.Feedback type="invalid">
                            Please specify a key.
                        </Form.Control.Feedback>
                    </Col>
                    <Col xs="auto">
                        <Form.Control 
                            required
                            type="text" 
                            placeholder="Enter value" 
                            value={this.state.key}
                            onChange={this.valueChanged}/>
                        <Form.Control.Feedback type="invalid">
                            Please specify a value.
                        </Form.Control.Feedback>
                    </Col>
                    <Col>
                    {this.props.keyValuePair.index > 0 ? 
                        <BsXCircle style={{marginTop: "12px"}}
                            onClick={() => this.props.removeKeyValuePair(this.props.keyValuePair)}/>
                        : <Col></Col>}
                    </Col>
                </Form.Row>
                
            </>
        )
    }
}

export default PropertyRow;