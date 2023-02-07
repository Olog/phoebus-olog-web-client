import { useRef } from "react";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
    padding: 0.5rem 0;
`

const Header = styled.button`
    border: none;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    padding: 0.25rem 0.5rem;
    background-color: ${({theme}) => theme.colors.light};
    border-bottom: 1px solid ${({theme}) => theme.colors.neutral};

    &:hover {
        cursor: pointer;
    }
`

const Icon = styled(FaChevronRight)`
    transition: all 100ms;
    ${({show}) => show ? `
        transform: rotate(90deg);
    ` : ''}
`

const Body = styled.div`
`

const Collapse = ({title, active=false, className, children}) => {
    const [show, setShow] = useState(active);

    const handleClick = () => {
        setShow(!show);
    }

    return (
        <Container className={className}>
            <Header onClick={handleClick} aria-expanded={show}>
                <Icon show={show} aria-hidden='true' />
                {title}
            </Header>
            {show ? <Body>{children}</Body> : null}
        </Container>
    )
    
}

export default Collapse;