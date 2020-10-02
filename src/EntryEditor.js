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
import Form from 'react-bootstrap/Form';
import Selection from './Selection';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import {FaPlus} from 'react-icons/fa';
import FormFile from 'react-bootstrap/FormFile';
import Attachment from './Attachment.js'
import axios from 'axios';

class EntryEditor extends Component{

    state = {
        selectedLogbooks: [],
        selectedTags: [],
        level: "",
        title: "",
        description: "",
        attachedFiles: [],
    }

    fileInputRef = React.createRef();
    titleRef = React.createRef();
    descriptionRef = React.createRef();
    
    addLogbook = (logbook) => {
        var present = false;
        this.state.selectedLogbooks.map(element => {
            if(element.name === logbook.name){
                present = true;
            }
            return null;
        });
        if(!present){
            this.setState({selectedLogbooks: [...this.state.selectedLogbooks, logbook]})
        }
    }

    removeLogbook = (logbook) => {
        this.setState({
                selectedLogbooks: this.state.selectedLogbooks.filter(item => item.name !== logbook.name)
        });
    }

    addTag = (tag) => {
        var present = false;
        this.state.selectedTags.map(element => {
            if(element.name === tag.name){
                present = true;
            }
            return null;
        });
        if(!present){
            this.setState({selectedTags: [...this.state.selectedTags, tag]});
        }
    }

    removeTag = (tag) => {
        this.setState({
                selectedTags: this.state.selectedTags.filter(item => item.name !== tag.name)
        });
    }

    onBrowse = () => {
        this.fileInputRef.current.click();
    }
    
    onFileChanged = (event) => {
        if(event.target.files){
            this.setState({attachedFiles: [...this.state.attachedFiles, ...event.target.files]});
        }
        this.fileInputRef.current.value = null;
    }

    removeAttachment = (file) => {
        this.setState({attachedFiles: this.state.attachedFiles.filter(item => item !== file)});
    }

    createLogEntry = () => {
        // TODO add error handling if request fails.
       axios.put(`${process.env.REACT_APP_BASE_URL}/Olog/logs/`, this.state.logEntry, { withCredentials: true })
        .then(res => {
            console.log(res);
        });
    };

    submitAttachments = (id) => {
        let promises = [];
        this.state.attachedFiles.map((file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', file.name);
            promises.push(axios({
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                url: `${process.env.REACT_APP_BASE_URL}/Olog/logs/attachments/` + id,
                data: formData,
                withCredentials: true,
            }));
        });
        Promise.all(promises).then(response => console.log(response));
    }

    submitAttachmentsMulti = (id) => {
        const formData = new FormData();
        this.state.attachedFiles.map(file => {
            formData.append('file', file);
        });
        
        axios({
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            url: `${process.env.REACT_APP_BASE_URL}/Olog/logs/attachments-multi/` + id,
            data: formData,
            withCredentials: true,
        }).then(result => console.log(result));
    }

    submit = () => {
        const logEntry = {
            logbooks: this.state.selectedLogbooks,
            tags: this.state.selectedTags,
            title: this.state.title,
            description: this.state.description,
            level: this.state.level,
            source: "source",
            state: "Active"
        }
        // TODO add error handling if request fails.
        axios.put(`${process.env.REACT_APP_BASE_URL}/Olog/logs/`, logEntry, { withCredentials: true })
            .then(res => {
                this.submitAttachmentsMulti(res.data.id);
            });
    }

    titleChanged = () => {
       this.setState({title: this.titleRef.current.value})
    }

    descriptionChanged = () => {
        this.setState({description: this.descriptionRef.current.value})
    }

    
    render(){

        var logbookItems = this.props.logbooks.sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
            return (
                <Dropdown.Item key={index} 
                    eventKey={index} 
                    onSelect={() => this.addLogbook(row)}>{row.name}</Dropdown.Item>
            )
        });

        var tagItems = this.props.tags.sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
            return (
                <Dropdown.Item key={index} 
                    eventKey={index}
                    onSelect={() => this.addTag(row)}>{row.name}</Dropdown.Item>
            )
        });

        var currentLogbookSelection = this.state.selectedLogbooks.map((row, index) => {
            return(
                <Selection item={row} key={index} delete={this.removeLogbook}/>
            )
        });

        var currentTagSelection = this.state.selectedTags.map((row, index) => {
            return(
                <Selection item={row} key={index} delete={this.removeTag}/>
            )
        });

        var attachments = this.state.attachedFiles.map((file, index) => {
            return(
                <Attachment key={index} file={file} removeAttachment={this.removeAttachment}/>
            )
        })

        let levels = ["Urgent", "Suggestion", "Info", "Request", "Problem"];

        const doUpload = this.props.fileName !== '';

        return(
            <>
                <Container fluid className="full-height">
                    <Row>
                        <Col>
                            <h5>New Log Entry</h5>
                        </Col>
                        <Col>
                            <Button className="float-right" onClick={this.submit}>Create</Button>
                        </Col>
                    </Row>
                    <Row className="grid-item">
                        <Col>
                            <ListGroup>
                                <ListGroup.Item>
                                    <Dropdown 
                                        as={ButtonGroup}
                                        size="sm">
                                        <Button variant="secondary" className="selection-dropdown">Logbooks</Button>
                                        <Dropdown.Toggle split variant="secondary"/>
                                        <Dropdown.Menu>
                                        {logbookItems}
                                        </Dropdown.Menu>
                                    </Dropdown>&nbsp;
                                    {currentLogbookSelection}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Dropdown
                                        as={ButtonGroup}
                                        size="sm">
                                        <Button variant="secondary" className="selection-dropdown">Tags</Button>
                                        <Dropdown.Toggle split variant="secondary"/>
                                        <Dropdown.Menu>
                                        {tagItems}
                                        </Dropdown.Menu>
                                    </Dropdown>&nbsp;
                                    {currentTagSelection}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                <Dropdown
                                    as={ButtonGroup}
                                    size="sm">
                                    <Button variant="secondary" className="selection-dropdown">Level</Button>
                                    <Dropdown.Toggle split variant="secondary"/>
                                    <Dropdown.Menu>
                                    {levels.map((level, index) => (
                                        <Dropdown.Item eventKey={index}
                                        key={index}
                                        onSelect={() => this.setState({level: level})}>{level}</Dropdown.Item>
                                    ))}
                                    </Dropdown.Menu>
                                </Dropdown>&nbsp;
                                {this.state.level && <div className="selection">{this.state.level}</div>}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row className="grid-item">
                        <Col>
                            <Form>
                                <FormGroup>
                                    <Form.Control ref={this.titleRef}
                                        type="text" 
                                        placeholder="Title" 
                                        onChange={() => this.titleChanged()}></Form.Control>
                                    <Form.Control ref={this.descriptionRef}
                                        as="textarea" 
                                        rows="5" 
                                        placeholder="Description"
                                        onChange={() => this.descriptionChanged()}></Form.Control>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row className="grid-item">
                        <Col>
                            <h6>Attachments:</h6>
                            <Form>
                                <FormGroup>
                                <Button variant="secondary"
                                        disabled={ this.props.isUploading }
                                        onClick={ doUpload && this.props.onUploadStarted ? this.props.onUploadStarted : this.onBrowse }>
                                    <span><FaPlus/></span>Add Files
                                </Button>
                                <FormFile.Input
                                    hidden
                                    multiple
                                    ref={ this.fileInputRef }
                                    onChange={ this.onFileChanged } />
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col id="attachements">
                        {attachments}
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default EntryEditor;