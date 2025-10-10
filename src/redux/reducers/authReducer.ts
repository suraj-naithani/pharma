import type { AuthState, User } from "@/types/auth";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    user: null,
    isLoading: !!localStorage.getItem("token"), // Only show loading if there's a token to validate
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userExists: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isLoading = false;
        },
        userNotExist: (state) => {
            state.user = null;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { userExists, userNotExist, setLoading } = authSlice.actions;
export const authReducer = authSlice;
