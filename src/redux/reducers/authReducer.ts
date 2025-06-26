import type { AuthState, User } from "@/types/auth";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    user: null,
    isLoading: true,
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
    },
});

export const { userExists, userNotExist } = authSlice.actions;
export const authReducer = authSlice;
