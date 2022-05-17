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
import ologService from '../../api/olog-service.js';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import FormFile from 'react-bootstrap/FormFile';
import Modal from 'react-bootstrap/Modal';
import { FaPlus } from 'react-icons/fa';
import { withRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Attachment from '../Attachment/Attachment.js';
import customization from '../../utils/customization';
import EmbedImageDialog from './EmbedImageDialog';
import OlogAttachment from './OlogAttachment';
import PropertyEditor from './PropertyEditor';
import PropertySelector from './PropertySelector';
import checkSession from '../../api/session-check';
import {removeImageMarkup, ologClientInfoHeader } from '../../utils/utils';
import HtmlPreview from './HtmlPreview';
import LoadingOverlay from 'react-loading-overlay';
import Select from 'react-select';

class EntryEditor extends Component{

    state = {
        selectedLogbooks: [],
        selectedTags: [],
        level: customization.defaultLevel,
        attachedFiles: [],
        validated: false,
        selectedProperties: [],
        showAddProperty: false,
        showEmbedImageDialog: false,
        logEntryGroupProperty: null,
        availableProperties: [],
        showHtmlPreview: false,
        createInProgress: false
    }

    fileInputRef = React.createRef();
    titleRef = React.createRef();
    descriptionRef = React.createRef();
   
    componentDidMount = () => { 
        // If currentLogEntry is defined, use it as a "template", i.e. user is replying to a log entry.
        // Copy relevant fields to the state of this class, taking into account that a Reply
        // may or may not exist in the template.
        if(this.props.replyAction && this.props.currentLogEntry){
            let p = [];
            this.props.currentLogEntry.properties.forEach((property, i) => {
                p.push(property);
            });
            this.setState({
                selectedLogbooks: this.props.currentLogEntry.logbooks,
                selectedTags: this.props.currentLogEntry.tags,
                level: customization.defaultLevel,
                selectedProperties: p
            });
            this.titleRef.current.value = this.props.currentLogEntry.title;
        }

        this.getAvailableProperties();
    }

    componentDidUpdate = (nextProps, nextState) => {
        // The below will ensure that when user has selected Reply and then New Log Entry,
        // the entry being edited does not contain any copied data.
        if(nextProps.replyAction !== this.props.replyAction){
            this.setState({selectedLogbooks: [], 
                selectedTags: [], 
                level: customization.defaultLevel, 
                selectedProperties: []});
            this.titleRef.current.value = "";
        }
    }

    getAvailableProperties = () => {
        fetch(`${process.env.REACT_APP_BASE_URL}/properties`)
        .then(response => response.json())
        .then(data => this.setState({availableProperties: data}))
        .catch(() => this.setState({availableProperties: []}));
    }

    logbookSelectionChanged = (selection) => {
        if(selection) {
            const logbookSelection = Object.values(selection).map(it => it.value);
            this.setState({selectedLogbooks: logbookSelection});
        }
    }

    tagSelectionChanged = (selection) => {
        if(selection) {
            const tagSelection = Object.values(selection).map(it => it.value);
            this.setState({selectedTags: tagSelection});
        }
    }

    entryTypeSelectionChanged = (selection) => {
        if(selection) {
            const level = selection.value;
            this.setState({level: level});
        }
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
            await ologService.post(`/logs/attachments/${id}`, 
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

    selectionsValid = () => {
        this.setState({logbookSelectionValid: this.state.selectedLogbooks.length > 0});
        return this.state.logbookSelectionValid;
    }


    submit = (event) => {
        const checkValidity = event.currentTarget.checkValidity();
        event.preventDefault();
        var promise = checkSession();
        if(!promise){
            this.props.setUserData({});
            this.setState({createInProgress: false});
            return;
        }
        else{
            promise.then(data => {
                if(!data){
                    this.props.setUserData({});
                    this.setState({createInProgress: false});
                    return;
                }
                else{
                    const selectionsAreValid = this.state.selectedLogbooks.length > 0 && this.state.level !== null;
                    this.setState({validated: true});
                    if (checkValidity && selectionsAreValid){
                        this.setState({createInProgress: true});
                        const { history } = this.props;
                        const logEntry = {
                            logbooks: this.state.selectedLogbooks,
                            tags: this.state.selectedTags,
                            properties: this.state.selectedProperties,
                            title: this.titleRef.current.value,
                            level: this.state.level,
                            description: this.descriptionRef.current.value
                        }
                        let url = this.props.replyAction ? 
                            `/logs?markup=commonmark&inReplyTo=${this.props.currentLogEntry.id}` :
                            `/logs?markup=commonmark`;
                        ologService.put(url, logEntry, { withCredentials: true, headers: ologClientInfoHeader() })
                            .then(res => {
                                if(this.state.attachedFiles.length > 0){ // No need to call backend if there are no attachments.
                                    this.submitAttachmentsMulti(res.data.id);
                                }
                                this.setState({createInProgress: false});
                                history.push('/');
                            })
                            .catch(error => {
                                if(error.response && (error.response.status === 401 || error.response.status === 403)){
                                    alert('You are currently not authorized to create a log entry.')
                                }
                                else if(error.response && (error.response.status >= 500)){
                                    alert('Failed to create log entry.')
                                }
                                this.setState({createInProgress: false});
                            });
                    }
                    return;
                }
            });
        }
    }

    addProperty = (property) => {
        this.setState({selectedProperties: [...this.state.selectedProperties, property],
            showAddProperty: false});
    }

    setShowEmbeddImageDialog = (show) => {
        this.setState({showEmbedImageDialog: show});
    }

    setShowHtmlPreview = (show) => {
        this.setState({showHtmlPreview: show});
    }

    getCommonmarkSrc = () => {
        return this.descriptionRef.current.value;
    }

    getAttachedFiles = () => {
        return this.state.attachedFiles;
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

        var attachments = this.state.attachedFiles.map((file, index) => {
            return(
                <Attachment key={index} file={file} removeAttachment={this.removeAttachment}/>
            )
        })

        const doUpload = this.props.fileName !== '';
        
        var propertyItems = this.state.selectedProperties.filter(property => property.name !== "Log Entry Group").map((property, index) => {
            return (
                <PropertyEditor key={index}
                    property={property}
                    removeProperty={this.removeProperty}
                    updateAttributeValue={this.updateAttributeValue}/>
            )
        })

        const logbookOptions = this.props.logbooks.map(logbook => {
            return {
                value: logbook,
                label: logbook.name
            }
        });

        const tagOptions = this.props.tags.map(tag => {
            return {
                value: tag.name,
                label: tag.name
            }
        });

        const levelOptions = customization.levelValues.map(level => {
            return {
                value: level,
                label: level
            }
        });

        return(
            <>
                <LoadingOverlay
                            active={this.state.createInProgress}
                            spinner
                            styles={{
                                overlay: (base) => ({
                                ...base,
                                background: 'rgba(97, 97, 97, 0.3)',
                                '& svg circle': {stroke: 'rgba(19, 68, 83, 0.9) !important'}
                                })
                            }}>
                <Container fluid className="full-height">
                    <Form noValidate validated={this.state.validated} onSubmit={this.submit}>
                        <Form.Row>
                            <Form.Label className="new-entry">New Log Entry</Form.Label>
                            <Button type="submit" disabled={this.props.userData.userName === "" || this.state.createInProgress}>Create</Button>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Logbooks:</Form.Label>
                            <Select
                                isMulti
                                name="logbooks"
                                options={logbookOptions}
                                onChange={this.logbookSelectionChanged}
                                className="w-100"
                                placeholder="Select Logbook(s)"
                            />
                            {this.state.selectedLogbooks.length === 0 && 
                                <Form.Label className="form-error-label" column={true}>Select at least one logbook.</Form.Label>}
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Tags:</Form.Label>
                            <Select
                                isMulti
                                name="tags"
                                options={tagOptions}
                                onChange={this.tagSelectionChanged}
                                className="w-100"
                                placeholder="Select Tag(s)"
                            />
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Entry Type:</Form.Label>
                            <Select
                                name="entryTypes"
                                options={levelOptions}
                                defaultInputValue={customization.defaultLevel}
                                onChange={this.entryTypeSelectionChanged}
                                className="w-100"
                                placeholder="Select Entry Type"
                            />
                            {(this.state.level === "" || !this.state.level) && 
                                <Form.Label className="form-error-label" column={true}>Select an entry type.</Form.Label>}
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Title:</Form.Label>
                            <Form.Control 
                                required
                                type="text" 
                                placeholder="Title" 
                                ref={this.titleRef}/>
                            <Form.Control.Feedback type="invalid">
                                Please specify a title.
                            </Form.Control.Feedback>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Description:</Form.Label>
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
                            <Button variant="secondary" size="sm" style={{marginLeft: "5px"}}
                                    onClick={() => this.setState({showHtmlPreview: true})}>
                                Preview
                                </Button>
                        </Form.Row>
                        </Form>
                        {this.state.attachedFiles.length > 0 ? <Form.Row className="grid-item">{attachments}</Form.Row> : null}
                        <Form.Label className="mt-3">Properties:</Form.Label>
                        {<Form.Row className="grid-item">
                            <Form.Group style={{width: "400px"}}>
                                <Button variant="secondary" size="sm" onClick={() => this.setState({showAddProperty: true})}>
                                    <span><FaPlus className="add-button"/></span>Add Property
                                </Button>
                                {propertyItems}              
                            </Form.Group>
                        </Form.Row>}
                        </Container>
                    </LoadingOverlay>
                
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

                <HtmlPreview showHtmlPreview={this.state.showHtmlPreview}
                    setShowHtmlPreview={this.setShowHtmlPreview}
                    getCommonmarkSrc={this.getCommonmarkSrc}
                    getAttachedFiles={this.getAttachedFiles}/>
            </>
        )
    }
}

export default withRouter(EntryEditor);
