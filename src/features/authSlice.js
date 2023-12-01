import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";
import { ologApi } from "api/ologApi";

const initialState = {
    user: null,
    showLogin: false,
    showLogout: false
}

const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setShowLogin: (state, action) => {
            state.showLogin = action.payload;
        },
        setShowLogout: (state, action) => {
            state.showLogout = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addMatcher(
            // On login, set the user
            ologApi.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                state.user = payload;
            }
        ).addMatcher(
            // on call the get the user, set the user
            ologApi.endpoints.getUser.matchFulfilled,
            (state, {payload}) => {
                state.user = payload;
            }
        ).addMatcher(
            // on logout, clear the user
            ologApi.endpoints.logout.matchFulfilled,
            (state) => {
                state.user = null;
            }
        ).addMatcher(
            // on failure to get user data, clear the user state
            ologApi.endpoints.getUser.matchRejected,
            (state) => {
                state.user = null;
            }
        )
    }
});

export const useUser = () => useSelector(state => state.auth.user);

export const useShowLogin = () => {
    const dispatch = useDispatch();
    const showLogin = useSelector(state => state.auth.showLogin);
    const setShowLogin = useCallback((val) => {
        dispatch(authSlice.actions.setShowLogin(val));
    }, [dispatch])

    return {
        showLogin, setShowLogin
    }

}

export const useShowLogout = () => {
    const dispatch = useDispatch();
    const showLogout = useSelector(state => state.auth.showLogout);
    const setShowLogout = useCallback((val) => {
        dispatch(authSlice.actions.setShowLogout(val));
    }, [dispatch])

    return {
        showLogout, setShowLogout
    }

}
export default authSlice.reducer;
