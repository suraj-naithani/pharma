import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";
import type { Subscription, SubscriptionResponse } from "@/types/subscription";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/`,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            headers.set("Content-Type", "application/json");
            return headers;
        }
    }),
    tagTypes: ["subscription"],
    endpoints: (builder) => ({
        getSubscriptions: builder.query<SubscriptionResponse, void>({
            query: () => ({
                url: "subscription",
                method: "GET",
            }),
            providesTags: ["subscription"],
        }),
        updateSubscription: builder.mutation<
            { statusCode: number; message: string; data: Subscription },
            { id: number; data: Partial<Subscription> }
        >({
            query: ({ id, data }) => ({
                url: `subscription/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["subscription"],
        }),
        createSubscription: builder.mutation<
            { statusCode: number; message: string; data: Subscription },
            Partial<Subscription>
        >({
            query: (data) => ({
                url: "subscription",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["subscription"],
        }),
        deleteSubscription: builder.mutation<
            { statusCode: number; message: string },
            number
        >({
            query: (id) => ({
                url: `subscription/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["subscription"],
        }),
    }),
});

export const {
    useGetSubscriptionsQuery,
    useUpdateSubscriptionMutation,
    useCreateSubscriptionMutation,
    useDeleteSubscriptionMutation,
} = adminApi;

