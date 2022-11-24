import { useController } from "react-hook-form";
import styled from "styled-components"
import LabeledInput from "./LabeledInput"

const Input = styled.input`
    width: 100%;
    padding: 0.5rem 1rem;
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;
`

const TextArea = styled.textarea`
    width: 100%;
    padding: 0.5rem 1rem;
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;
`

export const TextInput = ({name, label, control, rules, defaultValue, className, textArea=false, rows=3}, ...props) => {
    
    const {field, fieldState} = useController({name, control, rules, defaultValue});

    return (
        <LabeledInput {...{name, label, error: fieldState?.error?.message}} >
            {textArea 
            ? <TextArea 
                name={name} 
                id={name}
                placeholder={label}
                rows={rows}
                className={className}
                {...field} 
                {...props}
            />
            : <Input 
                type="text" 
                name={name} 
                id={name}
                placeholder={label}
                className={className}
                {...field} 
                {...props}
            />
            }
            
        </LabeledInput>
    );
}

export default TextInput;