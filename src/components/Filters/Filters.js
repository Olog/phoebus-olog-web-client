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
import MultiSelect from 'components/shared/input/MultiSelect';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { forceUpdateSearchParams } from 'features/searchParamsReducer';
import { updateSearchPageParams } from 'features/searchPageParamsReducer';
import Collapse from './Collapse';
import TextInput from 'components/shared/input/TextInput';
import WizardDateInput from 'components/shared/input/WizardDateInput';
import RadioInput from 'components/shared/input/RadioInput';
import { Button, Stack } from '@mui/material';
import customization from 'utils/customization';

/**
 * Component holding search criteria elements, i.e.
 * logbooks, tags and time range.
 */
const Filters = ({showFilters, logbooks, tags, className}) => {

    const dispatch = useDispatch();
    const searchParams = useSelector(state => state.searchParams);
    const searchPageParams = useSelector(state => state.searchPageParams);
    const form = useForm({defaultValues: {...searchParams, sort: searchPageParams.sort}});
    
    const { control, handleSubmit, getValues } = form;
    
    const onSubmit = (data) => {
        const updatedSearchParams = {
            ...data, 
            logbooks: typeof data?.logbooks === 'string' ? [data.logbooks] : data.logbooks ?? [],
            tags: typeof data?.tags === 'string' ? [data.tags] : data.tags ?? []
        };
        if(data.sort) {
            delete updatedSearchParams.sort;
            const updatedSearchPageParams = {...searchPageParams, sort: data.sort}
            dispatch(updateSearchPageParams(updatedSearchPageParams));
        }
        dispatch(forceUpdateSearchParams(updatedSearchParams));

    }

    const onSearchParamFieldValueChanged = (field, value, submit=true) => {
        field.onChange(value);
        if(submit) {
            onSubmit(getValues());
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
            <Stack gap={0.5} padding={1} className={className} sx={{overflow: "auto"}} >
                <h2 id="advanced-search">Advanced Search</h2>
                <Stack 
                    component="form" 
                    onSubmit={handleSubmit(onSubmit)}
                    aria-labelledby='advanced-search' role='search' 
                    gap={1}
                >
                    {/* Hidden button handles submit-on-enter automatically */}
                    <Button type="submit" hidden />
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
                        options={logbooks?.map(it => it.name) ?? []}
                        onChange={(field, value) => onSearchParamFieldValueChanged(field, value, true)}
                        isMulti
                    />
                    <MultiSelect 
                        name='tags'
                        label='Tags'
                        control={control}
                        defaultValue={[]}
                        options={tags?.map(it => it.name) ?? []}
                        onChange={(field, value) => onSearchParamFieldValueChanged(field, value, true)}
                        isMulti
                    />
                    <TextInput 
                        name='owner'
                        label='Author'
                        control={control}
                        defaultValue=''
                    />
                    <WizardDateInput 
                        name='start'
                        label='Start Time'
                        form={form}
                        defaultValue={getValues('start')}
                        onChange={(field, val) => onSearchParamFieldValueChanged(field, val, true)}
                        DatePickerProps={{
                            disableFuture: true
                        }}
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
                        onChange={(field, val) => onSearchParamFieldValueChanged(field, val, true)}
                        DatePickerProps={{
                            disableFuture: true
                        }}
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
                    <RadioInput 
                        name='sort'
                        label='Sort'
                        control={control}
                        defaultValue={searchPageParams.sort || customization.defaultSortDirection}
                        options={[
                            {
                                label: 'Sort descending on date',
                                value: 'down'
                            },
                            {
                                label: 'Sort ascending on date',
                                value: 'up'
                            }
                        ]}
                        onChange={(field, val) => onSearchParamFieldValueChanged(field, val, true)}

                    />
                    <TextInput 
                        name='attachments'
                        label='Attachments'
                        control={control}
                        defaultValue=''
                    />
                </Stack>
            </Stack>
        </Collapse>
    );
}

export default Filters;
