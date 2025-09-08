import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/clickhouse-metrics/`,
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

        getAllTopMetrics: builder.query({
            query: (params) => ({
                url: "all-top-metrics",
                method: "GET",
                params,
            }),
            providesTags: ["dashboard"],
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

        getShipmentTable: builder.query({
            query: (params) => ({
                url: "clickhouse",
                method: "GET",
                params,
            }),
        }),
        downloadDataAsCSV: builder.mutation({
            query: (params) => ({
                url: "download-csv",
                method: "GET",
                params,
                responseHandler: async (response) => {
                    const blob = await response.blob();
                    const contentDisposition = response.headers.get('content-disposition');
                    let filename = 'pharmaceutical_data.csv';

                    if (contentDisposition) {
                        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                        if (filenameMatch) {
                            filename = filenameMatch[1];
                        }
                    }

                    return { blob, filename };
                },
            }),
        }),
        searchFilters: builder.query({
            query: ({ search, informationOf, startDate, endDate }) => ({
                url: "filters/search",
                method: "GET",
                params: {
                    search,
                    informationOf,
                    startDate,
                    endDate,
                },
            }),
            providesTags: ["dashboard"],
        }),
    }),
});

export const {
    useGetAllRecordsMutation,
    useLazyGetSuggestionsQuery,
    useLazyGetAllTopMetricsQuery,
    useLazyGetSummaryStatsQuery,
    useLazyGetFilterValuesQuery,
    useLazyGetShipmentTableQuery,
    useDownloadDataAsCSVMutation,
    useLazySearchFiltersQuery,
} = dashboardApi;