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
import Input from 'react-select';

const EntryEditor = ({
     tags,
     logbooks,
     replyAction,
     userData, setUserData
 }) => {

    const { register, control, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm();
    const { fields: attachments, remove: removeAttachment, append: appendAttachment } = useFieldArray({
        control,
        name: 'attachments',
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
    const [selectedProperties, setSelectedProperties] = useState([]);

    const onSubmit = (data) => {
        console.log(data);
    }

    console.log({attachments})

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
     * If attachments are present, creates a wrapper containing an array of Attachment components
     */
    const renderedAttachments = attachments.length > 0 ? 
        <Form.Row className="grid-item">
            {attachments.map((attachment, index) => {
                return <Attachment key={index} attachment={attachment} removeAttachment={() => removeAttachment(index)}/>
            })}
        </Form.Row> 
        : null;

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
                            <Form.Group controlId='entryTypes' className='w-100'>
                                <Form.Label>Entry Type:</Form.Label>
                                <Controller 
                                    name='entryType'
                                    control={control}
                                    defaultValue={customization.defaultLevel}
                                    rules={{required: true}}
                                    render={({field, fieldState}) =>
                                        <>
                                            <Select
                                                name={field.name}
                                                inputId={field.name}
                                                options={customization.levelValues.map(it => (
                                                    { value: it, label: it }
                                                ))}
                                                defaultInputValue={customization.defaultLevel}
                                                onChange={field.onChange}
                                                className="w-100"
                                                placeholder="Select Entry Type"
                                            />
                                            {fieldState.error && 
                                                <Form.Label className="form-error-label" column={true}>Select an entry type.</Form.Label>}
                                        </>
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
                                    render={({field})=>
                                        <Form.Control
                                            onChange={field.onChange} 
                                            value={field.value} 
                                            ref={field.ref}
                                            as="textarea" 
                                            rows="5" 
                                            placeholder="Description"
                                        />
                                }/>
                                
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            {/* file inputs are uncontrolled, especially in this case where the user can upload many attachments */}
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
                </Container>
            </LoadingOverlay>
            {/* {
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
            } */}
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