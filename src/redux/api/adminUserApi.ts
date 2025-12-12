import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";
import type {
    RegisterUserData,
    RegisterUserResponse,
    UsersResponse,
    UserResponse,
    DeleteUserResponse,
} from "@/types/users";

export const adminUserApi = createApi({
    reducerPath: "adminUserApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/auth/`,
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
    tagTypes: ["user"],
    endpoints: (builder) => ({
        // POST /api/auth/register - Register a new user
        registerUser: builder.mutation<RegisterUserResponse, RegisterUserData>({
            query: (body) => ({
                url: "register",
                method: "POST",
                body,
            }),
            invalidatesTags: ["user"],
        }),

        // GET /api/auth/users - List all users
        getAllUsers: builder.query<UsersResponse, void>({
            query: () => ({
                url: "users",
                method: "GET",
            }),
            providesTags: ["user"],
        }),

        // GET /api/auth/users/:id - Get one user by id
        getUserById: builder.query<UserResponse, string>({
            query: (id) => ({
                url: `users/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "user", id }],
        }),

        // PUT /api/auth/users/:id - Update user by id
        updateUser: builder.mutation<UserResponse, { id: string; data: Partial<RegisterUserData> }>({
            query: ({ id, data }) => ({
                url: `users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["user"],
        }),

        // DELETE /api/auth/users/:id - Delete user by id
        deleteUser: builder.mutation<DeleteUserResponse, string>({
            query: (id) => ({
                url: `users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["user"],
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = adminUserApi;

