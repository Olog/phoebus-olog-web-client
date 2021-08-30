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
import axios from 'axios';
import queryString from 'query-string';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import FormFile from 'react-bootstrap/FormFile';
import Modal from 'react-bootstrap/Modal';
import { FaPlus } from 'react-icons/fa';
import { withRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Attachment from './Attachment.js';
import customization from './customization';
import EmbedImageDialog from './EmbedImageDialog';
import OlogAttachment from './OlogAttachment';
import PropertyEditor from './PropertyEditor';
import PropertySelector from './PropertySelector';
import Selection from './Selection';
import checkSession from './session-check';
import { getLogEntryGroupId, newLogEntryGroup, removeImageMarkup } from './utils';

class EntryEditor extends Component{

    state = {
        selectedLogbooks: [],
        selectedTags: [],
        level: "",
        attachedFiles: [],
        validated: false,
        logbookSelectionValid: true,
        levelSelectionValid: true,
        selectedProperties: [],
        showAddProperty: false,
        showEmbedImageDialog: false,
        logEntryGroupProperty: null,
        availableProperties: []
    }

    fileInputRef = React.createRef();
    titleRef = React.createRef();
    descriptionRef = React.createRef();
    isReply = false;

    componentDidMount = () => {
        this.isReply = queryString.parse(this.props.location.search).isReply === 'true';
        
        // If currentLogEntry is defined, use it as a "template", i.e. user is replying to a log entry.
        // Copy relevant fields to the state of this class, taking into account that a Log Entry Group
        // may or may not exist in the template.
        if(this.isReply && this.props.currentLogEntry){
            let p = [];
            this.props.currentLogEntry.properties.forEach((property, i) => {
                p.push(property);
            });
            if(!getLogEntryGroupId(this.props.currentLogEntry.properties)){
                let property = newLogEntryGroup();
                this.setState({logEntryGroupPoroperty: property});
                p.push(property);
            }
            this.setState({
                selectedLogbooks: this.props.currentLogEntry.logbooks,
                selectedTags: this.props.currentLogEntry.tags,
                level: this.props.currentLogEntry.level,
                selectedProperties: p
            });
            this.titleRef.current.value = this.props.currentLogEntry.title;
        }
        this.getAvailableProperties();
    }

    getAvailableProperties = () => {
        fetch(`${process.env.REACT_APP_BASE_URL}/properties`)
        .then(response => response.json())
        .then(data => this.setState({availableProperties: data}))
        .catch(() => this.setState({availableProperties: []}));
    }
    
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
            let a = [];
            for(var i = 0; i < event.target.files.length; i++){
                a[i] = new OlogAttachment(event.target.files[i], uuidv4());
            }
            this.setState({attachedFiles: [...this.state.attachedFiles, ...a]});
        }
        this.fileInputRef.current.value = null;
    }

    /**
     * Removes attachment and - where applicable - updates the body/description.
     * @param {*} file 
     */
    removeAttachment = (file) => {
        this.setState({attachedFiles: this.state.attachedFiles.filter(item => item.file !== file.file)});
        if(this.descriptionRef.current.value.indexOf(file.id) > -1){  // Find potential markup referencing the attachment
            let updatedDescription = removeImageMarkup(this.descriptionRef.current.value, file.id);
            this.descriptionRef.current.value = updatedDescription;
        }
    }

    /**
     * Uploading multiple attachments must be done in a synchronous manner. Using axios.all()
     * will upload only a single attachment, not sure why...
     * @param {*} id 
     * @returns 
     */
    submitAttachmentsMulti = async (id) => {
        for (var i = 0; i < this.state.attachedFiles.length; i++) {
            let formData = new FormData();
            formData.append('file', this.state.attachedFiles[i].file);
            formData.append('id', this.state.attachedFiles[i].id);
            formData.append('filename', this.state.attachedFiles[i].file.name);
            await axios.post(`${process.env.REACT_APP_BASE_URL}/logs/attachments/` + id, 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                });
        }
    }

    updateCurrentLogEntry = () => {
        const logEntry = {
            id: this.props.currentLogEntry.id,
            logbooks: this.props.currentLogEntry.logbooks,
            tags: this.props.currentLogEntry.logbooks.tags,
            properties: this.state.selectedProperties,
            title: this.props.currentLogEntry.title,
            level: this.props.currentLogEntry.level,
            description: this.props.currentLogEntry.source,
            source: null
        };
        const { history } = this.props;
        axios.post(`${process.env.REACT_APP_BASE_URL}/logs/` + this.props.currentLogEntry.id + `?markup=commonmark`, logEntry, { withCredentials: true })
        .then(res => history.push('/'))
        .catch(error => {
            if(error.response && (error.response.status === 401 || error.response.status === 403)){
                alert('You are currently not authorized to create a log entry.')
            }
            else if(error.response && (error.response.status >= 500)){
                alert('Failed to create log entry.')
            }
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
        var promise = checkSession();
        if(!promise){
            this.props.setShowLogin(true);
            return;
        }
        else{
            promise.then(data => {
                if(!data){
                    this.props.setShowLogin(true);
                    return;
                }
            });
        }

        const selectionsAreValid = this.selectionsValid();
        const form = event.currentTarget;        
        this.setState({validated: true});

        if (form.checkValidity() === true && selectionsAreValid){
            const { history } = this.props;
            const logEntry = {
                logbooks: this.state.selectedLogbooks,
                tags: this.state.selectedTags,
                properties: this.state.selectedProperties,
                title: this.titleRef.current.value,
                level: this.state.level,
                description: this.descriptionRef.current.value
            }
            axios.put(`${process.env.REACT_APP_BASE_URL}/logs?markup=commonmark`, logEntry, { withCredentials: true })
                .then(res => {
                    if(this.state.attachedFiles.length > 0){ // No need to call backend if there are no attachments.
                        this.submitAttachmentsMulti(res.data.id);
                    }
                    // If the currentLogRecord is defined then user is creating a reply entry. So we need to update the currentLogRecord 
                    // with the Log Entry Group, but only if the currentLogRecord does not yet contain it.
                    if(this.isReply && !getLogEntryGroupId(this.props.currentLogEntry.properties)){    
                        this.updateCurrentLogEntry();
                    }
                    else{
                        history.push('/');
                    }
                })
                .catch(error => {
                    if(error.response && (error.response.status === 401 || error.response.status === 403)){
                        alert('You are currently not authorized to create a log entry.')
                    }
                    else if(error.response && (error.response.status >= 500)){
                        alert('Failed to create log entry.')
                    }
                });
            
        }
    }

    selectLevel = (level) => {
        this.setState({level: level}, () => this.setState({levelSelectionValid: level !== ""}));
    }

    addProperty = (property) => {
        this.setState({selectedProperties: [...this.state.selectedProperties, property],
            showAddProperty: false});
    }

    setShowEmbeddImageDialog = (show) => {
        this.setState({showEmbedImageDialog: show});
    }

    removeProperty = (key) => {
        let properties = [...this.state.selectedProperties].filter(property => property.name !== key);
        this.setState({selectedProperties: properties});
    }

    addEmbeddedImage = (file, width, height) => {
        this.setState({showEmbedImageDialog: false});
        const id = uuidv4();
        var imageMarkup = "![](attachment/" + id + "){width=" + width + " height=" + height + "}";
        this.descriptionRef.current.value += imageMarkup;
        const ologAttachment = new OlogAttachment(file, id);
        this.setState({attachedFiles: [...this.state.attachedFiles, ologAttachment]});
    }

    /**
     * Watch the horror!
     * @param {*} property 
     * @param {*} attribute 
     * @param {*} attributeValue 
     */
    updateAttributeValue = (property, attribute, attributeValue) => {
        let copyOfSelectedProperties = [...this.state.selectedProperties];
        let propertyIndex = copyOfSelectedProperties.indexOf(property);
        let copyOfProperty = copyOfSelectedProperties[propertyIndex];
        let attributeIndex = copyOfProperty.attributes.indexOf(attribute);
        let copyOfAttribute = copyOfProperty.attributes[attributeIndex];
        copyOfAttribute.value = attributeValue;
        this.setState({selectedProperties: copyOfSelectedProperties});
    }

    render(){

        var logbookItems = this.props.logbooks.sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
            return (
                <Dropdown.Item key={index}  
                    style={{fontSize: "12px", paddingBottom: "1px"}}
                    eventKey={index} 
                    onSelect={() => this.addLogbook(row)}>{row.name}</Dropdown.Item>
            )
        });

        var tagItems = this.props.tags.sort((a, b) => a.name.localeCompare(b.name)).map((row, index) => {
            return (
                <Dropdown.Item key={index} 
                    style={{fontSize: "12px", paddingBottom: "1px"}}
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

        let levels = customization.levelValues.split(",");

        const doUpload = this.props.fileName !== '';
        
        var propertyItems = this.state.selectedProperties.filter(property => property.name !== "Log Entry Group").map((property, index) => {
            return (
                <PropertyEditor key={index}
                    property={property}
                    removeProperty={this.removeProperty}
                    updateAttributeValue={this.updateAttributeValue}/>
            )
        })

        return(
            <>
                <Container fluid className="full-height">
                    <Form noValidate validated={this.state.validated} onSubmit={this.submit}>
                        <Form.Row>
                            <Form.Label className="new-entry">New Log Entry</Form.Label>
                            <Button type="submit" disabled={this.props.userData.userName === ""}>Create</Button>
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
                                    {customization.level}                                
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                {levels.map((level, index) => (
                                    <Dropdown.Item eventKey={index}
                                    style={{fontSize: "12px", paddingBottom: "1px"}}
                                    key={index}
                                    onSelect={() => this.selectLevel(level)}>{level}</Dropdown.Item>
                                ))}
                                </Dropdown.Menu>
                            </Dropdown>&nbsp;
                            {this.state.level && <div className="selection">{this.state.level}</div>}
                            {this.state.levelSelectionValid ? null : <Form.Label className="form-error-label" column={true}>Select an Entry Type.</Form.Label>}
                        </Form.Row>
                        <Form.Row className="grid-item">
                            <Form.Control 
                                required
                                type="text" 
                                placeholder="Title" 
                                ref={this.titleRef}/>
                            <Form.Control.Feedback type="invalid">
                                Please specify a title.
                            </Form.Control.Feedback>
                        </Form.Row>
                        <Form.Row className="grid-item">
                            <Form.Control
                                as="textarea" 
                                rows="5" 
                                placeholder="Description"
                                ref={this.descriptionRef}/>
                        </Form.Row>
                        <Form.Row>
                            <Button variant="secondary" size="sm"
                                    onClick={ doUpload && this.props.onUploadStarted ? this.props.onUploadStarted : this.onBrowse }>
                                <span><FaPlus className="add-button"/></span>Add Attachments
                            </Button>
                            <FormFile.Input
                                    hidden
                                    multiple
                                    ref={ this.fileInputRef }
                                    onChange={ this.onFileChanged } />
                            <Button variant="secondary" size="sm" style={{marginLeft: "5px"}}
                                    onClick={() => this.setState({showEmbedImageDialog: true})}>
                                Embed Image
                            </Button>
                        </Form.Row>
                        </Form>
                        {this.state.attachedFiles.length > 0 ? <Form.Row className="grid-item">{attachments}</Form.Row> : null}
                        {<Form.Row className="grid-item">
                            <Form.Group style={{width: "400px"}}>
                                <Button variant="secondary" size="sm" onClick={() => this.setState({showAddProperty: true})}>
                                    <span><FaPlus className="add-button"/></span>Add Property
                                </Button>
                                {propertyItems}              
                            </Form.Group>
                                </Form.Row>}
                </Container>
                {
                <Modal show={this.state.showAddProperty} onHide={() => this.setState({showAddProperty: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Property</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PropertySelector 
                            availableProperties={this.state.availableProperties} 
                            selectedProperties={this.state.selectedProperties}
                            addProperty={this.addProperty}/>
                    </Modal.Body>
                </Modal>
                }
                <EmbedImageDialog showEmbedImageDialog={this.state.showEmbedImageDialog} 
                    setShowEmbedImageDialog={this.setShowEmbeddImageDialog}
                    addEmbeddedImage={this.addEmbeddedImage}/>
            </>
        )
    }
}

export default withRouter(EntryEditor);