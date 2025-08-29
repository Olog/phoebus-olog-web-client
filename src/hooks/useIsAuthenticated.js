import { useState, useEffect } from "react";
import { useShowLogin, useUser } from "features/authSlice";

export const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setShowLogin } = useShowLogin();
  const user = useUser();

  /**
   * Show login if no session
   */
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      setShowLogin(false);
    } else {
      setIsAuthenticated(false);
      setShowLogin(true);
    }
  }, [setShowLogin, user]);

  return { isAuthenticated };
};
