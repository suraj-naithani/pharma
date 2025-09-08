import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { authReducer } from "./reducers/authReducer";
import { dashboardApi } from "./api/dashboardAPi";
import { filterReducer } from "./reducers/filterReducer";
import { dashboardReducer } from "./reducers/dashboardReducer";
import { shipmentTableReducer } from "./reducers/shipmentReducer";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [authReducer.name]: authReducer.reducer,
        [filterReducer.name]: filterReducer.reducer,
        [dashboardReducer.name]: dashboardReducer.reducer,
        [shipmentTableReducer.name]: shipmentTableReducer.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
