import type { ShipmentTableState } from "@/types/dashboard";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: ShipmentTableState = {
    page: null,
    limit: null,
    totalRecords: null,
    totalPages: null,
    data: [],
};

const shipmentTableSlice = createSlice({
    name: "shipmentTable",
    initialState,
    reducers: {
        setShipmentTable: (state, action: PayloadAction<ShipmentTableState>) => {
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.totalRecords = action.payload.totalRecords;
            state.totalPages = action.payload.totalPages;
            state.data = action.payload.data;
        },
        clearShipmentTable: (state) => {
            state.page = null;
            state.limit = null;
            state.totalRecords = null;
            state.totalPages = null;
            state.data = [];
        },
    },
});

export const { setShipmentTable, clearShipmentTable } = shipmentTableSlice.actions;
export const shipmentTableReducer = shipmentTableSlice;
