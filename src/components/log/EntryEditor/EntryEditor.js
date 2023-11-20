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
import Modal from 'components/shared/Modal';
import PropertyEditor from './PropertyEditor';
import PropertySelector from './PropertySelector';
import { useState } from 'react';
import { useEffect } from 'react';
import { useGetPropertiesQuery } from 'api/ologApi';
import { useFieldArray } from 'react-hook-form';
import TextInput from 'components/shared/input/TextInput';
import styled from 'styled-components';
import { useRef } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Description from './Description';
import LogbooksMultiSelect from 'components/shared/input/managed/LogbooksMultiSelect';
import TagsMultiSelect from 'components/shared/input/managed/TagsMultiSelect';
import EntryTypeSelect from 'components/shared/input/managed/EntryTypeSelect';

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

export const EntryEditor = ({form, title, onSubmit, submitDisabled, attachmentsDisabled}) => {

    const topElem = useRef();
    const { control, handleSubmit, formState } = form;

    const { fields: properties, remove: removeProperty, append: appendProperty, update: updateProperty } = useFieldArray({
        control,
        name: 'properties',
        keyName: 'reactHookFormId' // default is 'id', which would override OlogAttachment#id
    })

    const [showAddProperty, setShowAddProperty] = useState(false);
    const {data: availableProperties} = useGetPropertiesQuery();

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
            <Container>
                <h1>{title}</h1>
                <Form onSubmit={handleSubmit(onSubmit)} >
                    <span ref={topElem}></span>
                    <LogbooksMultiSelect 
                        control={control}
                        rules={{
                            validate: {
                                notEmpty: val => val?.length > 0 || 'Select at least one logbook'
                            }
                        }}
                    />
                    <TagsMultiSelect 
                        control={control}
                    />
                    {/* <MultiSelect 
                        name='entryType'
                        label='Entry Type'
                        control={control}
                        defaultValue={customization.defaultLevel}
                        options={customization.levelValues}
                    /> */}
                    <EntryTypeSelect 
                        control={control}
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
                        form={form}
                        attachmentsDisabled={attachmentsDisabled}
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
                    <Button type='submit' variant="contained" disabled={submitDisabled}>Submit</Button>
                </Form>
            </Container>
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