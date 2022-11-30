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
import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';
import MultiSelect from '../input/MultiSelect';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateSearchParams as updateSearchParamsAction } from '../../features/searchParamsReducer';
import { updateSearchPageParams as updateSearchPageParamsAction } from '../../features/searchPageParamsReducer';
import Collapse from './Collapse';
import Col from 'react-bootstrap/Col';
import TextInput from '../input/TextInput';
import WizardDateInput from '../input/WizardDateInput';

/**
 * Component holding search criteria elements, i.e.
 * logbooks, tags and time range.
 */
const Filters = ({showFilters, logbooks, tags, searchParams, searchPageParams}) => {

    const [tempSearchParams, setTempSearchParams] = useState({...searchParams});
    const [tempSearchPageParams, setTempSearchPageParams] = useState({...searchPageParams});
    const dispatch = useDispatch();

    useEffect(() => {
        setTempSearchParams(searchParams);
        setTempSearchPageParams(searchPageParams);
    }, [searchParams, searchPageParams])

    const submitSearchParams = () => {
        dispatch(updateSearchParamsAction(tempSearchParams));
        dispatch(updateSearchPageParamsAction(tempSearchPageParams));
    }

    const form = useForm({defaultValues: {...tempSearchParams}});;
    const { control, handleSubmit, getValues, watch } = form;

    const [triggerSubmit, setTriggerSubmit] = useState(false);

    const [start, end] = watch(['start', 'end']);

    // Instead of triggering submit of search parameters directly from a field change
    // function as a side effect (bad practice, which ofc generates warnings), instead
    // set the triggerSubmit state to true and then submit the search parameters from useEffect.
    useEffect(() => {
        if(triggerSubmit) {
            setTriggerSubmit(false);
            submitSearchParams();
        }
        // eslint-disable-next-line
    }, [triggerSubmit]);

    useEffect(() => {
        updateSearchParams('start', start, true);
        // eslint-disable-next-line
    }, [start])
    useEffect(() => {
        updateSearchParams('end', end, true);
        // eslint-disable-next-line
    }, [end])
    
    const onSubmit = (data) => {
        // Remove keys part of page params
        delete data.sort

        // Update the search params and trigger submit
        setTempSearchParams({...data});
        setTriggerSubmit(true);
    }

    const onSearchParamFieldValueChanged = (field, value, submit=true) => {
        field.onChange(value);
        updateSearchParams(field.name, value, submit);
    }

    const onSearchPageParamFieldValueChanged = (field, value, submit=true) => {
        field.onChange(value);
        updateSearchPageParams(field.name, value, submit);
    }

    const updateSearchParams = (key, value, submit=true) => {
        const updatedParams = {...tempSearchParams, [key]: value}
        setTempSearchParams(updatedParams);
        if(submit) {
            // better to only trigger re-render if true
            setTriggerSubmit(true);
        }
    }

    const updateSearchPageParams = (key, value, submit=true) => {
        const updatedParams = {...searchPageParams, [key]: value}
        setTempSearchPageParams(updatedParams);
        if(submit) {
            // better to only trigger re-render if true
            setTriggerSubmit(true);
        }
    }

    const isDate = (obj) => {
        return obj instanceof Date && !isNaN(obj);
    }
    const toDate = (dateString) => {
        if(isDate(dateString)) {
            return new Date(dateString);
        } else {
            return null;
        }
    }

    return(
        <Collapse show={showFilters} onExiting={handleSubmit(onSubmit)} >
            <Col xs={{span: 12, order: 3}} lg={{span: 2, order: 1}} >
                <Container className="grid-item filters full-height" style={{padding: "8px"}} >
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {/* Hidden button handles submit-on-enter automatically */}
                        <Button type='submit' hidden >Submit</Button>
                        <TextInput 
                            name='title'
                            label='Title'
                            control={control}
                            defaultValue=''
                        />
                        <TextInput 
                            name='desc'
                            label='Text'
                            control={control}
                            defaultValue=''
                        />
                        <MultiSelect 
                            name='logbooks'
                            label='Logbooks'
                            control={control}
                            defaultValue={[]}
                            options={logbooks.map(it => (
                                {label: it.name, value: it}
                            ))}
                            onSelection={(value) => value.map(it => (
                                {label: it, value: it}
                            ))}
                            onSelectionChanged={(field, value) => onSearchParamFieldValueChanged(field, value.map(it => it.label))}
                        />
                        <MultiSelect 
                            name='tags'
                            label='Tags'
                            control={control}
                            defaultValue={[]}
                            options={tags.map(it => (
                                {label: it.name, value: it}
                            ))}
                            onSelection={(value) => value.map(it => (
                                {label: it, value: it}
                            ))}
                            onSelectionChanged={(field, value) => onSearchParamFieldValueChanged(field, value.map(it => it.label))}
                        />
                        <TextInput 
                            name='owner'
                            label='Author'
                            control={control}
                            defaultValue={tempSearchParams.owner || ''}
                        />
                        <WizardDateInput 
                            name='start'
                            label='Start Time'
                            form={form}
                            defaultValue={getValues('start')}
                            rules={{
                                validate: {
                                    timeParadox: val => {
                                        const startDate = toDate(val);
                                        const endDate = toDate(getValues('end'));
                                        if(startDate && endDate) {
                                            return startDate <= endDate || 'Start date cannot come after end date'
                                        } else {
                                            return true;
                                        }
                                    }
                                }
                            }}
                        />
                        <WizardDateInput 
                            name='end'
                            label='End Time'
                            form={form}
                            defaultValue={getValues('end')}
                            rules={{
                                validate: {
                                    timeParadox: val => {
                                        const startDate = toDate(getValues('start'));
                                        const endDate = toDate(val);
                                        if(startDate && endDate) {
                                            return endDate > startDate || 'End date cannot come before start date'
                                        } else {
                                            return true;
                                        }
                                    }
                                }
                            }}
                        />
                        <Form.Group controlId='sort'>
                            <Controller 
                                name='sort'
                                control={control}
                                defaultValue={searchPageParams.sort || ''}
                                render={({field}) =>
                                    <>
                                        <Form.Check style={{paddingTop: "5px"}}
                                            type='radio'
                                            id='sortDescending'
                                            checked={field.value === 'down'}
                                            label='Sort descending on date'
                                            onChange={() => onSearchPageParamFieldValueChanged(field, 'down', true)}
                                        />
                                        <Form.Check 
                                            type='radio'
                                            id='sortAscending'
                                            label='Sort ascending on date'
                                            checked={field.value === 'up'}
                                            onChange={(e) => onSearchPageParamFieldValueChanged(field, 'up', true)}
                                        />
                                    </>
                            }/>
                            
                        </Form.Group>
                        <TextInput 
                            name='attachments'
                            label='Attachments'
                            control={control}
                            defaultValue={tempSearchParams.attachments || ''}
                        />
                    </Form>
                </Container>
            </Col>
        </Collapse>
    );
}

export default Filters;
