import { useState } from "react"
import styled from "styled-components";
import LabeledInput from "components/shared/input/LabeledInput";
import Button from 'components/shared/Button';
import { FaCalendarAlt } from "react-icons/fa";
import { useController } from "react-hook-form";
import DateSelectorModal from "./DateSelectorModal";

const InlineInputButtonContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;    
`

const Input = styled.input`
    padding: 0.5rem 1rem;
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px 0 0 5px;
`

const StyledButton = styled(Button)`
    border-radius: 0 5px 5px 0;
`

const WizardDateInput = ({name, label, form, rules, defaultValue, onChange, className, ...props}) => {

    const [show, setShow] = useState(false);
    const {control, setValue} = form;
    const {field, fieldState} = useController({name, control, rules, defaultValue});

    const onModalApply = (data) => {
        setValue(name, data.text);
    }

    const handleOnChange = (field, val) => {
        field.onChange(val);
        if(onChange) {
            onChange(field, val);
        }
    }

    return (
        <>
            <LabeledInput {...{name, label, error: fieldState?.error?.message}} >
                <InlineInputButtonContainer>
                    <Input 
                        type='text'
                        name={name} 
                        id={name}
                        placeholder={label}
                        className={className}
                        {...field} 
                        onChange={val => handleOnChange(field, val)}
                        {...props}
                    />
                    <StyledButton onClick={() => setShow(true)} variant='primary'>
                        <FaCalendarAlt/>
                    </StyledButton>
                </InlineInputButtonContainer>
            </LabeledInput>
            <DateSelectorModal 
                defaultValue={defaultValue}
                rules={rules}
                title={`Select ${label}`}
                show={show}
                setShow={setShow}
                onApply={onModalApply}
            />
        </>
    )
}

export default WizardDateInput;