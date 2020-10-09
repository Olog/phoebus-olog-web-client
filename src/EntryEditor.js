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
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Selection from './Selection';
import Button from 'react-bootstrap/Button';
import {FaPlus} from 'react-icons/fa';
import FormFile from 'react-bootstrap/FormFile';
import Attachment from './Attachment.js'
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class EntryEditor extends Component{

    state = {
        selectedLogbooks: [],
        selectedTags: [],
        level: "",
        title: "",
        description: "",
        attachedFiles: [],
        validated: false,
        logbookSelectionValid: true,
        levelSelectionValid: true
    }

    componentDidMount() {
        // Check if we a have a non-expired session cookie.
        // If not, trigger login dialog.
        if(!cookies.get('SESSION')){
            console.log("will redirect");
        }
    }

    fileInputRef = React.createRef();
    
    addLogbook = (logbook) => {
        var present = false;
        this.state.selectedLogbooks.map(element => {
            if(element.name === logbook.name){
                present = true;
                return null;
            }
            return null;
        });
        if(!present){
            this.setState({selectedLogbooks: [...this.state.selectedLogbooks, logbook]},
                () => this.setState({logbookSelectionValid: this.state.selectedLogbooks.length > 0}));
        }
    }

    removeLogbook = (logbook) => {
        this.setState({
                selectedLogbooks: this.state.selectedLogbooks.filter(item => item.name !== logbook.name)},
                () => this.setState({logbookSelectionValid: this.state.selectedLogbooks.length > 0})
        );
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

    submitAttachmentsMulti = (id) => {
        const formData = new FormData();
        this.state.attachedFiles.map(file => {
            formData.append('file', file);
            return null;
        });
        
        return axios({
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            url: `${process.env.REACT_APP_BASE_URL}/Olog/logs/attachments-multi/` + id,
            data: formData,
            withCredentials: true,
        });
    }

    selectionsValid = () => {
        this.setState({logbookSelectionValid: this.state.selectedLogbooks.length > 0,
            levelSelectionValid: this.state.level !== ""});
        return this.state.logbookSelectionValid
            && this.state.levelSelectionValid;
    }

    submit = (event) => {
        event.preventDefault();
        const selectionsAreValid = this.selectionsValid();
        const form = event.currentTarget;        
        this.setState({validated: true});

        if (form.checkValidity() === true && selectionsAreValid){
            const { history } = this.props;
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
                    //console.log(res);
                    this.submitAttachmentsMulti(res.data.id).then(res => history.push('/'));
                })
                .catch(error => console.log(error));
        }
    }

    titleChanged = (event) => {
       this.setState({title: event.target.value})
    }

    descriptionChanged = (event) => {
        this.setState({description: event.target.value})
    }

    selectLevel = (level) => {
        this.setState({level: level}, () => this.setState({levelSelectionValid: level !== ""}));
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
                    <Form noValidate validated={this.state.validated} onSubmit={this.submit}>
                        <Form.Row>
                            <Form.Label className="new-entry">New Log Entry</Form.Label>
                            <Button type="submit">Create</Button>
                        </Form.Row>
                        <Form.Row className="grid-item">
                            <Dropdown as={ButtonGroup}>
                                <Dropdown.Toggle className="selection-dropdown" size="sm" variant="secondary">
                                    Logbooks
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {logbookItems}
                                </Dropdown.Menu>
                            </Dropdown>
                            &nbsp;{currentLogbookSelection}
                            {!this.state.logbookSelectionValid && 
                                <Form.Label className="form-error-label" column={true}>Select at least one logbook.</Form.Label>}
                        </Form.Row>
                        <Form.Row className="grid-item">
                            <Dropdown as={ButtonGroup}>
                                <Dropdown.Toggle className="selection-dropdown" size="sm" variant="secondary">
                                    Tags
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {tagItems}
                                </Dropdown.Menu>
                            </Dropdown>
                            &nbsp;{currentTagSelection}
                        </Form.Row>
                        <Form.Row className="grid-item">
                            <Dropdown as={ButtonGroup}>
                                <Dropdown.Toggle className="selection-dropdown" size="sm" variant="secondary">
                                    Level                                   
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                {levels.map((level, index) => (
                                    <Dropdown.Item eventKey={index}
                                    key={index}
                                    onSelect={() => this.selectLevel(level)}>{level}</Dropdown.Item>
                                ))}
                                </Dropdown.Menu>
                            </Dropdown>&nbsp;
                            {this.state.level && <div className="selection">{this.state.level}</div>}
                            {this.state.levelSelectionValid ? null : <Form.Label className="form-error-label" column={true}>Select a level.</Form.Label>}
                        </Form.Row>
                        <Form.Row className="grid-item">
                            <Form.Control 
                                required
                                type="text" 
                                placeholder="Title" 
                                value={this.state.title}
                                onChange={this.titleChanged}/>
                            <Form.Control.Feedback type="invalid">
                                Please specify a title.
                            </Form.Control.Feedback>
                        </Form.Row>
                        <Form.Row className="grid-item">
                            <Form.Control
                                required
                                as="textarea" 
                                rows="5" 
                                value={this.state.description}
                                placeholder="Description"
                                onChange={this.descriptionChanged}/>
                            <Form.Control.Feedback type="invalid">
                                Please specify a description.
                            </Form.Control.Feedback>
                        </Form.Row>
                        <Form.Row>
                            <Button variant="secondary"
                                    disabled={ this.props.isUploading }
                                    onClick={ doUpload && this.props.onUploadStarted ? this.props.onUploadStarted : this.onBrowse }>
                                <span><FaPlus className="add-attachments"/></span>Add Attachments
                            </Button>
                            <FormFile.Input
                                    hidden
                                    multiple
                                    ref={ this.fileInputRef }
                                    onChange={ this.onFileChanged } />
                        </Form.Row>
                        {this.state.attachedFiles.length > 0 ? <Form.Row className="grid-item">{attachments}</Form.Row> : null}
                    </Form>
                </Container>
            </>
        )
    }
}

export default withRouter(EntryEditor);