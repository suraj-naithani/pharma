import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/data/`,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ["dashboard"],
    endpoints: (builder) => ({
        getAllRecords: builder.mutation({
            query: (body) => ({
                url: "records-metrics",
                method: "POST",
                body,
            }),
            invalidatesTags: ["dashboard"],
        }),
        getSuggestions: builder.query({
            query: ({ informationOf, chapter, searchType, suggestion, session }) => ({
                url: `suggestion`,
                method: "GET",
                params: {
                    informationOf,
                    chapter,
                    searchType,
                    suggestion,
                    session,
                },
            }),
            providesTags: ["dashboard"],
        }),

        getTopBuyersByQuantity: builder.query({
            query: (params) => ({
                url: "top-buyers-by-quantity",
                method: "GET",
                params,
            }),
        }),
        getTopYearsByQuantity: builder.query({
            query: (params) => ({
                url: "top-years-by-quantity",
                method: "GET",
                params,
            }),
        }),
        getTopHSCodeByQuantity: builder.query({
            query: (params) => ({
                url: "top-HSCode-by-quantity",
                method: "GET",
                params,
            }),
        }),
        getTopSuppliersByQuantity: builder.query({
            query: (params) => ({
                url: "top-suppliers-by-quantity",
                method: "GET",
                params,
            }),
        }),
        getTopCountryByQuantity: builder.query({
            query: (params) => ({
                url: "top-country-by-quantity",
                method: "GET",
                params,
            }),
        }),
        getTopIndianPortByQuantity: builder.query({
            query: (params) => ({
                url: "top-indian-port-by-quantity",
                method: "GET",
                params,
            }),
        }),
        getTopBuyersByValue: builder.query({
            query: (params) => ({
                url: "top-buyers-by-value",
                method: "GET",
                params,
            }),
        }),
        getTopYearsByValue: builder.query({
            query: (params) => ({
                url: "top-years-by-value",
                method: "GET",
                params,
            }),
        }),
        getTopHSCodeByValue: builder.query({
            query: (params) => ({
                url: "top-HSCode-by-value",
                method: "GET",
                params,
            }),
        }),
        getTopSuppliersByValue: builder.query({
            query: (params) => ({
                url: "top-suppliers-by-value",
                method: "GET",
                params,
            }),
        }),
        getTopCountryByValue: builder.query({
            query: (params) => ({
                url: "top-country-by-value",
                method: "GET",
                params,
            }),
        }),
        getTopIndianPortByValue: builder.query({
            query: (params) => ({
                url: "top-indian-port-by-value",
                method: "GET",
                params,
            }),
        }),
        getSummaryStats: builder.query({
            query: (params) => ({
                url: "summary-stats",
                method: "GET",
                params,
            }),
        }),
        getFilterValues: builder.query({
            query: (params) => ({
                url: "filter-values",
                method: "GET",
                params,
            }),
        }),
    }),
});

export const {
    useGetAllRecordsMutation,
    useLazyGetSuggestionsQuery,

    useLazyGetTopBuyersByQuantityQuery,
    useLazyGetTopYearsByQuantityQuery,
    useLazyGetTopHSCodeByQuantityQuery,
    useLazyGetTopSuppliersByQuantityQuery,
    useLazyGetTopCountryByQuantityQuery,
    useLazyGetTopIndianPortByQuantityQuery,

    useLazyGetTopBuyersByValueQuery,
    useLazyGetTopYearsByValueQuery,
    useLazyGetTopHSCodeByValueQuery,
    useLazyGetTopSuppliersByValueQuery,
    useLazyGetTopCountryByValueQuery,
    useLazyGetTopIndianPortByValueQuery,

    useLazyGetSummaryStatsQuery,
    useLazyGetFilterValuesQuery,
} = dashboardApi;
