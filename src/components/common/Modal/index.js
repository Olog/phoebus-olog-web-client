import * as Styled from "./styles";
import { AiOutlineClose } from 'react-icons/ai'

const Modal = ({title, show, onConfirm, onClose, children, className, ...props}) => {

    return (
        <Styled.StyledModal
            onBackgroundClick={onClose}
            onEscapeKeydown={onClose}
            isOpen={show}
            className={className}
            {...props}
        >
            {children}
        </Styled.StyledModal>
    );
};

const Header = ({onClose, className, children}) => {
    return (
        <Styled.Header className={className}>
            <div>{children}</div>
            <span onClick={onClose} className='close' ><AiOutlineClose /></span>
        </Styled.Header>
    )
};
const Title = Styled.Title;
const Body = Styled.Body;
const Footer = Styled.Footer;

export {Header, Title, Body, Footer}

export default Modal;