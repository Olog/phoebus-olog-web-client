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
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormFile from 'react-bootstrap/FormFile';
import Modal from 'react-bootstrap/Modal';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Attachment from '../Attachment/Attachment.js';
import customization from '../../utils/customization';
import EmbedImageDialog from './EmbedImageDialog';
import OlogAttachment from './OlogAttachment';
import PropertyEditor from './PropertyEditor';
import PropertySelector from './PropertySelector';
import { checkSession } from '../../api/olog-service.js';
import {removeImageMarkup, ologClientInfoHeader } from '../../utils/utils';
import HtmlPreview from './HtmlPreview';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';
import Select from 'react-select';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const EntryEditor = ({
    tags,
    logbooks,
    replyAction,
    userData, setUserData
}) => {

    const [selectedLogbooks, setSelectedLogbooks] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [level, setLevel] = useState(customization.defaultLevel);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [validated, setValidated] = useState(false);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [showAddProperty, setShowAddProperty] = useState(false);
    const [showEmbedImageDialog, setShowEmbedImageDialog] = useState(false);
    const [availableProperties, setAvailableProperties] = useState([]);
    const [showHtmlPreview, setShowHtmlPreview] = useState(false);
    const [createInProgress, setCreateInProgress] = useState(false);
    const currentLogEntry = useSelector(state => state.currentLogEntry);

    const fileInputRef = useRef();
    const titleRef = useRef();
    const descriptionRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {

        // If currentLogEntry is defined, use it as a "template", i.e. user is replying to a log entry.
        // Copy relevant fields to the state of this class, taking into account that a Reply
        // may or may not exist in the template.
        if(replyAction && currentLogEntry){
            setSelectedLogbooks(currentLogEntry.logbooks);
            setSelectedTags(currentLogEntry.tags);
            setLevel(customization.defaultLevel);
            titleRef.current.value = currentLogEntry.title;
        }

        getAvailableProperties();

    }, [replyAction, currentLogEntry]);

    // The below will ensure that when user has selected Reply and then New Log Entry,
    // the entry being edited does not contain any copied data.
    useEffect(() => {

        if(!replyAction) {
            setSelectedLogbooks([]);
            setSelectedTags([]);
            setLevel(customization.defaultLevel);
            setSelectedProperties([]);
            titleRef.current.value = "";
        }
        
    }, [replyAction])

    const getAvailableProperties = () => {
        ologService.get("/properties")
            .then(res =>  setAvailableProperties(res.data))
            .catch(e => {
                console.error("Could not fetch properties", e);
                setAvailableProperties([]);
            })
    }

    const logbookSelectionChanged = (selection) => {
        if(selection) {
            const logbookSelection = Object.values(selection).map(it => it.value);
            setSelectedLogbooks(logbookSelection)
        }
    }

    const tagSelectionChanged = (selection) => {
        if(selection) {
            const tagSelection = Object.values(selection).map(it => it.value);
            setSelectedTags(tagSelection);
        }
    }

    const entryTypeSelectionChanged = (selection) => {
        if(selection) {
            const level = selection.value;
            setLevel(level);
        }
    }

    const onBrowse = () => {
        fileInputRef.current.click();
    }
    
    const onFileChanged = (event) => {
        if(event.target.files){
            let a = [];
            for(let i = 0; i < event.target.files.length; i++){
                a[i] = new OlogAttachment(event.target.files[i], uuidv4());
            }
            setAttachedFiles([...attachedFiles, ...a])
        }
        fileInputRef.current.value = null;
    }

    /**
     * Removes attachment and - where applicable - updates the body/description.
     * @param {*} file 
     */
    const removeAttachment = (file) => {
        setAttachedFiles(attachedFiles.filter(item => item.file !== file.file));
        if(descriptionRef.current.value.indexOf(file.id) > -1){  // Find potential markup referencing the attachment
            let updatedDescription = removeImageMarkup(descriptionRef.current.value, file.id);
            descriptionRef.current.value = updatedDescription;
        }
    }

    /**
     * Uploading multiple attachments must be done in a synchronous manner. Using axios.all()
     * will upload only a single attachment, not sure why...
     * @param {*} id 
     * @returns 
     */
    const submitAttachmentsMulti = async (id) => {
        for (let i = 0; i < attachedFiles.length; i++) {
            let formData = new FormData();
            formData.append('file', attachedFiles[i].file);
            formData.append('id', attachedFiles[i].id);
            formData.append('filename', attachedFiles[i].file.name);
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

    const submit = (event) => {
        const checkValidity = event.currentTarget.checkValidity();
        event.preventDefault();
        var promise = checkSession();
        if(!promise){
            setUserData({});
            setCreateInProgress(false);
            return;
        }
        else{
            promise.then(data => {
                if(!data){
                    setUserData({});
                    setCreateInProgress(false);
                    return;
                }
                else{
                    const selectionsAreValid = selectedLogbooks.length > 0 && level !== null;
                    setValidated(true);
                    if (checkValidity && selectionsAreValid){
                        setCreateInProgress(true);
                        const logEntry = {
                            logbooks: selectedLogbooks,
                            tags: selectedTags,
                            properties: selectedProperties,
                            title: titleRef.current.value,
                            level: level,
                            description: descriptionRef.current.value
                        }
                        let url = replyAction ? 
                            `/logs?markup=commonmark&inReplyTo=${currentLogEntry.id}` :
                            `/logs?markup=commonmark`;
                        ologService.put(url, logEntry, { withCredentials: true, headers: ologClientInfoHeader() })
                            .then(res => {
                                if(attachedFiles.length > 0){ // No need to call backend if there are no attachments.
                                    submitAttachmentsMulti(res.data.id);
                                }
                                setCreateInProgress(false);
                                navigate('/');
                            })
                            .catch(error => {
                                if(error.response && (error.response.status === 401 || error.response.status === 403)){
                                    alert('You are currently not authorized to create a log entry.')
                                }
                                else if(error.response && (error.response.status >= 500)){
                                    alert('Failed to create log entry.')
                                }
                                setCreateInProgress(false);
                            });
                    }
                    return;
                }
            });
        }
    }

    const addProperty = (property) => {
        setSelectedProperties([...selectedProperties, property]);
        setShowAddProperty(false);
    }

    const getCommonmarkSrc = () => {
        return descriptionRef.current.value;
    }

    const getAttachedFiles = () => {
        return attachedFiles;
    }

    const removeProperty = (key) => {
        let properties = [...selectedProperties].filter(property => property.name !== key);
        setSelectedProperties(properties);
    }

    const addEmbeddedImage = (file, width, height) => {
        setShowEmbedImageDialog(false);
        const id = uuidv4();
        var imageMarkup = "![](attachment/" + id + "){width=" + width + " height=" + height + "}";
        descriptionRef.current.value += imageMarkup;
        const ologAttachment = new OlogAttachment(file, id);
        setAttachedFiles([...attachedFiles, ologAttachment]);
    }

    /**
     * Watch the horror!
     * @param {*} property 
     * @param {*} attribute 
     * @param {*} attributeValue 
     */
     const updateAttributeValue = (property, attribute, attributeValue) => {
        let copyOfSelectedProperties = [...selectedProperties];
        let propertyIndex = copyOfSelectedProperties.indexOf(property);
        let copyOfProperty = copyOfSelectedProperties[propertyIndex];
        let attributeIndex = copyOfProperty.attributes.indexOf(attribute);
        let copyOfAttribute = copyOfProperty.attributes[attributeIndex];
        copyOfAttribute.value = attributeValue;
        setSelectedProperties(copyOfSelectedProperties);
    }

    const asLogbookSelections = (logbooks) => {
        if(logbooks) {
            return logbooks.map(logbook => {
                return {
                    value: logbook,
                    label: logbook.name
                }
            })
        } else {
            return []
        }
    }

    const asTagSelections = (tags) => {
        if(tags) {
            return tags.map(tag => {
                return {
                    value: tag,
                    label: tag.name
                }
            })
        } else {
            return []
        }
    }

    const attachments = attachedFiles.map((file, index) => {
        return(
            <Attachment key={index} file={file} removeAttachment={removeAttachment}/>
        )
    })
    
    const propertyItems = selectedProperties.filter(property => property.name !== "Log Entry Group").map((property, index) => {
        return (
            <PropertyEditor key={index}
                property={property}
                removeProperty={removeProperty}
                updateAttributeValue={updateAttributeValue}/>
        )
    })

    const levelOptions = customization.levelValues.map(level => {
        return {
            value: level,
            label: level
        }
    });

    return(
        <>
            <LoadingOverlay
                active={createInProgress}
            >
            <Container fluid className="full-height">
                <Form noValidate validated={validated} onSubmit={submit}>
                    <Form.Row>
                        <Form.Label className="new-entry">New Log Entry</Form.Label>
                        <Button type="submit" disabled={userData.userName === "" || createInProgress}>Submit</Button>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label>Logbooks:</Form.Label>
                        <Select
                            isMulti
                            name="logbooks"
                            options={asLogbookSelections(logbooks.filter(avail => !selectedLogbooks.find(sel => sel.name === avail.name)))}
                            onChange={logbookSelectionChanged}
                            value={asLogbookSelections(selectedLogbooks)}
                            className="w-100"
                            placeholder="Select Logbook(s)"
                        />
                        {selectedLogbooks.length === 0 && 
                            <Form.Label className="form-error-label" column={true}>Select at least one logbook.</Form.Label>}
                    </Form.Row>
                    <Form.Row>
                        <Form.Label>Tags:</Form.Label>
                        <Select
                            isMulti
                            name="tags"
                            options={asTagSelections(tags.filter(avail => !selectedTags.find(sel => sel.name === avail.name)))}
                            onChange={tagSelectionChanged}
                            value={asTagSelections(selectedTags)}
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
                            onChange={entryTypeSelectionChanged}
                            className="w-100"
                            placeholder="Select Entry Type"
                        />
                        {(level === "" || !level) && 
                            <Form.Label className="form-error-label" column={true}>Select an entry type.</Form.Label>}
                    </Form.Row>
                    <Form.Row>
                        <Form.Label>Title:</Form.Label>
                        <Form.Control 
                            required
                            type="text" 
                            placeholder="Title" 
                            ref={titleRef}/>
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
                            ref={descriptionRef}/>
                    </Form.Row>
                    <Form.Row>
                        <Button variant="secondary" size="sm" onClick={ onBrowse }>
                            <span><FaPlus className="add-button"/></span>Add Attachments
                        </Button>
                        <FormFile.Input
                                hidden
                                multiple
                                ref={ fileInputRef }
                                onChange={ onFileChanged } />
                        <Button variant="secondary" size="sm" style={{marginLeft: "5px"}}
                                onClick={() => setShowEmbedImageDialog(true)}>
                            Embed Image
                        </Button>
                        <Button variant="secondary" size="sm" style={{marginLeft: "5px"}}
                                onClick={() => setShowHtmlPreview(true)}>
                            Preview
                            </Button>
                    </Form.Row>
                    </Form>
                    {attachedFiles.length > 0 ? <Form.Row className="grid-item">{attachments}</Form.Row> : null}
                    <Form.Label className="mt-3">Properties:</Form.Label>
                    {<Form.Row className="grid-item">
                        <Form.Group style={{width: "400px"}}>
                            <Button variant="secondary" size="sm" onClick={() => setShowAddProperty(true)}>
                                <span><FaPlus className="add-button"/></span>Add Property
                            </Button>
                            {propertyItems}              
                        </Form.Group>
                    </Form.Row>}
                </Container>
            </LoadingOverlay>
            
            {
            <Modal show={showAddProperty} onHide={() => setShowAddProperty(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Property</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PropertySelector 
                        availableProperties={availableProperties} 
                        selectedProperties={selectedProperties}
                        addProperty={addProperty}/>
                </Modal.Body>
            </Modal>
            }
            <EmbedImageDialog showEmbedImageDialog={showEmbedImageDialog} 
                setShowEmbedImageDialog={setShowEmbedImageDialog}
                addEmbeddedImage={addEmbeddedImage}/>

            <HtmlPreview showHtmlPreview={showHtmlPreview}
                setShowHtmlPreview={setShowHtmlPreview}
                getCommonmarkSrc={getCommonmarkSrc}
                getAttachedFiles={getAttachedFiles}/>
        </>
    );

}

export default EntryEditor;
