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
import { useGetPropertiesQuery } from '../../services/ologApi.js';
import MultiSelect from '../Input/MultiSelect.js';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

const EntryEditor = ({
     tags,
     logbooks,
     replyAction,
     userData, setUserData
 }) => {

    const { control, handleSubmit, getValues, setValue } = useForm();
    const { fields: attachments, remove: removeAttachment, append: appendAttachment } = useFieldArray({
        control,
        name: 'attachments',
        keyName: 'reactHookFormId' // default is 'id', which would override OlogAttachment#id
    })
    const { fields: properties, remove: removeProperty, append: appendProperty, update: updateProperty } = useFieldArray({
        control,
        name: 'properties',
        keyName: 'reactHookFormId' // default is 'id', which would override OlogAttachment#id
    })
    // File input HTML element ref allows us to hide
    // the element and click it from e.g. a button
    const fileInputRef = useRef(null);
    const [createInProgress, setCreateInProgress] = useState(false);
    const [showEmbedImageDialog, setShowEmbedImageDialog] = useState(false);
    const [showHtmlPreview, setShowHtmlPreview] = useState(false);
    const [showAddProperty, setShowAddProperty] = useState(false);
    const {data: availableProperties} = useGetPropertiesQuery();
    const currentLogEntry = useSelector(state => state.currentLogEntry);

    const navigate = useNavigate();

    /**
     * If currentLogEntry is defined, use it as a "template", i.e. user is replying to a log entry.
     * Copy relevant fields to the state of this class EXCEPT FOR entryType/level.
     * May or may not exist in the template.
     */
    useEffect(() => {
        
        if(replyAction && currentLogEntry){
            console.log('Replying')
            setValue('logbooks', currentLogEntry.logbooks)
            setValue('tags', currentLogEntry.tags);
            setValue('entryType', customization.defaultLevel);
            setValue('title', currentLogEntry.title);
        }

    }, [replyAction, currentLogEntry]);

    /**
     * Ensure that when user has selected Reply and then New Log Entry,
     * the entry being edited does not contain any copied data.
     */
    useEffect(() => {

        if(!replyAction) {
            setValue('logbooks', [])
            setValue('tags', []);
            setValue('entryType', customization.defaultLevel);
            setValue('properties', [])
            setValue('title', '');
        }
        
    }, [replyAction])


    /**
     * Appends an attachment object to the attachments form field
     * @param {*} event 
     */
    const onFileChanged = (event) => {
        if(event.target.files){
            // note event.target.files is a FileList, not an array! But we can convert it
            Array.from(event.target.files).forEach(file => {
                appendAttachment(new OlogAttachment(file, uuidv4()));
            });
        }
    }

    /**
     * When an attachment is removed, update the internal state
     * and also remove any embeds found in the description
     */
    const onAttachmentRemoved = (attachment, index) => {
        
        let description = getValues('description') || '';
        if(description.indexOf(attachment.id) > -1){  // Find potential markup referencing the attachment
            let updatedDescription = removeImageMarkup(description, attachment.id);
            setValue('description', updatedDescription);
        }
        removeAttachment(index);
    }
    
    /**
     * Inserts image markup into the description field
     * @param {*} file 
     * @param {*} width 
     * @param {*} height 
     */
    const addEmbeddedImage = (file, width, height) => {
        setShowEmbedImageDialog(false);
        const id = uuidv4();
        const imageMarkup = "![](attachment/" + id + "){width=" + width + " height=" + height + "}";
        let description = getValues('description') || '';
        description += imageMarkup;
        setValue('description', description);
        appendAttachment(new OlogAttachment(file, id));
    }

    /**
     * Update a property value and its attributes
     * @param {*} property to update
     * @param {*} attribute property attribute to update
     * @param {*} attributeValue value of attribute to update to
     */
     const updateAttributeValue = (index, property, attribute, attributeValue) => {
        let copyOfProperty = {...property};
        let attributeIndex = copyOfProperty.attributes.indexOf(attribute);
        let copyOfAttribute = copyOfProperty.attributes[attributeIndex];
        copyOfAttribute.value = attributeValue;
        updateProperty(index, copyOfProperty);
    }

    /**
     * Uploading multiple attachments must be done in a synchronous manner. Using axios.all()
     * will upload only a single attachment, not sure why...
     * @param {*} id 
     * @returns 
     */
     const submitAttachmentsMulti = async (id) => {
        for (let i = 0; i < attachments.length; i++) {
            let formData = new FormData();
            formData.append('file', attachments[i].file);
            formData.append('id', attachments[i].id);
            formData.append('filename', attachments[i].file.name);
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

    const onSubmit = (formData) => {

        const promise = checkSession();
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
                    setCreateInProgress(true);
                    const logEntry = {
                        logbooks: formData.logbooks,
                        tags: formData.tags,
                        properties: formData.properties,
                        title: formData.title,
                        level: formData.entryType.value,
                        description: formData.description
                    }
                    let url = replyAction ? 
                        `/logs?markup=commonmark&inReplyTo=${currentLogEntry.id}` :
                        `/logs?markup=commonmark`;
                    ologService.put(url, logEntry, { withCredentials: true, headers: ologClientInfoHeader() })
                        .then(res => {
                            if(attachments.length > 0){ // No need to call backend if there are no attachments.
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
                    return;
                }
            });
        }
    }

    /**
     * If attachments are present, creates a wrapper containing an array of Attachment components
     */
    const renderedAttachments = attachments.length > 0 
        ? <Form.Row className="grid-item">
            {attachments.map((attachment, index) => {
                return <Attachment key={index} attachment={attachment} removeAttachment={() => onAttachmentRemoved(attachment, index)}/>
            })}
        </Form.Row> 
        : null;

    const renderedProperties = properties.filter(property => property.name !== "Log Entry Group").map((property, index) => {
        return (
            <PropertyEditor key={index}
                index={index}
                property={property}
                removeProperty={removeProperty}
                updateAttributeValue={updateAttributeValue}/>
        );
    })

    return (
        <>
            <LoadingOverlay
                active={createInProgress}
            >
                <Container fluid className="full-height">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Row>
                            <Form.Label className="new-entry">New Log Entry</Form.Label>
                            <Button type="submit" disabled={userData.userName === "" || createInProgress}>Submit</Button>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group controlId='logbooks' className='w-100'>
                                <Form.Label>Logbooks:</Form.Label>
                                <Controller
                                    name='logbooks'
                                    control={control}
                                    defaultValue={[]}
                                    rules={{validate: val => val.length > 0}}
                                    render={({field, fieldState})=>
                                        <>
                                            <MultiSelect
                                                inputId={field.name}
                                                options={logbooks.map(it => (
                                                    {label: it.name, value: it}
                                                ))}
                                                selection={field.value.map(it => (
                                                    {label: it.name, value: it}
                                                ))}
                                                onSelectionChanged={it => 
                                                    field.onChange(it.map(item => item.value))
                                                }
                                                className="w-100"
                                                placeholder="Select Logbook(s)"
                                            />
                                            {fieldState.error &&  
                                                <Form.Label className="form-error-label" column={true}>Select at least one logbook.</Form.Label>
                                            }
                                        </>
                                    }
                                />
                                
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group controlId='tags' className='w-100'>
                                <Form.Label>Tags:</Form.Label>
                                <Controller 
                                    name='tags'
                                    control={control}
                                    defaultValue={[]}
                                    render={({field}) => 
                                        <>
                                            <MultiSelect
                                                inputId={field.name}
                                                options={tags.map(it => (
                                                    {label: it.name, value: it}
                                                ))}
                                                selection={field.value.map(it => (
                                                    {label: it.name, value: it}
                                                ))}
                                                onSelectionChanged={it => field.onChange(it.map(item => item.value))}
                                                className="w-100"
                                                placeholder="Select Tag(s)"
                                            />
                                        </>
                                }/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group controlId='entryType' className='w-100'>
                                <Form.Label>Entry Type:</Form.Label>
                                {/* 
                                    EntryType is a string value, however there
                                    are many possible values to pick from so it
                                    is presented as a select input.
                                */}
                                <Controller 
                                    name='entryType'
                                    control={control}
                                    defaultValue={customization.defaultLevel}
                                    rules={{required: true}}
                                    render={({field, fieldState}) =>{
                                        console.log({field})
                                        return (<>
                                            <Select
                                                name={field.name}
                                                inputId={field.name}
                                                options={customization.levelValues.map(it => (
                                                    { value: it, label: it }
                                                ))}
                                                onChange={it => field.onChange(it.value)}
                                                value={
                                                    { value: field.value, label: field.value }
                                                }
                                                className="w-100"
                                                placeholder="Select Entry Type"
                                            />
                                            {fieldState.error && 
                                                <Form.Label className="form-error-label" column={true}>Select an entry type.</Form.Label>}
                                        </>)
                                    }
                                }/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group controlId='title' className='w-100'>
                                <Form.Label>Title:</Form.Label>
                                <Controller 
                                    name='title'
                                    control={control}
                                    rules={{required: true}}
                                    render={({field, fieldState})=>
                                        <>
                                            <Form.Control 
                                                onChange={field.onChange} 
                                                value={field.value} 
                                                ref={field.ref}
                                                type="text" 
                                                placeholder="Title" 
                                                isInvalid={fieldState.error}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please specify a title.
                                            </Form.Control.Feedback>
                                        </>
                                }/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group controlId='description' className='w-100'>    
                                <Form.Label>Description:</Form.Label>
                                <Controller 
                                    name='description'
                                    control={control}
                                    rules={{required: true}}
                                    render={({field, fieldState})=>
                                        <>
                                            <Form.Control
                                                onChange={field.onChange} 
                                                value={field.value} 
                                                ref={field.ref}
                                                as="textarea" 
                                                rows="5" 
                                                placeholder="Description"
                                                isInvalid={fieldState.error}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please include a description.
                                            </Form.Control.Feedback>
                                        </>
                                }/>
                                
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            {/* note file inputs are uncontrolled, especially in this case where the user can upload many attachments */}
                            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click() }>
                                    <span><FaPlus className="add-button"/></span>Add Attachments
                            </Button>
                            <FormFile.Input
                                ref={fileInputRef}
                                multiple
                                onChange={event => onFileChanged(event) } 
                                hidden
                            />
                            
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
                    { renderedAttachments }
                    <Form.Label className="mt-3">Properties:</Form.Label>
                    {<Form.Row className="grid-item">
                        <Form.Group style={{width: "400px"}}>
                            <Button variant="secondary" size="sm" onClick={() => setShowAddProperty(true)}>
                                <span><FaPlus className="add-button"/></span>Add Property
                            </Button>
                            {renderedProperties}              
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
                            selectedProperties={properties}
                            addProperty={appendProperty}/>
                    </Modal.Body>
                </Modal>
            }
            <EmbedImageDialog showEmbedImageDialog={showEmbedImageDialog} 
                setShowEmbedImageDialog={setShowEmbedImageDialog}
                addEmbeddedImage={addEmbeddedImage}/>
            <HtmlPreview showHtmlPreview={showHtmlPreview}
                setShowHtmlPreview={setShowHtmlPreview}
                getCommonmarkSrc={() => getValues('description')}
                getAttachedFiles={() => attachments}/>

        </>
    );
 }

 export default EntryEditor;