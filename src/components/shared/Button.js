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

export default Button;