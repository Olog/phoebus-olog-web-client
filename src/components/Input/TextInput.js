import styled from "styled-components"
import LabeledInput from "./LabeledInput"

const Input = styled`

`

export const TextInput = ({name, label, control, rules, defaultValue, children}) => {
    
    // const {field, fieldState} = useController({name, control, rules});
    
    return (
        <LabeledInput {...{name, label}} >
            <Input 
                type="text" 
                name={name} 
                id={name} 
            />
        </LabeledInput>
    );
}

export default TextInput;