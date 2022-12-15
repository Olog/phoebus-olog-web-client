import styled from "styled-components";
import { StyledPaginationButton } from "./styles";
import {MdNavigateNext, MdNavigateBefore} from 'react-icons/md'

export const Pagination = styled.div`
    display: flex;
    & > * {
        border: 1px solid ${({theme}) => theme.colors.neutral};
    }
    & > *:not(:first-child) {
        border-left: none;
    }
`

const StyledItem = styled(StyledPaginationButton)`
    border-radius: 0;
`

export const Item = ({active, onClick, className, alt, children}) => {
    console.log({active, children})
    return (
        <StyledItem {...{active, onClick, alt}} className={`pagination-item ${className}`} >
            {children}
        </StyledItem>
    )
}

export const Prev = ({onClick, className}) => {
    return (
        <Item {...{onClick, className, alt: 'Previous'}}>
            <MdNavigateBefore />
        </Item>
    )
}

export const Next = ({onClick, className}) => {
    return (
        <Item {...{onClick, className, alt: 'Next'}}>
            <MdNavigateNext />
        </Item>
    )
}