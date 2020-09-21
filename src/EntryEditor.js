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
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import SplitButton from 'react-bootstrap/SplitButton';
import Selection from './Selection';

class EntryEditor extends Component{

    state = {
        selectedLogbooks: [],
        selectedTags: []
    }

    addLogbook = (logbook) => {
        var present = false;
        this.state.selectedLogbooks.map(element => {
            if(element === logbook){
                present = true;
            }
            return null;
        });
        if(!present){
            this.setState({
                selectedLogbooks: [...this.state.selectedLogbooks, logbook]
            });
        }
    }

    removeLogbook = (logbook) => {
        this.setState({selectedLogbooks: this.state.selectedLogbooks.filter(item => item !== logbook)});
    }

    render(){

        var logbookItems = this.props.logbooks.sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
            return (
                <Dropdown.Item key={index} eventKey={index} onSelect={() => this.addLogbook(row.name)}>{row.name}</Dropdown.Item>
            )
        });

        var tagItems = this.props.tags.sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
            return (
                <Dropdown.Item key={index} eventKey={index}>{row.name}</Dropdown.Item>
            )
        });

        var currentLogbookSelection = this.state.selectedLogbooks.map((row, index) => {
            return(
                <Selection label={row} key={index} delete={this.removeLogbook}/>
            )
        });

        return(
            <>
                <Container className="full-height">
                    <Row className="grid-item">
                        <Col>
                            <h5>New Log Entry</h5>
                        </Col>
                    </Row>
                    <Row className="grid-item">
                        <Col>
                            <ListGroup>
                                <ListGroup.Item>
                                    <SplitButton
                                        as={ButtonGroup}
                                        size="sm"
                                        variant="secondary"
                                        title="Logbooks">
                                        {logbookItems}
                                    </SplitButton>&nbsp;
                                    {currentLogbookSelection}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <SplitButton
                                        as={ButtonGroup}
                                        size="sm"
                                        variant="secondary"
                                        title="Tags">
                                        {tagItems}
                                    </SplitButton>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                <SplitButton
                                    as={ButtonGroup}
                                    size="sm"
                                    variant="secondary"
                                    title="Level">
                                    <Dropdown.Item eventKey="1">Urgent</Dropdown.Item>
                                    <Dropdown.Item eventKey="2">Suggestion</Dropdown.Item>
                                    <Dropdown.Item eventKey="3">Info</Dropdown.Item>
                                    <Dropdown.Item eventKey="4">Request</Dropdown.Item>
                                    <Dropdown.Item eventKey="5">Problem</Dropdown.Item>
                                </SplitButton>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default EntryEditor;