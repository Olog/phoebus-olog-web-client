import styled from "styled-components"

const Container = styled.div`
    ${({show}) => show ? `
        display: block !important;
    `: `
        display: none !important;
    `}
`

const Collapse = ({show, onExiting, children}) => {

    if(!show) {
        onExiting();
    }
    
    return (
        <Container show={show} >
            {children}
        </Container>
    )
}

export default Collapse;