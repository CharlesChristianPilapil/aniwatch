import { logout, setCredentials } from "../slices/authSlice";
import type { UserInfoType } from "../utils/types/users.type";
import { api } from "./baseApiService";

export const invalidateProfile = (result?: { info: UserInfoType; success: boolean }) => {
    if (result) {
        return [
            { type: "session" as const },
            { type: "userProfile" as const, id: result.info.username },
        ];
    }
    
    return [{ type: "session" as const }];
};

const userService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<{ info: UserInfoType, success: boolean }, void>({
            query: () => `/api/users/me`,
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data.info));
                } catch (error) {
                    console.error(error);
                    dispatch(logout());
                }
            },
            providesTags: ["session"],
        }),
        getUserInfo: builder.query<{ info: UserInfoType, success: boolean }, { username: string }>({
            query: ({ username }) => `/api/users/${username}`,
            providesTags: (result, _error, arg) => result ? [{ type: "userProfile", username: arg.username }] : [],
        }),
        updateProfile: builder.mutation<{ info: UserInfoType, success: boolean }, Record<string, unknown>>({
            query: (data) => ({
                url: "/api/users/update-profile",
                method: "PATCH",
                body: data,
                allowEmpty: ["phone_number", "bio", "city"],
            }),
            invalidatesTags: (result) => invalidateProfile(result),
        }),
        updateAvatar: builder.mutation<{ info: UserInfoType, success: boolean }, FormData>({
            query: (data) => ({
                url: "/api/users/update-avatar",
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result) => invalidateProfile(result),
        }),
        removeAvatar: builder.mutation<{ info: UserInfoType, success: boolean }, void>({
            query: () => ({
                url: "/api/users/remove-avatar",
                method: "DELETE",
            }),
            invalidatesTags: (result) => invalidateProfile(result),
        }),
        updateEmail: builder.mutation<{ info: UserInfoType, success: boolean }, { email: string }>({
            query: (data) => ({
                url: "/api/users/update/email",
                method: "POST",
                body: data,
            })
        }),
        verifyUpdate: builder.mutation<{ info: UserInfoType, success: boolean }, { type: string, code: string }>({
            query: (data) => ({
                url: "/api/users/update/verify",
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result) => invalidateProfile(result),
        }),
        resendUpdateVerification: builder.mutation<
            { info: UserInfoType, success: true },
            { type: string, field_name: string, new_value: string }
        >({
            query: (data) => ({
                url: "/api/users/update/verify/resend",
                method: "POST",
                body: data,
            })
        })
    }),
});

export const { 
    useGetMeQuery,
    useLazyGetMeQuery,
    useUpdateProfileMutation,
    useGetUserInfoQuery,
    useUpdateAvatarMutation,
    useRemoveAvatarMutation,
    useUpdateEmailMutation,
    useVerifyUpdateMutation,
    useResendUpdateVerificationMutation,
} = userService