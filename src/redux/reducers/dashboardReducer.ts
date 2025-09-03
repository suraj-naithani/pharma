import type {
    DashboardState,
    Summary
} from '@/types/dashboard';
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from '@reduxjs/toolkit';

const initialState: DashboardState = {
    summary: null,
    filter: null,
    topBuyersByQuantity: null,
    topBuyersByValue: null,
    topYearsByQuantity: null,
    topYearsByValue: null,
    topHSCodeByQuantity: null,
    topHSCodeByValue: null,
    topSuppliersByQuantity: null,
    topSuppliersByValue: null,
    topCountryByQuantity: null,
    topCountryByValue: null,
    topIndianPortByQuantity: null,
    topIndianPortByValue: null,
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
        setTopBuyersByQuantity: (state, action: PayloadAction<any>) => {
            state.topBuyersByQuantity = action.payload;
        },
        setTopBuyersByValue: (state, action: PayloadAction<any>) => {
            state.topBuyersByValue = action.payload;
        },
        setTopYearsByQuantity: (state, action: PayloadAction<any>) => {
            state.topYearsByQuantity = action.payload;
        },
        setTopYearsByValue: (state, action: PayloadAction<any>) => {
            state.topYearsByValue = action.payload;
        },
        setTopHSCodeByQuantity: (state, action: PayloadAction<any>) => {
            state.topHSCodeByQuantity = action.payload;
        },
        setTopHSCodeByValue: (state, action: PayloadAction<any>) => {
            state.topHSCodeByValue = action.payload;
        },
        setTopSuppliersByQuantity: (state, action: PayloadAction<any>) => {
            state.topSuppliersByQuantity = action.payload;
        },
        setTopSuppliersByValue: (state, action: PayloadAction<any>) => {
            state.topSuppliersByValue = action.payload;
        },
        setTopCountryByQuantity: (state, action: PayloadAction<any>) => {
            state.topCountryByQuantity = action.payload;
        },
        setTopCountryByValue: (state, action: PayloadAction<any>) => {
            state.topCountryByValue = action.payload;
        },
        setTopIndianPortByQuantity: (state, action: PayloadAction<any>) => {
            state.topIndianPortByQuantity = action.payload;
        },
        setTopIndianPortByValue: (state, action: PayloadAction<any>) => {
            state.topIndianPortByValue = action.payload;
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
    setTopBuyersByQuantity,
    setTopBuyersByValue,
    setTopYearsByQuantity,
    setTopYearsByValue,
    setTopHSCodeByQuantity,
    setTopHSCodeByValue,
    setTopSuppliersByQuantity,
    setTopSuppliersByValue,
    setTopCountryByQuantity,
    setTopCountryByValue,
    setTopIndianPortByQuantity,
    setTopIndianPortByValue,
    setValueMetrics,
    clearDashboardStats
} = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice;