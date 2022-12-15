import styled from "styled-components";
import Modal from "styled-react-modal";

export const StyledModal = Modal.styled`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: ${({theme}) => theme.colors.lightest};
    border: 1px solid ${({theme}) => theme.colors.dark};
    border-radius: 10px;
    min-width: 30vw;
`

export const Header = styled.div`
    display: flex;
    align-items: center;
    & .close {
        font-size: 1.4rem;
        margin-left: auto;
    }
`

export const Title = styled.div`
    display: flex;
    font-size: 1.5em;
`

export const Body = styled.div`

`

export const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
`