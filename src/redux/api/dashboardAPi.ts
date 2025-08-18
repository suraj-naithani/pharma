import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/`,
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
                url: "data/records-metrics",
                method: "POST",
                body,
            }),
            invalidatesTags: ["dashboard"],
        }),
        getSuggestions: builder.query({
            query: ({ informationOf, chapter, searchType, suggestion, session }) => ({
                url: `data/suggestion`,
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

        // New merged metrics routes
        getTopBuyers: builder.query({
            query: (params) => ({
                url: "metrics/top-buyers",
                method: "GET",
                params,
            }),
        }),
        getTopYears: builder.query({
            query: (params) => ({
                url: "metrics/top-years",
                method: "GET",
                params,
            }),
        }),
        getTopHSCode: builder.query({
            query: (params) => ({
                url: "metrics/top-HSCode",
                method: "GET",
                params,
            }),
        }),
        getTopSuppliers: builder.query({
            query: (params) => ({
                url: "metrics/top-suppliers",
                method: "GET",
                params,
            }),
        }),
        getTopCountry: builder.query({
            query: (params) => ({
                url: "metrics/top-country",
                method: "GET",
                params,
            }),
        }),
        getTopIndianPort: builder.query({
            query: (params) => ({
                url: "metrics/top-indian-port",
                method: "GET",
                params,
            }),
        }),
        getSummaryStats: builder.query({
            query: (params) => ({
                url: "metrics/summary-stats",
                method: "GET",
                params,
            }),
        }),
        getFilterValues: builder.query({
            query: (params) => ({
                url: "metrics/filter-values",
                method: "GET",
                params,
            }),
        }),
    }),
});

export const {
    useGetAllRecordsMutation,
    useLazyGetSuggestionsQuery,

    // New merged metrics hooks
    useLazyGetTopBuyersQuery,
    useLazyGetTopYearsQuery,
    useLazyGetTopHSCodeQuery,
    useLazyGetTopSuppliersQuery,
    useLazyGetTopCountryQuery,
    useLazyGetTopIndianPortQuery,
    useLazyGetSummaryStatsQuery,
    useLazyGetFilterValuesQuery,
} = dashboardApi;