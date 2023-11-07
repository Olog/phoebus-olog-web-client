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
import Modal from 'components/shared/Modal';
import { useNavigate } from 'react-router-dom';
import customization from 'utils/customization';
import PropertyEditor from './PropertyEditor';
import PropertySelector from './PropertySelector';
import { checkSession } from 'api/olog-service';
import { ologClientInfoHeader } from 'utils';
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
import { useRef } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Description from './Description';

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
    const { control, handleSubmit, getValues, setValue, watch, formState } = useForm({
        defaultValues: {
            attachments: []
        }
    });
    const attachments = watch("attachments");

    const { fields: properties, remove: removeProperty, append: appendProperty, update: updateProperty } = useFieldArray({
        control,
        name: 'properties',
        keyName: 'reactHookFormId' // default is 'id', which would override OlogAttachment#id
    })

    const [createInProgress, setCreateInProgress] = useState(false);
    const [showAddProperty, setShowAddProperty] = useState(false);
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

    // Close the Properties dialog if there are none left to select
    useEffect(() => {
        if(availableProperties?.length === properties?.length) {
            setShowAddProperty(false);
        }
    }, [availableProperties, properties, setShowAddProperty]);

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
                        level: formData.entryType,
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
                    <h1>New Log Entry</h1>
                    <Form onSubmit={handleSubmit(onSubmit)} >
                        <span ref={topElem}></span>
                        <MultiSelect
                            name='logbooks'
                            label='Logbooks'
                            control={control}
                            defaultValue={[]}
                            options={logbooks}
                            getOptionLabel={logbook => logbook.name}
                            isOptionEqualToValue={ (option, value) => option.name === value.name }
                            isMulti
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
                            options={tags}
                            getOptionLabel={tag => tag.name}
                            isOptionEqualToValue={ (option, value) => option.name === value.name }
                            isMulti
                        />
                        <MultiSelect 
                            name='entryType'
                            label='Entry Type'
                            control={control}
                            defaultValue={customization.defaultLevel}
                            options={customization.levelValues}
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
                        <Description 
                            control={control}
                            formState={formState}
                            setValue={setValue}
                            getValues={getValues}
                        />
                        <DetachedLabel>Properties</DetachedLabel>
                        <PropertiesContainer>
                            <Button 
                                variant="outlined"
                                disabled={availableProperties?.length === properties?.length} 
                                onClick={() => { setShowAddProperty(true)}}
                                startIcon={<AddIcon />}
                            >
                                Add Property
                            </Button>
                            {renderedProperties}    
                        </PropertiesContainer>
                        <Button type='submit' variant="contained" disabled={userData.userName === "" || createInProgress}>Submit</Button>
                    </Form>
                </Container>
            </LoadingOverlay>
            <Modal 
                open={showAddProperty} 
                onClose={() => setShowAddProperty(false)}
                title="Add Property"
                content={
                    <PropertySelector 
                        availableProperties={availableProperties} 
                        selectedProperties={properties}
                        addProperty={appendProperty}
                    />
                }
            />
        </>
    );
}