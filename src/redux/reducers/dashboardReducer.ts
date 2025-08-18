import type {
    DashboardState,
    Summary
} from '@/types/dashboard';
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from '@reduxjs/toolkit';

const initialState: DashboardState = {
    summary: null,
    filter: null,
    topBuyers: null,
    topYears: null,
    topHSCode: null,
    topSuppliers: null,
    topCountry: null,
    topIndianPort: null,
    valueMetrics: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setSummaryStats: (state, action: PayloadAction<Summary>) => {
            state.summary = action.payload;
        },
        setFilterData: (state, action: PayloadAction<any>) => {
            state.filter = action.payload;
        },
        setTopBuyers: (state, action: PayloadAction<any>) => {
            state.topBuyers = action.payload;
        },
        setTopYears: (state, action: PayloadAction<any>) => {
            state.topYears = action.payload;
        },
        setTopHSCode: (state, action: PayloadAction<any>) => {
            state.topHSCode = action.payload;
        },
        setTopSuppliers: (state, action: PayloadAction<any>) => {
            state.topSuppliers = action.payload;
        },
        setTopCountry: (state, action: PayloadAction<any>) => {
            state.topCountry = action.payload;
        },
        setTopIndianPort: (state, action: PayloadAction<any>) => {
            state.topIndianPort = action.payload;
        },
        setValueMetrics: (state, action: PayloadAction<any>) => {
            state.valueMetrics = action.payload;
        },
        clearDashboardStats: (state) => {
            Object.assign(state, initialState);
        },
    },
});

export const {
    setSummaryStats,
    setFilterData,
    setTopBuyers,
    setTopYears,
    setTopHSCode,
    setTopSuppliers,
    setTopCountry,
    setTopIndianPort,
    setValueMetrics,
    clearDashboardStats
} = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice;