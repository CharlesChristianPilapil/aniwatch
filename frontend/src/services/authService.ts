import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "../utils/constants/baseApiUrl";
import type {
    LoginResponseType,
    VerificationResponseType,
} from "../utils/types/auth.type";

export const authService = createApi({
    reducerPath: "auth-services",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/auth/`,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        register: builder.mutation<
            LoginResponseType,
            { name: string; username: string; email: string; password: string }
        >({
            query: (data) => ({
                url: "/register",
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation<
            LoginResponseType,
            { identifier: string; password: string }
        >({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data,
            }),
        }),
        verify: builder.mutation<
            VerificationResponseType,
            Record<string, unknown>
        >({
            query: (data) => ({
                url: "/verify",
                method: "POST",
                body: data,
            }),
        }),
        resendVerification: builder.mutation<
            { success: boolean; message: string },
            { user_id: number }
        >({
            query: (data) => ({
                url: "/resend",
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useVerifyMutation,
    useResendVerificationMutation,
    useLogoutMutation,
} = authService;
