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

import { Modal, Button } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { Controller, useForm } from "react-hook-form";
import { Form } from "react-bootstrap";

const DateSelectorModal = ({rules, title, show, setShow, onApply, onClose}) => {

    // This model gets its own form so that it can e.g. handle
    // validation and other features independently from 
    // update the calling field.
    const {control, handleSubmit, formState} = useForm();

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
        <Modal show={show} onHide={() => {setShow(false)}}>
            <Controller 
                name='datetime'
                control={control}
                rules={rules}
                defaultValue={new Date()}
                render={({field, fieldState}) =>
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            
                            <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                style={{width:30}}
                                format='y-MM-dd HH:mm'
                                clearIcon=""
                                disableClock 
                            />
                            {fieldState.error && 
                                <Form.Label className="form-error-label" column={true}>
                                    {fieldState.error.message}
                                </Form.Label>
                            }
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="primary" type="submit" onClick={localOnApply}>
                                Apply
                        </Button>
                        <Button variant="secondary" type="button" onClick={localOnClose}>
                                Cancel
                        </Button>
                        </Modal.Footer>
                    </>
                }
            />
            
        </Modal>
    );
}

export default DateSelectorModal;