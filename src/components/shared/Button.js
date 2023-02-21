import { useState } from "react";
import styled, { css } from "styled-components";

export const buttonBaseStyle = css`
    ${({hidden, variant, theme}) => hidden ? '' : `
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2.5rem;
        text-align: center;
        padding: 1rem 2rem;
        border: none;
        border-radius: 5px;
        background-color: ${ theme.colors[variant] || theme.colors.default };
        color: #fff;
        cursor: pointer;
        filter: none;
        
        &[aria-disabled=true] {
            cursor: not-allowed;
            opacity: 0.50;
        }

        &:hover {
            filter: brightness(0.7);
        }
    `}
`

const StyledButton = styled.button`
    ${buttonBaseStyle}
`

// const Button = ({type='button', variant, disabled=false, onClick=() => {}, innerRef, className, hidden, children}) => {
const Button = ({type='button', variant, disabled=false, onClick=() => {}, innerRef, className, children, ...props}) => {

    const handleClick = (e) => {
        if(disabled) {
            e.preventDefault();
            e.preventPropagation();
        }
        onClick(e);
    }

    return <StyledButton onClick={handleClick} type={type} {...{variant, className, ref: innerRef, ...props}} aria-disabled={disabled} >
        {children}
    </StyledButton>
}

const StyledToggleButton = styled(StyledButton)`
    background-color: ${({checked, variant, theme}) => checked ? (theme.colors[variant] || theme.colors.default) : 'transparent'};
    border: 1px solid ${({variant, theme}) => theme.colors[variant] || theme.colors.default};
    color: ${({checked, variant, theme}) => checked ? theme.colors.lightest : (theme.colors[variant] || theme.colors.default)};
`

export const ToggleButton = ({type='button', variant, disabled=false, innerRef, className, checked, onChange, children, ...props}) => {

    const [isChecked, setIsChecked] = useState(checked);

    const onClick = () => {
        setIsChecked(!isChecked);
        onChange();
    }

    return <StyledToggleButton type={type} {...{variant, disabled, onClick, className, ref: innerRef, checked, ...props}}>
        {children}
    </StyledToggleButton>
}

export default Button;