import React from "react";
import styled, { css, keyframes } from "styled-components";

const spinKeyframe = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const Container = styled.div`
  ${({ size }) => css`
    display: flex;
    justify-content: center;
    align-items: center;

    /** Modified from Loading.IO, "lds-ring" **/

    .lds-ring {
      display: inline-block;
      position: relative;
      width: ${size}rem; // 80px;
      height: ${size}rem; // 80px;
    }
    .lds-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: ${size}rem; //64px;
      height: ${size}rem; //64px;
      border: ${size / 8}rem solid #fff; //8px solid #fff;
      border-radius: 50%;
      animation: ${spinKeyframe} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: #fff transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
      animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
      animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
      animation-delay: -0.15s;
    }
  `}
`;
const LoadingIoLdsRing = ({ size = 5 }) => {
  return (
    <Container size={size}>
      <div className="lds-ring">
        <div />
        <div />
        <div />
        <div />
      </div>
    </Container>
  );
};

export default LoadingIoLdsRing;
