import { useCallback } from "react";

import { useLocation, useNavigate } from "react-router-dom";

const useBetaNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (path) => {
      if (location.pathname.startsWith("/beta")) {
        return navigate(`/beta${path}`);
      } else {
        return navigate(`${path}`);
      }
    },
    [location, navigate]
  );
};

export default useBetaNavigate;
