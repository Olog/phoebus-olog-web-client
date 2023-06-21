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
import ologService, { ologServiceWithRetry } from 'api/olog-service';
import Button from '../shared/Button';
import Modal, {Header, Title, Body} from 'components/shared/Modal';
import { FaMarkdown, FaPlus } from 'react-icons/fa';
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
import { DroppableFileUploadInput } from 'components/shared/input/FileInput';
import { useRef } from 'react';
import ExternalLink from 'components/shared/ExternalLink';
import { APP_BASE_URL } from 'constants';
import HtmlPreviewModal from './HtmlPreviewModal';
import ErrorMessage from 'components/shared/input/ErrorMessage';

const Container = styled.div`
    padding: 1rem 0.5rem;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    overflow: auto;
    gap: 0.5rem;
`

const DescriptionContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
`

const DescriptionTextInput = styled(TextInput)`
`

const DescriptionContainerFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;

    & div {
        display: flex;
        gap: 1rem;
    }
`

const ButtonContent = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`

const AttachmentsInputContainer = styled.div`
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const RenderedAttachmentsContainer = styled.div`
    display: grid;
    place-items: center;
    grid-template-columns: repeat(auto-fill, 10rem);
    grid-template-rows: repeat(auto-fill, 10rem);
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;

    ${({hasAttachments}) => hasAttachments ? '' : `
        display: flex;
    `}
`

const StyledAttachment = styled(Attachment)`
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;
    height: 100%;
    width: 100%;
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
    margin-bottom: 1rem;
`

const DetachedLabel = styled.label``

export const EntryEditor = ({
     tags=[],
     logbooks=[],
     replyAction, setReplyAction=() => {},
     userData, setUserData,
     setShowLogin=() => {}
    }) => {

    const topElem = useRef();
    const { control, handleSubmit, getValues, setValue, watch, formState } = useForm();
    const { fields: attachments, remove: removeAttachment, append: appendAttachment } = useFieldArray({
        control,
        name: 'attachments',
        keyName: 'reactHookFormId', // default is 'id', which would override OlogAttachment#id
        rules: {
            validate: {
                maxRequestSize: (attachments) => {
                    const total = attachments.map(it => it?.file?.size || 0).reduce((prev, curr) => curr + prev, 0);
                    const max = maxRequestSizeMb*1000000;
                    console.log({validatingAttachments: attachments, total, max})
                    return total < max || `Attachments exceed total maximum upload size of ${maxRequestSizeMb}MB` 
                },
                maxFileSize: (attachments) => {
                    const max = maxFileSizeMb*1000000;
                    const results = attachments.filter(it => it?.file?.size > max).map(it => it?.file?.name);
                    return results.length === 0 || `Attachments exceed max filesize (${maxFileSizeMb}MB): ${results}`
                }
            }
        }
    })
    const { fields: properties, remove: removeProperty, append: appendProperty, update: updateProperty } = useFieldArray({
        control,
        name: 'properties',
        keyName: 'reactHookFormId' // default is 'id', which would override OlogAttachment#id
    })
    // File input HTML element ref allows us to hide
    // the element and click it from e.g. a button
    // const fileInputRef = useRef(null);
    const [initialImage, setInitialImage] = useState(null);
    const [createInProgress, setCreateInProgress] = useState(false);
    const [showEmbedImageDialog, setShowEmbedImageDialog] = useState(false);
    const [showHtmlPreview, setShowHtmlPreview] = useState(false);
    const [showAddProperty, setShowAddProperty] = useState(false);
    const [maxRequestSizeMb, setMaxRequestSizeMb] = useState(customization.defaultMaxRequestSizeMb)
    const [maxFileSizeMb, setMaxFileSizeMb] = useState(customization.defaultMaxFileSizeMb)
    const {data: availableProperties} = useGetPropertiesQuery();
    const currentLogEntry = useSelector(state => state.currentLogEntry);

    const navigate = useNavigate();

    /**
     * Save/restore form data
     */
    const {clear: clearFormData } =  useFormPersist( 'entryEditorFormData', {
        watch,
        setValue,
        storage: window.localStorage,
        exclude: 'attachments', // serializing files is unsupported due to security risks
    });

    /**
     * Show login if no session
     */
    useEffect(() => {
        const promise = checkSession();
        if(!promise){
            setShowLogin(true);
        }
        else{
            promise.then(data => {
                if(!data){
                    setShowLogin(true);
                }
                else{
                    //setReplyAction(false);
                }
            });
        }
    }, [setShowLogin, setReplyAction])

    // Get the max attachment filesize 
    useEffect(() => {
        ologService.get('/')
            .then(res => {
                const {data} = res;
                setMaxRequestSizeMb(data?.serverConfig?.maxRequestSize || customization.defaultMaxRequestSizeMb);
                setMaxFileSizeMb(data?.serverConfig?.maxFileSize || customization.defaultMaxFileSizeMb);
            })
            .catch(() => {
                setMaxRequestSizeMb(customization.defaultMaxRequestSizeMb);
                setMaxFileSizeMb(customization.defaultMaxFileSizeMb);
            })
    }, []);

    console.log({maxRequestSizeMb, maxFileSizeMb, errors: formState?.errors?.attachments?.root})
    console.log(formState.errors)
    
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
        // eslint-disable-next-line 
    }, [replyAction, currentLogEntry, setValue]);

    // Scroll to top if there are field errors
    useEffect(() => {
        if(Object.keys(formState.errors).length > 0) {
            if(topElem.current && typeof topElem.current.scrollIntoView === 'function') {
                topElem.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [formState])

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
        const id = uuidv4();
        appendAttachment(new OlogAttachment(file, id));
        const imageMarkup = "![](attachment/" + id + "){width=" + width + " height=" + height + "}";
        let description = getValues('description') || '';
        description += imageMarkup;
        setValue('description', description, {shouldDirty: false, shouldTouch: false, shouldValidate: false});
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
                        description: formData.description,
                        attachments: attachments
                    }
                    // This FormData object will contain both the log entry and all attached files, if any
                    let multipartFormData = new FormData();
                    // Append all files. Each is added with name "files", and that is actually OK
                    for (let i = 0; i < attachments.length; i++) {
                        multipartFormData.append("files", attachments[i].file, attachments[i].file.name);
                    }
                    // Log entry must be added as JSON blob, otherwise the content type cannot be set.
                    multipartFormData.append("logEntry", new Blob([JSON.stringify(logEntry)], {type: 'application/json'}));

                    // Need to set content type for the request "multipart/form-data"
                    let requestHeaders = ologClientInfoHeader();
                    requestHeaders["Content-Type"] = "multipart/form-data";
                    requestHeaders["Accept"] = "application/json";
                    
                    let url = replyAction ? 
                        `/logs/multipart?markup=commonmark&inReplyTo=${currentLogEntry.id}` :
                        `/logs/multipart?markup=commonmark`;
                    // Upload the full monty, i.e. log entry and all attachment files, in one single request.
                    ologService.put(url, multipartFormData, { withCredentials: true, headers: requestHeaders})
                        .then(async res => {
                            // Wait until the new log entry is available in the search results
                            await ologServiceWithRetry({
                                method: 'GET',
                                path: `/logs/search?title=${res.data.title}&end=now`,
                                retries: 5,
                                retryCondition: (retryRes) => {
                                    // Retry if the entry we created isn't in the search results yet
                                    // Or if it does show in search but the attachments haven't been associated to it yet
                                    // (the server sometimes responds with the entry but has an empty attachments field)
                                    const found = retryRes?.data?.logs.find(it => `${it.id}` === `${res.data.id}`);
                                    const hasAllAttachments = found?.attachments?.length === attachments.length;
                                    const willRetry = !found || (found && !hasAllAttachments)
                                    return willRetry;
                                },
                                retryDelay: (count) => count*200
                            });
                            clearFormData();
                            setCreateInProgress(false);
                            setReplyAction(false);
                            navigate('/');

                        })
                        .catch(error => {
                            if(error.response && (error.response.status === 401 || error.response.status === 403)){
                                alert('You are currently not authorized to create a log entry.')
                            }
                            else if(error.response && error.response.status === 413){ // 413 = payload too large
                                alert(error.response.data); // Message set in data by server
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
        return <StyledAttachment key={index} attachment={attachment} removeAttachment={() => onAttachmentRemoved(attachment, index)}/>
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

    const handlePaste = (e) => {
        const items = e.clipboardData.items;
        let imageFile = null;
        for(let item of items) {
            if(item.kind === 'file' && item.type.match(/^image/)) {
                imageFile = item.getAsFile();
            }
        }
        if(imageFile) {
            setInitialImage(imageFile);
            setShowEmbedImageDialog(true);
            // prevent paste of image 'text'
            e.preventDefault();
        }
    }

    return (
        <>
                <LoadingOverlay
                    active={createInProgress}
                >
                    <Container>
                    <h1>New Log Entry</h1>
                    <Form onSubmit={handleSubmit(onSubmit)} >
                        <span ref={topElem}></span>
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
                            rules={{
                                validate: {
                                    notEmpty: val => val?.length > 0 || 'Select at least one logbook'
                                }
                            }}
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
                            defaultValue=''
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Please specify a title.'
                                }
                            }}
                        />
                        <DescriptionContainer>

                            <DescriptionTextInput 
                                name='description'
                                label='Description'
                                control={control}
                                defaultValue=''
                                textArea
                                rows={10}
                                onPaste={handlePaste}
                            />
                            <DescriptionContainerFooter>
                                <div>
                                    <ExternalLink href={`${APP_BASE_URL}/help/CommonmarkCheatsheet`} >
                                        <FaMarkdown />CommonMark Formatting Help
                                    </ExternalLink>
                                </div>
                                <div>
                                    <Button variant="secondary" size="sm" style={{marginLeft: "5px"}}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setShowEmbedImageDialog(true);
                                            }}>
                                        Embed Image
                                    </Button>
                                    <Button variant="secondary" size="sm" style={{marginLeft: "5px"}}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setShowHtmlPreview(true)
                                            }}>
                                        Preview
                                    </Button>
                                </div>
                            </DescriptionContainerFooter>
                        </DescriptionContainer>
                        <DetachedLabel>Attachments</DetachedLabel>
                        <AttachmentsInputContainer>
                            <RenderedAttachmentsContainer hasAttachments={attachments && attachments.length > 0}>
                                <DroppableFileUploadInput 
                                    onFileChanged={onFileChanged}
                                    id='attachments-upload'
                                    dragLabel='Drag Here'
                                    browseLabel='Choose File(s) or'
                                    multiple
                                />
                                { renderedAttachments }
                            </RenderedAttachmentsContainer>
                            { formState?.errors?.attachments ? <ErrorMessage error={formState?.errors?.attachments?.root.message}/> : null } 
                        </AttachmentsInputContainer>
                        <DetachedLabel>Properties</DetachedLabel>
                        <PropertiesContainer>
                            <Button variant="secondary" size="sm" onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowAddProperty(true);
                            }}>
                                <ButtonContent>
                                    <FaPlus className="add-button"/>
                                    <span>Add Property</span>
                                </ButtonContent>
                            </Button>
                            {renderedProperties}    
                        </PropertiesContainer>
                        <Button type='submit' variant="primary" disabled={userData.userName === "" || createInProgress} >Submit</Button>
                    </Form>
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
                initialImage={initialImage}
                setInitialImage={setInitialImage}
            />
            <HtmlPreviewModal 
                showHtmlPreview={showHtmlPreview}
                setShowHtmlPreview={setShowHtmlPreview}
                commonmarkSrc={getValues('description')}
                attachedFiles={attachments}
            />
        </>
    );
}