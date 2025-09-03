import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";
import type { Credentials, LoginResponse, RegisterData, RegisterResponse, User } from "@/types/auth";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/auth/`,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ["user"],

    endpoints: (builder) => ({
        userRegister: builder.mutation<RegisterResponse, RegisterData>({
            query: (body) => ({
                url: "register",
                method: "POST",
                body,
            }),
            transformResponse: (response: { data: RegisterResponse }) => response.data,
            invalidatesTags: ["user"],
        }),

        userLogin: builder.mutation<LoginResponse, Credentials>({
            query: (body) => ({
                url: "login",
                method: "POST",
                body,
            }),
            transformResponse: (response: { data: LoginResponse }) => response.data,
            invalidatesTags: ["user"],
        }),

        fetchUserProfile: builder.query<User, void>({
            query: () => "me",
            providesTags: ["user"],
        }),
    }),
});

export const {
    useUserRegisterMutation,
    useUserLoginMutation,
    useFetchUserProfileQuery,
} = authApi;
