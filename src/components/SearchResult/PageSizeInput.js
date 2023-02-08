import { StyledLabeledTextInput } from "components/shared/input/TextInput";
import { useState } from "react";

const PageSizeInput = ({initialValue=0, onValidChange=() => {}}) => {

    const [pageSize, setPageSize] = useState(initialValue);

    /**
     * Handles input in hits per page field and rejets any
     * value < 1 and > 999, i.e. leading zeros are also rejected.
     */
    const onPageSizeChange = (e) => {
        const re = /^([1-9]|[1-9][0-9]{1,2})$/
        if(e.target.value === '' || re.test(e.target.value)) {
            setPageSize(e.target.value)
            if(`${e.target.value}`.trim() !== '') {
                onValidChange(e.target.value)
            }
        }
    }

    return (
        <StyledLabeledTextInput
            type='text'
            inputMode='numeric'
            name='pageSize'
            label='Hits per page:'
            value={pageSize}
            onChange={onPageSizeChange}
            inlineLabel
        />
    )

}

export default PageSizeInput;