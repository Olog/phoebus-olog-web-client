import React from "react";
import { styled } from "styled-components";

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
`;

const VisuallyHiddenText = ({ children }) => {
  return <StyledSpan>{children}</StyledSpan>;
};

export default VisuallyHiddenText;
