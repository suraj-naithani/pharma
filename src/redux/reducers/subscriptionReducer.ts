import { createSlice } from "@reduxjs/toolkit";
import type { Subscription } from "@/types/subscription";

interface SubscriptionState {
    subscriptions: Subscription[];
    isLoading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    subscriptions: [],
    isLoading: false,
    error: null,
};

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        setSubscriptions: (state, action) => {
            state.subscriptions = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearSubscriptions: (state) => {
            state.subscriptions = [];
            state.isLoading = false;
            state.error = null;
        },
        updateSubscription: (state, action) => {
            const { id, data } = action.payload;
            const index = state.subscriptions.findIndex(sub => sub.id === id);
            if (index !== -1) {
                state.subscriptions[index] = { ...state.subscriptions[index], ...data };
            }
        },
    },
});

export const {
    setSubscriptions,
    setLoading,
    setError,
    clearSubscriptions,
    updateSubscription,
} = subscriptionSlice.actions;

export const subscriptionReducer = subscriptionSlice;
export default subscriptionSlice.reducer;
