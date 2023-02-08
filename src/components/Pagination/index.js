import { StyledListItem, StyledPagination, StyledPaginationButton } from "./styles";
import {MdNavigateNext, MdNavigateBefore} from 'react-icons/md'

export const Pagination = ({className, children}) => {
    return (
        <StyledPagination className={className} aria-label='pagination controls'>
            <ul>
                {children}
            </ul>
        </StyledPagination>
    )
}

export const PaginationItem = ({className, active, disabled, label, children, ...props}) => {
    return (
        <StyledListItem {...props} className={className} >
            <StyledPaginationButton aria-current={active} aria-label={label} disabled={disabled} >
                {children}
            </StyledPaginationButton>
        </StyledListItem>
    )
}

export const Prev = ({className, ...props}) => {
    return (
        <PaginationItem {...{className, ...props}}>
            <MdNavigateBefore aria-label="go to previous page" />
        </PaginationItem>
    )
}

export const Next = ({className, ...props}) => {
    return (
        <PaginationItem {...{className, ...props}} >
            <MdNavigateNext aria-label="go to next page" />
        </PaginationItem>
    )
}