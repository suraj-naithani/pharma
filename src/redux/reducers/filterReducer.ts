import type { FilterState } from "@/types/dashboard";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

const initialState: FilterState = {
    dateRange: {
        from: (() => { const oneYearAgo = new Date(); oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1); return moment(oneYearAgo).format("YYYY-MM-DD"); })(),
        to: moment(new Date()).format("YYYY-MM-DD"),
    },
    selectedDataType: null,
    selectedChapters: [],
    selectedSearchType: null,
    searchQuery: "",
    selectedSearchItems: [],
    showSuggestions: false,
    selectedToggle: "import",
    filters: {
        "Indian Port": [],
        "H S Code": [],
        "Product Description": [],
        "Quantity Units": [],
        "Quantity": [],
        "Unit Price": [],
        "Currency": [],
        "Product Name": [],
        "Indian Company": [],
        "Foreign Company": [],
        "Foreign Country": [],
        "CAS Number": [],
    },
    session: localStorage.getItem("sessionId") || "",
};

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setSelectedToggle(state, action: PayloadAction<"import" | "export">) {
            state.selectedToggle = action.payload;
        },
        setStartDate(state, action: PayloadAction<string>) {
            state.dateRange.from = moment(new Date(action.payload)).format("YYYY-MM-DD");
        },
        setEndDate(state, action: PayloadAction<string>) {
            state.dateRange.to = moment(new Date(action.payload)).format("YYYY-MM-DD");
        },
        setSelectedDataType(state, action: PayloadAction<string>) {
            state.selectedDataType = action.payload;
            state.selectedSearchType = null;

            if (action.payload === "Cleaned") {
                state.selectedChapters = state.selectedChapters.filter(
                    (c) => c === 29 || c === 30
                );
            }
        },
        setSelectedChapters(state, action: PayloadAction<number[]>) {
            state.selectedChapters = action.payload;
        },
        toggleChapter(state, action: PayloadAction<number>) {
            const chapter = action.payload;
            const exists = state.selectedChapters.includes(chapter);

            if (exists) {
                state.selectedChapters = state.selectedChapters.filter((c) => c !== chapter);
            } else {
                state.selectedChapters = [...state.selectedChapters, chapter].sort((a, b) => a - b);
            }
        },
        setSelectedSearchType(state, action: PayloadAction<string>) {
            state.selectedSearchType = action.payload;
        },
        setSelectedSearchItems(state, action: PayloadAction<string[]>) {
            state.selectedSearchItems = action.payload;
        },
        addSearchItem(state, action: PayloadAction<string>) {
            if (!state.selectedSearchItems.includes(action.payload)) {
                state.selectedSearchItems.push(action.payload);
            }
        },
        removeSearchItem(state, action: PayloadAction<string>) {
            state.selectedSearchItems = state.selectedSearchItems.filter(
                (item) => item !== action.payload
            );
        },
        setShowSuggestions(state, action: PayloadAction<boolean>) {
            state.showSuggestions = action.payload;
        },
        setFilter(state, action: PayloadAction<Record<string, string[]>>) {
            state.filters = action.payload;
        },
        setFilterValues(state, action: PayloadAction<{ category: string; values: string[] }>) {
            if (state.filters) {
                state.filters[action.payload.category] = action.payload.values;
            }
        },
        toggleFilterValue(state, action: PayloadAction<{ category: string; value: string }>) {
            const { category, value } = action.payload;
            if (!state.filters) return;
            const currentValues = state.filters[category] || [];
            // Type guard to ensure we're working with string arrays
            if (Array.isArray(currentValues)) {
                if (currentValues.includes(value)) {
                    state.filters[category] = currentValues.filter((val: string) => val !== value);
                } else {
                    state.filters[category] = [...currentValues, value];
                }
            }
        },
        clearFilterCategory(state, action: PayloadAction<string>) {
            if (state.filters) {
                state.filters[action.payload] = [];
            }
        },
        selectAllFilterCategory(state, action: PayloadAction<{ category: string; values: string[] }>) {
            if (state.filters) {
                state.filters[action.payload.category] = action.payload.values;
            }
        },
        clearAllFilters(state) {
            state.filters = {
                "Indian Port": [],
                "H S Code": [],
                "Product Description": [],
                "Quantity Units": [],
                "Quantity": [],
                "Unit Price": [],
                "Currency": [],
                "Product Name": [],
                "Indian Company": [],
                "Foreign Company": [],
                "Foreign Country": [],
                "CAS Number": [],
            };
        },
        resetAllData(state) {
            // Reset to initial state
            state.dateRange = {
                from: (() => { const oneYearAgo = new Date(); oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1); return moment(oneYearAgo).format("YYYY-MM-DD"); })(),
                to: moment(new Date()).format("YYYY-MM-DD"),
            };
            state.selectedDataType = null;
            state.selectedChapters = [];
            state.selectedSearchType = null;
            state.searchQuery = "";
            state.selectedSearchItems = [];
            state.showSuggestions = false;
            state.selectedToggle = "import";
            state.filters = {
                "Indian Port": [],
                "H S Code": [],
                "Product Description": [],
                "Quantity Units": [],
                "Quantity": [],
                "Unit Price": [],
                "Currency": [],
                "Product Name": [],
                "Indian Company": [],
                "Foreign Company": [],
                "Foreign Country": [],
                "CAS Number": [],
            };
        }
    },
});

export const {
    setSelectedToggle,
    setStartDate,
    setEndDate,
    setSelectedDataType,
    setSelectedChapters,
    toggleChapter,
    setSelectedSearchType,
    setSelectedSearchItems,
    addSearchItem,
    removeSearchItem,
    setShowSuggestions,
    setFilter,
    setFilterValues,
    toggleFilterValue,
    clearFilterCategory,
    selectAllFilterCategory,
    clearAllFilters,
    resetAllData
} = filterSlice.actions;

export const filterReducer = filterSlice;
