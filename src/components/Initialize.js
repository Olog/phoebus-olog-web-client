import { LinearProgress } from "@mui/material";
import { defaultSearchPageParamsState, updateSearchPageParams } from "features/searchPageParamsReducer";
import { defaultSearchParamsState, updateSearchParams } from "features/searchParamsReducer";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import customization from "config/customization";
import { useGetUserQuery } from "api/ologApi";

const cookies = new Cookies();

const Initialize = ({children}) => {

    const dispatch = useDispatch();
    const [ready, setReady] = useState(false);

    // attempt to fetch current user if logged in
    useGetUserQuery({
        pollingInterval: customization.defaultSearchFrequency
    });

    // Initialize search params state
    useEffect(() => {

        if(!ready) {
            const initialSearchPageParams = cookies.get(customization.searchPageParamsCookie) ?? defaultSearchPageParamsState;
            dispatch(updateSearchPageParams(initialSearchPageParams));
    
            const initialSearchParams = cookies.get(customization.searchParamsCookie) ?? defaultSearchParamsState;
            dispatch(updateSearchParams(initialSearchParams));
    
            setReady(true);
        }
        
    }, [dispatch, ready]);

    if(ready) {
        return <>{children}</>
    }

    return <LinearProgress />;

};

export default Initialize;