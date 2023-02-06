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

export const Item = ({className, children, ...props}) => {
    return (
        <StyledItem {...props} className={`pagination-item ${className ? className : ''}`} >
            {children}
        </StyledItem>
    )
}

export const Prev = ({className, ...props}) => {
    return (
        <Item {...{alt: 'Previous', ...props}}>
            <MdNavigateBefore />
        </Item>
    )
}

export const Next = ({className, ...props}) => {
    return (
        <Item {...{alt: 'Next', ...props}}>
            <MdNavigateNext />
        </Item>
    )
}