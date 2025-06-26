import type {
    Buyer,
    Country,
    DashboardState,
    HSCode,
    Port,
    Summary,
    Supplier,
    Year
} from '@/types/dashboard';
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from '@reduxjs/toolkit';

const initialState: DashboardState = {
    summary: null,
    filter: null,

    topBuyersByQuantity: null,
    topYearsByQuantity: null,
    topHSCodeByQuantity: null,
    topSuppliersByQuantity: null,
    topCountryByQuantity: null,
    topIndianPortByQuantity: null,

    topBuyersByValue: null,
    topYearsByValue: null,
    topHSCodeByValue: null,
    topSuppliersByValue: null,
    topCountryByValue: null,
    topIndianPortByValue: null,
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
        setTopBuyersByQuantity: (state, action: PayloadAction<Buyer[]>) => {
            state.topBuyersByQuantity = action.payload;
        },
        setTopYearsByQuantity: (state, action: PayloadAction<Year[]>) => {
            state.topYearsByQuantity = action.payload;
        },
        setTopHSCodeByQuantity: (state, action: PayloadAction<HSCode[]>) => {
            state.topHSCodeByQuantity = action.payload;
        },
        setTopSuppliersByQuantity: (state, action: PayloadAction<Supplier[]>) => {
            state.topSuppliersByQuantity = action.payload;
        },
        setTopCountryByQuantity: (state, action: PayloadAction<Country[]>) => {
            state.topCountryByQuantity = action.payload;
        },
        setTopIndianPortByQuantity: (state, action: PayloadAction<Port[]>) => {
            state.topIndianPortByQuantity = action.payload;
        },
        setTopBuyersByValue: (state, action: PayloadAction<Buyer[]>) => {
            state.topBuyersByValue = action.payload;
        },
        setTopYearsByValue: (state, action: PayloadAction<Year[]>) => {
            state.topYearsByValue = action.payload;
        },
        setTopHSCodeByValue: (state, action: PayloadAction<HSCode[]>) => {
            state.topHSCodeByValue = action.payload;
        },
        setTopSuppliersByValue: (state, action: PayloadAction<Supplier[]>) => {
            state.topSuppliersByValue = action.payload;
        },
        setTopCountryByValue: (state, action: PayloadAction<Country[]>) => {
            state.topCountryByValue = action.payload;
        },
        setTopIndianPortByValue: (state, action: PayloadAction<Port[]>) => {
            state.topIndianPortByValue = action.payload;
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
    setTopYearsByQuantity,
    setTopHSCodeByQuantity,
    setTopSuppliersByQuantity,
    setTopCountryByQuantity,
    setTopIndianPortByQuantity,
    setTopBuyersByValue,
    setTopYearsByValue,
    setTopHSCodeByValue,
    setTopSuppliersByValue,
    setTopCountryByValue,
    setTopIndianPortByValue,
    clearDashboardStats
} = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice;
