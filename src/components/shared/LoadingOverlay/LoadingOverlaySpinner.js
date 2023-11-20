import React from "react";
import LoadingIoLdsRing from "./LoadingIoLdsRing";
import styled from "styled-components";

const Container = styled.div`
  color: white;
  font-size: 2rem;
  text-align: center;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingOverlaySpinner = ({ message, size }) => {
  return (
    <Container id="loading-overlay--spinner">
      <LoadingIoLdsRing size={size} />
      {message && <div>{message}</div>}
    </Container>
  );
};

export default LoadingOverlaySpinner;
