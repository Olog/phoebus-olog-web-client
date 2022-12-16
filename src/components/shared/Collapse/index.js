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

const Collapse = ({title, active, children}) => {
    const [show, setShow] = useState(active);
    
    return (
        <Container>
            <Header onClick={() => setShow(!show)}>
                <Icon>{show ? <FaChevronDown /> : <FaChevronRight />}</Icon>
                <span>{title}</span>
            </Header>
            {show ? <Body>{children}</Body> : null}
        </Container>
    )
    
}

export default Collapse;