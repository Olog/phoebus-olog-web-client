const { default: styled } = require("styled-components")

const StyledSpan = styled.span`
    &:not(:focus):not(:active) {
        clip: rect(0 0 0 0); 
        clip-path: inset(100%); 
        height: 1px; 
        overflow: hidden; 
        position: absolute; 
        white-space: nowrap; 
        width: 1px; 
    }
`

const VisuallyHiddenText = ({text}) => {
    return <StyledSpan>{text}</StyledSpan>
}

export default VisuallyHiddenText;