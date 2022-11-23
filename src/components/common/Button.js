import styled from "styled-components";

const ButtonElem = styled.button`
    padding: 1vh 2vh;
    border: none;
    border-radius: 5px;
    background-color: ${({variant, theme}) => theme.colors[variant] || theme.colors.default };
    color: #fff;
    cursor: ${({disabled}) => disabled ? 'not-allowed' : 'pointer'};
    filter: ${({disabled}) => disabled ? 'brightness(0.7)' : 'none'};
`

const Button = ({variant, disabled=false, onClick=() => {}, children}) => {
    return <ButtonElem {...{variant, disabled, onClick}}>
        {children}
    </ButtonElem>
}

export default Button;