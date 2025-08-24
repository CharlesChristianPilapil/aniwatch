import type {
    LoginResponseType,
    VerificationResponseType,
} from "../utils/types/auth.type";
import { api } from "./baseApiService";

export const authService = api.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<
            LoginResponseType,
            { name: string; username: string; email: string; password: string }
        >({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation<
            LoginResponseType,
            { identifier: string; password: string }
        >({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data,
            }),
        }),
        verify: builder.mutation<
            VerificationResponseType,
            Record<string, unknown>
        >({
            query: (data) => ({
                url: "/auth/verify",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["isAnimeBookmarked", "session"],
        }),
        resendVerification: builder.mutation<
            { success: boolean; message: string },
            { user_id: number, type: string }
        >({
            query: (data) => ({
                url: "/auth/resend",
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["isAnimeBookmarked", "session"],
        }),
        changePasswordRequest: builder.mutation<
            LoginResponseType,
            { email: string }
        >({
            query: (data) => ({
                url: "/auth/reset-password/request",
                method: "POST",
                body: data,
            }),
        }),
        verifyResetRequest: builder.mutation<
            LoginResponseType,
            { code: string, user_id: number }
        >({
            query: (data) => ({
                url: "/auth/reset-password/verify",
                method: "POST",
                body: data,
            }),
        }),
        resendResetRequest: builder.mutation<
            LoginResponseType,
            { user_id: number }
        >({
            query: (data) => ({
                url: "/auth/reset-password/resend-code",
                method: "POST",
                body: data,
            }),
        }),
        resetPassword: builder.mutation<
            {success: boolean, message: string},
            { user_id: number, password: string }
        >({
            query:(data) => ({
                url: "/auth/reset-password/reset",
                method: "POST",
                body: data,
            })
        })
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useVerifyMutation,
    useResendVerificationMutation,
    useLogoutMutation,
    useChangePasswordRequestMutation,
    useVerifyResetRequestMutation,
    useResendResetRequestMutation,
    useResetPasswordMutation
} = authService;
