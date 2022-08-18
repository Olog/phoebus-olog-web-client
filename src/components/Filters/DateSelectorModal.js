import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";

const DateSelectorModal = ({title, show, setShow, initialValue, onApply, onClose}) => {

    const [selectedDate, setSelectedDate] = useState(initialValue);

    const localOnApply = () => {
        if(onApply) {
            onApply(selectedDate);
        }
        setShow(false);
    }

    const localOnClose = () => {
        if(onClose) {
            onClose(selectedDate)
        }
        setShow(false);
    }

    return (
        <Modal show={show} onHide={() => {setShow(false)}}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <DateTimePicker
                onChange={(value) => setSelectedDate(value)}
                style={{width:30}}
                value={selectedDate}
                format='y-MM-dd HH:mm'
                clearIcon=""
                disableClock 
            />
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" type="submit" onClick={localOnApply}>
                    Apply
            </Button>
            <Button variant="secondary" type="button" onClick={localOnClose}>
                    Cancel
            </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DateSelectorModal;