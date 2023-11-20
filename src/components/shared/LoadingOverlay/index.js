import React from "react";
import LoadingOverlaySpinner from "./LoadingOverlaySpinner";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const fadeIn = keyframes`
    0% {
        visibility: hidden;
        opacity: 0;
    }
    100% {
        visibility: visible;
        opacity: 1;
    }
`;
const fadeOut = keyframes`
    0% {
        visibility: visible;
        opacity: 1;
    }
    100% {
        visibility: hidden;
        opacity: 0;
    }
`;

const OverlayContainer = styled.div`
  ${({ show }) =>
    show
      ? `
        visibility: visible;
        opacity: 1;
    `
      : `
        visibility: hidden;
        opacity: 0;
    `}
  animation: ${({ show }) => (show ? fadeIn : fadeOut)} 0.6s ease;
  width: 100%;
  height: 100%;
  background-color: rgba(97, 97, 97, 0.7);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingOverlay = ({
  active = true,
  message,
  className,
  size,
  children
}) => {
  return (
    <Container
      id="loading-overlay--container"
      className={className}
    >
      <OverlayContainer
        id="loading-overlay--overlay"
        show={active}
      >
        <LoadingOverlaySpinner
          message={message}
          size={size}
        />
      </OverlayContainer>
      {children}
    </Container>
  );
};

export default LoadingOverlay;
