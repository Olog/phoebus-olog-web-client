import React, { useEffect } from "react";

const Collapse = ({ show, onExiting, children }) => {
  useEffect(() => {
    if (!show) {
      onExiting();
    }
    // eslint-disable-next-line
  }, [show]);

  return <>{show ? children : null}</>;
};

export default Collapse;
