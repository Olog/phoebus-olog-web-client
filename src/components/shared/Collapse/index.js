import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
    padding: 0.5rem 0;
`

const Header = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    padding: 0.25rem 0.5rem;
    background-color: ${({theme}) => theme.colors.light};
    border-bottom: 1px solid ${({theme}) => theme.colors.neutral};
`

const Icon = styled.span`
    & > * {
        vertical-align: top;
    }
`

const Body = styled.div`
    
`

const HiddenContentEnd = styled.div`
    height: 1px;
`

const Collapse = ({title, active=false, children}) => {
    const [show, setShow] = useState(active);
    
    const contentEndRef = useRef();

    const scrollToEnd = () => {
        contentEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }

    const handleClick = () => {
        setShow(!show);
    }

    useEffect(() => {
        scrollToEnd();
    });

    return (
        <Container>
            <Header onClick={handleClick}>
                <Icon>{show ? <FaChevronDown /> : <FaChevronRight />}</Icon>
                <span>{title}</span>
            </Header>
            {show ? <Body>{children}</Body> : null}
            <HiddenContentEnd ref={contentEndRef} id='hidden-content-end'></HiddenContentEnd>
        </Container>
    )
    
}

export default Collapse;