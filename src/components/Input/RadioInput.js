import { useController } from "react-hook-form";
import styled from "styled-components";
import LabeledInput from "./LabeledInput";

const RadioAndLabelContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    padding: 0.25rem 0rem;
    font-size: 0.8rem;
`

const RadiosContainer = styled.div`
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;
    padding: 0.5rem 0rem;
    padding-left: 0.5rem;
`

const RadioInput = ({name, label, options, control, rules, defaultValue, className, ...props}) => {

    const {field, fieldState} = useController({name, control, rules, defaultValue});

    const renderedChecks = options.map(it => {
        return <RadioAndLabelContainer>
            <input 
                key={it.value}
                type='radio'
                id={it.value}
                label={it.label}
                {...field}
                {...props}
                value={it.value}
                checked={field.value === it.value}
                onChange={() => field.onChange(it.value)}
            />
            <label for={it.value}>{it.label}</label>
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