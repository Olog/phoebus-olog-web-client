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
import ologService from 'api/olog-service';
import Button from '../shared/Button';
import Form from 'react-bootstrap/Form';
import Modal, {Header, Title, Body} from 'components/shared/Modal';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Attachment from 'components/Attachment';
import customization from 'utils/customization';
import EmbedImageDialog from './EmbedImageDialog';
import OlogAttachment from './OlogAttachment';
import PropertyEditor from './PropertyEditor';
import PropertySelector from './PropertySelector';
import { checkSession } from 'api/olog-service';
import {removeImageMarkup, ologClientInfoHeader } from 'utils';
import HtmlPreview from './HtmlPreview';
import LoadingOverlay from 'components/shared/LoadingOverlay';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetPropertiesQuery } from 'services/ologApi';
import MultiSelect from 'components/shared/input/MultiSelect';
import { useFieldArray, useForm } from 'react-hook-form';
import useFormPersist from 'react-hook-form-persist'
import TextInput from 'components/shared/input/TextInput';
import styled from 'styled-components';
import FileInput from 'components/shared/input/FileInput';

const Container = styled.div`
    padding: 0.5rem 0;
`

const FileInputContainer = styled.div`
    display: flex;
    gap: 1rem;
    padding: 0 1rem;
`

const ButtonContent = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`

const RenderedAttachmentsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
`

const PropertiesContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 0.5rem;
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;
    padding: 0.5rem;
    margin: 0.5rem;
`

const EntryEditor = ({
     tags,
     logbooks,
     replyAction,
     userData, setUserData
    }) => {

    const { control, handleSubmit, getValues, setValue, watch } = useForm();
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
    // const fileInputRef = useRef(null);
    const [createInProgress, setCreateInProgress] = useState(false);
    const [showEmbedImageDialog, setShowEmbedImageDialog] = useState(false);
    const [showHtmlPreview, setShowHtmlPreview] = useState(false);
    const [showAddProperty, setShowAddProperty] = useState(false);
    const {data: availableProperties} = useGetPropertiesQuery();
    const currentLogEntry = useSelector(state => state.currentLogEntry);

    const navigate = useNavigate();

    /**
     * Save/restore form data
     */
    const {clear: clearFormData } = useFormPersist( 'entryEditorFormData', {
        watch,
        setValue,
        storage: window.localStorage,
        exclude: 'attachments' // serializing files is unsupported due to security risks
    });
    
    /**
     * If currentLogEntry is defined, use it as a "template", i.e. user is replying to a log entry.
     * Copy relevant fields to the state of this class EXCEPT FOR entryType/level.
     * May or may not exist in the template.
     */
    useEffect(() => {
        
        if(replyAction && currentLogEntry){
            clearFormData();
            setValue('logbooks', currentLogEntry.logbooks)
            setValue('tags', currentLogEntry.tags);
            setValue('entryType', customization.defaultLevel);
            setValue('title', currentLogEntry.title);
        }

    }, [replyAction, currentLogEntry, setValue, clearFormData]);

    /**
     * Appends an attachment object to the attachments form field
     * @param {*} event 
     */
    const onFileChanged = (files) => {
        if(files) {
            // note event.target.files is a FileList, not an array! But we can convert it
            Array.from(files).forEach(file => {
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
        setValue('description', description, {shouldDirty: false, shouldTouch: false, shouldValidate: false});
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
                            clearFormData();
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
    const renderedAttachments = attachments.map((attachment, index) => {
        return <Attachment key={index} attachment={attachment} removeAttachment={() => onAttachmentRemoved(attachment, index)}/>
    });

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
                <Container>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Row>
                            <Form.Label className="new-entry">New Log Entry</Form.Label>
                            <Button variant="primary" disabled={userData.userName === "" || createInProgress}>Submit</Button>
                        </Form.Row>
                        <MultiSelect
                            name='logbooks'
                            label='Logbooks'
                            control={control}
                            defaultValue={[]}
                            options={logbooks.map(it => (
                                {label: it.name, value: it}
                            ))}
                            onSelection={value => value.map(it => (
                                {label: it.name, value: it}
                            ))}
                            onSelectionChanged={(field, value) => 
                                field.onChange(value.map(it => it.value))
                            }
                        />
                        <MultiSelect 
                            name='tags'
                            label='Tags'
                            control={control}
                            defaultValue={[]}
                            options={tags.map(it => (
                                {label: it.name, value: it}
                            ))}
                            onSelection={value => value.map(it => (
                                {label: it.name, value: it}
                            ))}
                            onSelectionChanged={(field, value) => 
                                field.onChange(value.map(it => it.value))
                            }
                        />
                        <MultiSelect 
                            name='entryType'
                            label='Entry Type'
                            control={control}
                            defaultValue={customization.defaultLevel}
                            options={customization.levelValues.map(it => (
                                { value: it, label: it }
                            ))}
                            onSelection={sel =>( 
                                { value: sel, label: sel }
                            )}
                            onSelectionChanged={(field, sel) => 
                                field.onChange(sel.value)
                            }
                            isMulti={false}
                        />
                        <TextInput 
                            name='title'
                            label='Title'
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Please specify a title.'
                                }
                            }}
                        />
                        <TextInput 
                            name='description'
                            label='Description'
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Please include a description.'
                                }
                            }}
                            textArea
                            rows={10}
                        />
                        <FileInputContainer>
                            <FileInput 
                                label='Add Attachments'
                                onFileChanged={onFileChanged}
                            />
                            <Button variant="secondary" size="sm" style={{marginLeft: "5px"}}
                                    onClick={() => setShowEmbedImageDialog(true)}>
                                Embed Image
                            </Button>
                            <Button variant="secondary" size="sm" style={{marginLeft: "5px"}}
                                    onClick={() => setShowHtmlPreview(true)}>
                                Preview
                            </Button>
                        </FileInputContainer>
                    </Form>
                    <RenderedAttachmentsContainer>
                        { renderedAttachments }
                    </RenderedAttachmentsContainer>
                    <PropertiesContainer>
                        <Button variant="secondary" size="sm" onClick={() => setShowAddProperty(true)}>
                            <ButtonContent>
                                <FaPlus className="add-button"/>
                                <span>Add Property</span>
                            </ButtonContent>
                        </Button>
                        {renderedProperties}    
                    </PropertiesContainer>
                </Container>
            </LoadingOverlay>
            <Modal show={showAddProperty} onClose={() => setShowAddProperty(false)}>
                <Header onClose={() => setShowAddProperty(false)}>
                    <Title>Add Property</Title>
                </Header>
                <Body>
                    <PropertySelector 
                        availableProperties={availableProperties} 
                        selectedProperties={properties}
                        addProperty={appendProperty}
                    />
                </Body>
            </Modal>
            <EmbedImageDialog showEmbedImageDialog={showEmbedImageDialog} 
                setShowEmbedImageDialog={setShowEmbedImageDialog}
                addEmbeddedImage={addEmbeddedImage}
            />
            <HtmlPreview showHtmlPreview={showHtmlPreview}
                setShowHtmlPreview={setShowHtmlPreview}
                getCommonmarkSrc={() => getValues('description')}
                getAttachedFiles={() => attachments}
            />
        </>
    );
 }

 export default EntryEditor;