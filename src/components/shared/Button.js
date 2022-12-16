import { useState } from "react";
import styled, { css } from "styled-components";

export const buttonBaseStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
    text-align: center;
    padding: 1rem 2rem;
    border: none;
    border-radius: 5px;
    background-color: ${({variant, theme}) => theme.colors[variant] || theme.colors.default };
    color: #fff;
    cursor: ${({disabled}) => disabled ? 'not-allowed' : 'pointer'};
    filter: ${({disabled}) => disabled ? 'brightness(0.7) opacity(50%)' : 'none'};
    
    &:hover {
        filter: brightness(0.7);
    }
`

const ButtonElem = styled.button`
    ${buttonBaseStyle}
`

const Button = ({variant, disabled=false, onClick=() => {}, innerRef, className, children}) => {
    return <ButtonElem {...{variant, disabled, onClick, className, ref: innerRef}}>
        {children}
    </ButtonElem>
}

const StyledToggleButton = styled(ButtonElem)`
    background-color: ${({checked, variant, theme}) => checked ? (theme.colors[variant] || theme.colors.default) : 'transparent'};
    border: 1px solid ${({variant, theme}) => theme.colors[variant] || theme.colors.default};
    color: ${({checked, variant, theme}) => checked ? theme.colors.lightest : (theme.colors[variant] || theme.colors.default)};
`

export const ToggleButton = ({variant, disabled=false, innerRef, className, checked, onChange, children}) => {

    const [isChecked, setIsChecked] = useState(checked);

    const onClick = () => {
        setIsChecked(!isChecked);
        onChange();
    }

    return <StyledToggleButton {...{variant, disabled, onClick, className, ref: innerRef, checked}}>
        {children}
    </StyledToggleButton>
}

export default Button;