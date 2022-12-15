import DateTimePicker from "react-datetime-picker"
import { useController } from "react-hook-form";
import styled from "styled-components";
import LabeledInput from "components/input/LabeledInput";

export const DATE_FORMAT = 'y-MM-dd HH:mm';

const Picker = styled(DateTimePicker)`
    & .react-datetime-picker__wrapper {
        border: solid 1px ${({theme}) => theme.colors.light};
        border-radius: 5px;
        padding: 0.2rem 1rem;
    }
`

const DatePicker = ({name, label, control, rules, defaultValue, className, ...props}) => {

    const {field, fieldState} = useController({name, control, rules, defaultValue})

    return (
        <LabeledInput {...{name, label, error: fieldState?.error?.message}} >
            <Picker
                format={DATE_FORMAT}
                clearIcon=""
                disableClock
                autoFocus={false}
                value={field.value}
                onChange={field.onChange}
                {...props}
            />
        </LabeledInput>
    )
}

export default DatePicker;