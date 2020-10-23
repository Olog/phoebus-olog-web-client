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
import PropertyRow from './PropertyRow';
import Button from 'react-bootstrap/Button';
import {FaPlus} from 'react-icons/fa';
import Col from 'react-bootstrap/Col';
import {BsXCircle} from 'react-icons/bs';

class PropertyEditor extends Component{

    state = {
        keyValuePairs: []
    };

    componentDidMount = () => {
        this.addKeyValuePair(); // Add one key value pair row as default.
    }

    nameChanged = (event) => {
        this.setState({name: event.target.value});
    }

    addKeyValuePair = () => {
        var keyValuePair = {key: "", value: "", index: this.state.keyValuePairs.length}
        this.setState({keyValuePairs: [...this.state.keyValuePairs, keyValuePair]});
    }

    removeKeyValuePair = (keyValuePair) => {
        this.setState({
            keyValuePairs: this.state.keyValuePairs.filter(item => item.index !== keyValuePair.index)});
    }

    render(){

        var rows = this.state.keyValuePairs.map((row, index) => {
            return (
                <PropertyRow key={index} keyValuePair={row} removeKeyValuePair={this.removeKeyValuePair}/>
            )
        })

        return(
            <div className="property-editor">
              <Form.Row>
              <Col xs="auto">
                <Form.Control 
                    required
                    type="text" 
                    placeholder="Enter property name" 
                    value={this.props.property.name}
                    onChange={this.nameChanged}/>
                <Form.Control.Feedback type="invalid">
                    Please specify a property name.
                </Form.Control.Feedback>
                </Col>
                <Col></Col>
                <Col xs="auto"><BsXCircle style={{float: "right"}} 
                    onClick={() => this.props.removeProperty(this.props.property)}/></Col>
              </Form.Row>
                {rows}
              <Form.Row>
              <Col xs="auto">
                <Button variant="secondary" size="sm" onClick={this.addKeyValuePair}>
                    <span><FaPlus className="add-button"/></span>Add Key/Value pair
                </Button>
                </Col>
              </Form.Row>
            </div>
        )
    }
}

export default PropertyEditor;