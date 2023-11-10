import { useState, useEffect } from "react"
import { useGetUserQuery } from "services/ologApi";

const useIsAuthenticated = ({setShowLogin}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const {data: user, error } = useGetUserQuery();

    /**
     * Show login if no session
     */
    useEffect(() => {
        if(user) {
            setIsAuthenticated(true);
            setShowLogin(false);
        } 
        // We get an HTTP 404 if there is 
        // no active session / aren't authenticated
        if(error) {
            if(error.status === 404) {
                setIsAuthenticated(false);
                setShowLogin(true);
            } else {
                console.error("Unexpected error while checking authentication", error);
            }
        }
    }, [error, setIsAuthenticated, setShowLogin, user]);

    return [isAuthenticated];

}

export default useIsAuthenticated;