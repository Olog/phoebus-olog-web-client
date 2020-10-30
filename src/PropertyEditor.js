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
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import {BsXCircle} from 'react-icons/bs';
import Table from 'react-bootstrap/esm/Table';

class PropertyEditor extends Component{

    state = {
        keyValuePairs: {},
        key: "",
        value: ""
    };

    addRow = () => {
        const keyValuePairs = {...this.state.keyValuePairs};
        keyValuePairs[this.state.key] = this.state.value;
        this.setState({keyValuePairs});
        this.props.addKeyValuePair(this.props.name, this.state.key, this.state.value);
        this.setState({key: "", value: ""});
    }

    removeKeyValuePair = (key) => {
        const keyValuePairs = {...this.state.keyValuePairs};
        delete keyValuePairs[key];
        this.setState({keyValuePairs});
        this.props.removeKeyValuePair(this.props.name, key);
    }

    updateKey = (event) => {
        this.setState({key: event.target.value});
    }

    updateValue = (event) => {
        this.setState({value: event.target.value});
    }

    render(){

        var rows = Object.keys(this.state.keyValuePairs).map(key => {
            return (
                <tr key={key}>
                    <td>{key}</td>
                    <td>{this.state.keyValuePairs[key]}</td>
                    <td><BsXCircle 
                        onClick={() => this.removeKeyValuePair(key)}/></td>
                </tr>
            )
        })

        return(
            <div className="property-editor">
              <Form.Row>
                <Col>
                    <Form.Label column="sm">Name: <b>{this.props.name}</b></Form.Label>
                </Col>
                <Col><BsXCircle style={{float: "right"}} 
                    onClick={() => this.props.removeProperty(this.props.name)}/></Col>
              </Form.Row>
              
              <Form.Row>
                <Col>
                    <Table bordered size="sm">
                        <thead>
                            <tr><th>Key</th><th>Value</th><th></th></tr>
                        </thead>
                        <tbody>
                            {rows}
                            <tr>
                                <td>
                                    <Form.Control type="text" 
                                        size="sm" 
                                        value={this.state.key}
                                        onChange={this.updateKey}/>
                                </td>
                                <td>
                                    <Form.Control type="text" 
                                        size="sm"
                                        value={this.state.value}
                                        onChange={this.updateValue}/>
                                </td>
                                <td>
                                    <Button variant="secondary" 
                                        size="sm" 
                                        disabled={this.state.key === "" || this.state.value === ""}
                                        onClick={this.addRow}>Add</Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
              </Form.Row>
            </div>
        )
    }
}

export default PropertyEditor;