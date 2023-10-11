/**
 * Copyright (C) 2020 European Spallation Source ERIC.
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

import { useEffect } from "react";
import DatePicker from "./DatePicker";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Button from "components/shared/Button";
// import Modal, { Body, Footer, Header, Title } from 'components/shared/Modal';
import TextInput from "components/shared/input/TextInput";
import { dateToString } from "utils";
import Submit from 'components/shared/input/Submit';
import Modal from "components/shared/Modal";

const Form = styled.form`
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
`

const HorizontalRule = styled.hr`
    margin: 1rem 0;
`

const DateSelectorModal = ({defaultValue, rules, title, show, setShow, onApply, onClose}) => {

    // This model gets its own form so that it can e.g. handle
    // validation and other features independently from 
    // update the calling field.
    const {control, handleSubmit, formState, setValue, watch} = useForm();
    const [datetime] = watch(['datetime'])

    // Push datetime changes to text field
    useEffect(() => {
        const val = datetime && dateToString(datetime);
        setValue('text', val || '')
        // eslint-disable-next-line
    }, [datetime]);

    // On apply, if there aren't any field errors
    // then hide the modal and submit the data to 
    // the onApply callback
    const localOnApply = () => {
        if(Object.keys(formState.errors).length === 0) {
            setShow(false);
            handleSubmit(onApply)();
        }
    }

    const localOnClose = () => {
        if(onClose) {
            onClose()
        }
        setShow(false);
    }

    return (
        <Modal 
            open={show} 
            onClose={localOnClose} 
            title={title}
            content={
                <Form onSubmit={localOnApply}>
                    <Submit hidden />
                    <DatePicker 
                        name='datetime'
                        label='Date'
                        control={control}
                        rules={rules}
                        defaultValue={new Date()}
                    />
                    <HorizontalRule />
                    <TextInput 
                        name='text'
                        label='Text'
                        control={control}
                        defaultValue={defaultValue}
                    />
                </Form>
            }
            actions={
                <>
                    <Button variant="primary" onClick={localOnApply}>
                        Apply
                    </Button>
                    <Button variant="secondary" onClick={localOnClose}>
                            Cancel
                    </Button>
                </>
            }
        />
    );
}

export default DateSelectorModal;