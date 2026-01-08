import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";
import type { Subscription, SubscriptionResponse } from "@/types/subscription";
import type { CreateCompanyData, CreateCompanyResponse, CompaniesResponse, UpdateCompanyData, UpdateCompanyResponse } from "@/types/company";

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
    tagTypes: ["subscription", "company"],
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
        getCompanies: builder.query<CompaniesResponse, void>({
            query: () => ({
                url: "admin/companies",
                method: "GET",
            }),
            providesTags: ["company"],
        }),
        createCompany: builder.mutation<CreateCompanyResponse, CreateCompanyData>({
            query: (data) => ({
                url: "admin/companies",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["company"],
        }),
        updateCompany: builder.mutation<UpdateCompanyResponse, { id: number; data: UpdateCompanyData }>({
            query: ({ id, data }) => ({
                url: `admin/companies/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["company"],
        }),
    }),
});

export const {
    useGetSubscriptionsQuery,
    useUpdateSubscriptionMutation,
    useCreateSubscriptionMutation,
    useDeleteSubscriptionMutation,
    useGetCompaniesQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
} = adminApi;

