import { useController } from "react-hook-form";
import styled from "styled-components";
import LabeledInput from "./LabeledInput";

const RadioAndLabelContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    padding: 0.25rem 0rem;
    font-size: 0.8rem;

    & label:hover, & input:hover {
        cursor: pointer;
    }
`

const RadiosContainer = styled.div`
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;
    padding: 0.5rem 0rem;
    padding-left: 0.5rem;
`

const RadioInput = ({name, label, options, control, rules, defaultValue, onChange, className, ...props}) => {

    const {field, fieldState} = useController({name, control, rules, defaultValue});

    const handleOnChange = (field, val) => {
        field.onChange(val);
        if(onChange) {
            onChange(field, val);
        }
    }

    const renderedChecks = options.map(it => {
        return <RadioAndLabelContainer key={it.value} >
            <input 
                key={it.value}
                type='radio'
                id={it.value}
                label={it.label}
                {...field}
                {...props}
                value={it.value}
                checked={field.value === it.value}
                onChange={() => handleOnChange(field, it.value)}
            />
            <label htmlFor={it.value}>{it.label}</label>
        </RadioAndLabelContainer> 
    });

    return (
        <LabeledInput {...{name, label, error: fieldState?.error?.message}} >
            <RadiosContainer>
                {renderedChecks}
            </RadiosContainer>
        </LabeledInput>
    )
}

export default RadioInput;