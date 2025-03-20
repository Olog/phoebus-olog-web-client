import { useCallback } from "react";

import { useNavigate } from "react-router-dom";

const useBetaNavigate = () => {
  const navigate = useNavigate();

  return useCallback(
    (path) => {
      return navigate(`${path}`);
    },
    [navigate]
  );
};

export default useBetaNavigate;
