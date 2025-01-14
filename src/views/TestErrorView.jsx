import React, { useEffect } from "react";

export const TestErrorView = () => {
  useEffect(() => {
    throw new Error("Test Error");
  }, []);

  return <div>Test Error Page</div>;
};
